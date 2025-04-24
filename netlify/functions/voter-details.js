const admin = require('firebase-admin');

let db;

try {
  // Debug: Print the raw environment variable string
  console.log("Raw FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT);

  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL // Add this if you use Realtime Database
    });
  }
  db = admin.firestore();
} catch (error) {
  console.error("Firebase Admin SDK Initialization Error:", error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Firebase Admin SDK Initialization Failed", details: error.message }),
  };
}

exports.handler = async (event) => {
  console.log("Function invoked!");
  console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT); // This line is already present

  const voterId = event.queryStringParameters.voter_id;

  if (!voterId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing voter_id parameter" }) };
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
      return { statusCode: 404, body: JSON.stringify({ error: "Voter details not found" }) };
    }
  } catch (error) {
    console.error('Error fetching voter details:', error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch voter details" }) };
  }
};

try {
  console.log("Function invoked!");
  console.log("Environment:", process.env);
} catch (error) {
  console.error("Error logging environment:", error);
  return { statusCode: 500, body: JSON.stringify({ error: "Error logging environment", details: error.message }) };
}