const { v4: uuidv4 } = require('uuid');
const tf = require('@tensorflow/tfjs-node');
const firestoreDB = require("../config");

async function loadModel() {
    const model = await tf.loadGraphModel('https://storage.googleapis.com/mlgc-prediction-model/model-in-prod/model.json');
    return model;
}

async function predictClassification(image) {
    try {
        const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        const model = await loadModel();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

        let suggest;
        if (label === 'Cancer') {
            suggest = 'Segera periksa ke dokter!';
        } else {
            suggest = 'Penyakit kanker tidak terdeteksi.';
        }

        return {
            label,
            confidenceScore,
            suggest,
        };
    } catch (error) {
        throw new Error('Terjadi kesalahan dalam melakukan prediksi');
    }
}

async function savePrediction(data) {
    return await firestoreDB.collection('predictions').doc(data.id).set(data);
}

async function getPredictionHistory() {
    const snapshot = await firestoreDB.collection('predictions').get();
    const predictions = [];
    snapshot.forEach((doc) => {
        predictions.push(doc.data());
    });
    return predictions;
}

// Fungsi untuk menangani prediksi
const predict = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        });
    }

    const { label, suggest } = await predictClassification(req.file.buffer);

    const responseData = {
        id: uuidv4(),
        result: label,
        suggestion: suggest,
        createdAt: new Date().toISOString(),
    };

    await savePrediction(responseData);

    return res.json({
        status: 'success',
        message: 'Model is predicted successfully',
        data: responseData
    });
};

const history = async (req, res) => {
    const predictions = await getPredictionHistory();

    return res.json({
        status: 'success',
        data: predictions
    });
}

module.exports = { predict, history };
