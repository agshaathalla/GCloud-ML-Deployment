const { Firestore } = require('@google-cloud/firestore');

const firestoreDB = new Firestore({
    projectId: 'submissionmlgc-agshaathalla',
    keyFilename: 'serviceAccount.json',
});

module.exports = firestoreDB;