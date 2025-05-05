import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Check if we're in a production environment (Netlify)
let firebaseConfig;

// Try to get config from environment variables first (for Netlify)
if (window.location.hostname.includes('netlify.app')) {
  console.log("Running on Netlify, checking for environment variables");
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDuKns6v5EOUDL-aZXMA2i6223aquQzo1E",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "voter-card-scanner.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "voter-card-scanner",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "voter-card-scanner.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "665299220821",
    appId: process.env.FIREBASE_APP_ID || "1:665299220821:web:f8025478a24f5375c697dc",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-G88F77H8VR"
  };
} else {
  // Use the config.js file for local development
  firebaseConfig = config.firebaseConfig;
}

console.log("Firebase config loaded:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const voter_id = localStorage.getItem("voter_id");
if (!voter_id) {
  alert("No voter ID found. Redirecting to login page.");
  window.location.href = "index.html";
}

async function fetchVoterDetails(voter_id) {
  console.log("Fetching voter details for ID:", voter_id);
  const voterRef = doc(db, "Voter detials", voter_id);
  try {
    const docSnap = await getDoc(voterRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Voter data retrieved:", data);
      displayVoterDetails(data);
      hashData(data);
    } else {
      console.error("No voter data found for ID:", voter_id);
      document.getElementById("voter-details").innerHTML = "<div class='alert alert-danger'>No voter data found.</div>";
    }
  } catch (error) {
    console.error("Error fetching voter details:", error);
    document.getElementById("voter-details").innerHTML = `<div class='alert alert-danger'>Error fetching voter details: ${error.message}</div>`;
  }
}

function displayVoterDetails(data) {
  const hasVoted = data.hasVoted;
  if(hasVoted){
    const html = `
    <p><strong>EPIC No:</strong> ${data.voter_id}</p>
    <p><strong>Name:</strong> ${data.Name}</p>
    <p><strong>Age:</strong> ${data.Age}</p>
    <p><strong>Gender:</strong> ${data.Gender}</p>
    <p><strong>Parent/Spouse:</strong> ${data["Parent/Spouse"]}</p>
    <p><strong>State:</strong> ${data.State}</p>
    <p><strong>District:</strong> ${data.District}</p>
    <p><strong>Assembly Constituency:</strong> ${data["Assembly Constituency"]}</p>
    <p><strong>Parliamentary Constituency:</strong> ${data["Parliamentary Constituency"]}</p>
    <p><strong>Part Name:</strong> ${data["Part Name"]}</p>
    <p><strong>Part No:</strong> ${data["Part No"]}</p>
    <p><strong>Serial No:</strong> ${data["Serial No"]}</p>
    <div class="alert alert-warning">
          <strong>Already Voted!</strong><br>
          The voter have already casted their vote.<br>
          <button onclick="window.location.href='index.html'" class="btn btn-primary mt-3">Go Back</button>
        </div>
  `;
    document.getElementById("voter-details").innerHTML = html;

  }else{
    const html = `
    <p><strong>EPIC No:</strong> ${data.voter_id}</p>
    <p><strong>Name:</strong> ${data.Name}</p>
    <p><strong>Age:</strong> ${data.Age}</p>
    <p><strong>Gender:</strong> ${data.Gender}</p>
    <p><strong>Parent/Spouse:</strong> ${data["Parent/Spouse"]}</p>
    <p><strong>State:</strong> ${data.State}</p>
    <p><strong>District:</strong> ${data.District}</p>
    <p><strong>Assembly Constituency:</strong> ${data["Assembly Constituency"]}</p>
    <p><strong>Parliamentary Constituency:</strong> ${data["Parliamentary Constituency"]}</p>
    <p><strong>Part Name:</strong> ${data["Part Name"]}</p>
    <p><strong>Part No:</strong> ${data["Part No"]}</p>
    <p><strong>Serial No:</strong> ${data["Serial No"]}</p>
    <div class="mt-4 text-center">
      <button id="fingerprint-btn" class="btn btn-success btn-lg mr-2">Fingerprint Scan</button>
      <button id="eyeball-btn" class="btn btn-info btn-lg">Eyeball Scan</button>
    </div>
  `;
  document.getElementById("voter-details").innerHTML = html;
  // Add event listeners to the buttons
  document.getElementById("fingerprint-btn").addEventListener("click", () => {
        window.location.href = "fingerprint.html";
      });
  document.getElementById("eyeball-btn").addEventListener("click", () => {
        window.location.href = "eyeball.html";
      });
  }
}

async function hashData(data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
                      .map(b => b.toString(16).padStart(2, '0'))
                      .join('');
  console.log("Hashed Voter Data:", hashHex);
  localStorage.setItem("voter_data_hash", hashHex);
  // Remove the automatic redirect
}

fetchVoterDetails(voter_id);
