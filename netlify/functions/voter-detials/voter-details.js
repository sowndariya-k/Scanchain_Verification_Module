const admin = require('firebase-admin');

let db;

try {
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
    console.log("FIREBASE_SERVICE_ACCOUNT:", process.env.FIREBASE_SERVICE_ACCOUNT);
  
    return {
      statusCode: 500, // Intentionally returning an error to see the output
      body: JSON.stringify({ error: "Basic function test", account: process.env.FIREBASE_SERVICE_ACCOUNT ? "Present" : "Missing" }),
    };
  };
  {
    "name": "voter-details-function", // You can choose any name
    "version": "1.0.0",
    "dependencies": {
      "firebase-admin": "^12.1.0" // Use the latest version or the one you prefer
    }
  }

  /home/kavinkumar/Projects/update/Scanchain_Verification_Module/netlify/functions