const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const uid = 'AuuV0I9cUkOd9pAOhpAbhEe9ziR2';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set for user:', uid);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  }); 