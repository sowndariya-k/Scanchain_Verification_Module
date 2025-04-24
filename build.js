// This script helps with the Netlify build process
const fs = require('fs');
const path = require('path');

// Create a file with environment variables for the browser
const envContent = `
// Environment variables for Netlify
window._env = {
  FIREBASE_API_KEY: "${process.env.FIREBASE_API_KEY || 'AIzaSyDuKns6v5EOUDL-aZXMA2i6223aquQzo1E'}",
  FIREBASE_AUTH_DOMAIN: "${process.env.FIREBASE_AUTH_DOMAIN || 'voter-card-scanner.firebaseapp.com'}",
  FIREBASE_PROJECT_ID: "${process.env.FIREBASE_PROJECT_ID || 'voter-card-scanner'}",
  FIREBASE_STORAGE_BUCKET: "${process.env.FIREBASE_STORAGE_BUCKET || 'voter-card-scanner.appspot.com'}",
  FIREBASE_MESSAGING_SENDER_ID: "${process.env.FIREBASE_MESSAGING_SENDER_ID || '665299220821'}",
  FIREBASE_APP_ID: "${process.env.FIREBASE_APP_ID || '1:665299220821:web:f8025478a24f5375c697dc'}",
  FIREBASE_MEASUREMENT_ID: "${process.env.FIREBASE_MEASUREMENT_ID || 'G-G88F77H8VR'}"
};
`;

// Write the environment variables to a file
fs.writeFileSync(path.join(__dirname, 'env-vars.js'), envContent);

console.log('Environment variables file created successfully!'); 