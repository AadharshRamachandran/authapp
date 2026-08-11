const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./serviceAccountKey.json');

const app = admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

const auth = getAuth(app);

module.exports = auth;