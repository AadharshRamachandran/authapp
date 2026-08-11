const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

const auth = getAuth(app);

module.exports = auth;