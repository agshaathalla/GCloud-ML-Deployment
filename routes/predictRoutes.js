const express = require('express');
const upload = require('../middlewares/multerConfig');
const { predict, history } = require('../controllers/predictController');

const router = express.Router();

router.post('/', upload.single('image'), predict);
router.get('/histories', history);

// Menangani error untuk ukuran file yang terlalu besar
router.use((err, req, res, next) => {
    // console.log("error", err);
    // if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                status: 'fail',
                message: `Payload content length greater than maximum allowed: 1000000`
            });
        } else {
            return res.status(400).json({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            });
        }
    // }
    // next(err);
});

// Menangani error umum
router.use((err, req, res, next) => {
    return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
});

module.exports = router;
