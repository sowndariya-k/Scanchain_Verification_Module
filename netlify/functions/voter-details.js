const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL // If you need Realtime Database
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const voterId = event.queryStringParameters.voter_id;

  if (!voterId) {
    return { statusCode: 400, body: 'Missing voter_id parameter' };
  }

  try {
    const docRef = db.collection('Voter detials').doc(voterId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return {
        statusCode: 200,
        body: JSON.stringify(docSnap.data()),
      };
    } else {
      return { statusCode: 404, body: 'Voter details not found' };
    }
  } catch (error) {
    console.error('Error fetching voter details:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch voter details' }) };
  }
};