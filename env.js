// This script helps with environment variables in the browser
window.process = window.process || {};
window.process.env = window.process.env || {};

// Function to get environment variables
function getEnvVar(name) {
  // Check if we're in a Netlify environment
  if (window.location.hostname.includes('netlify.app')) {
    // For Netlify, we'll use a global variable that can be set during build
    return window._env && window._env[name] ? window._env[name] : null;
  }
  return null;
}

// Set up environment variables
window.process.env.FIREBASE_API_KEY = getEnvVar('FIREBASE_API_KEY') || "AIzaSyDuKns6v5EOUDL-aZXMA2i6223aquQzo1E";
window.process.env.FIREBASE_AUTH_DOMAIN = getEnvVar('FIREBASE_AUTH_DOMAIN') || "voter-card-scanner.firebaseapp.com";
window.process.env.FIREBASE_PROJECT_ID = getEnvVar('FIREBASE_PROJECT_ID') || "voter-card-scanner";
window.process.env.FIREBASE_STORAGE_BUCKET = getEnvVar('FIREBASE_STORAGE_BUCKET') || "voter-card-scanner.appspot.com";
window.process.env.FIREBASE_MESSAGING_SENDER_ID = getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || "665299220821";
window.process.env.FIREBASE_APP_ID = getEnvVar('FIREBASE_APP_ID') || "1:665299220821:web:f8025478a24f5375c697dc";
window.process.env.FIREBASE_MEASUREMENT_ID = getEnvVar('FIREBASE_MEASUREMENT_ID') || "G-G88F77H8VR"; 