import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Firebase configuration and initialization
let firebaseConfig;

if (window.location.hostname.includes('netlify.app')) {
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDuKns6v5EOUDL-aZXMA2i6223aquQzo1E",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "voter-card-scanner.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "voter-card-scanner",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "voter-card-scanner.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "665299220821",
    appId: process.env.FIREBASE_APP_ID || "1:665299220821:web:f8025478a24f5375c697dc",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-G88F77H8VR",
    databaseURL: "https://voter-card-scanner-default-rtdb.asia-southeast1.firebasedatabase.app"
  };
} else {
  firebaseConfig = config.firebaseConfig;
  if (!firebaseConfig.databaseURL) {
    firebaseConfig.databaseURL = "https://voter-card-scanner-default-rtdb.asia-southeast1.firebasedatabase.app";
  }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

document.getElementById("finger-upload").addEventListener("change", async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const voterId = localStorage.getItem("voter_id");
  if (!voterId) {
    showError("Error: Voter ID not found. Please login first.");
    return;
  }

  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join('');

    const voterDoc = await getDoc(doc(db, "Voter detials", voterId));

    if (!voterDoc.exists()) {
      showError("Error: Voter record not found in database.");
      return;
    }

    const voterData = voterDoc.data();
    const storedHash = voterData.hash;

    if (!storedHash) {
      showError("No fingerprint record found. Please register your fingerprint first.", true);
      return;
    }

    if (hashHex === storedHash) {
      document.getElementById("upload-status").innerHTML = `
        <div class="alert alert-success">
          <strong>Verification Successful!</strong><br>
          Fingerprint matches the stored record.<br>
          <button id="assignStationBtn" class="btn btn-primary mt-3">Assign to Station</button>
        </div>
      `;
      localStorage.setItem("fingerprint_verified", "true");
      document.getElementById("assignStationBtn").addEventListener("click", assignToStation);
    } else {
      showError("Fingerprint does not match the stored record.");
      localStorage.setItem("fingerprint_verified", "false");
    }
  } catch (err) {
    console.error("Error:", err);
    showError("Error processing fingerprint. Please try again.");
  }
});

async function assignToStation() {
  const voterId = localStorage.getItem("voter_id");
  const assignBtn = document.getElementById("assignStationBtn");
  const statusDiv = document.getElementById("upload-status");

  try {
    // Clear any previous messages
    const existingAlerts = statusDiv.querySelectorAll('.alert');
    existingAlerts.forEach(alert => {
      if (!alert.classList.contains('alert-success')) alert.remove();
    });

    assignBtn.disabled = true;
    assignBtn.textContent = "Processing...";

    // Check for active stations
    const { activeStations, error } = await checkActiveStations();

    if (error) {
      statusDiv.innerHTML += `
        <div class="alert alert-warning mt-3" id="stationAlert">
          <strong>${error}</strong><br>
          <button id="retryBtn" class="btn btn-warning mt-2">Retry Now</button>
        </div>
      `;

      document.getElementById("retryBtn").addEventListener("click", async () => {
        document.getElementById("stationAlert").remove();
        await assignToStation(); // Recursively call the function
      });

      assignBtn.disabled = false;
      assignBtn.textContent = "Assign to Station";
      return;
    }

    // If we have active stations, proceed with assignment
    const selectedStation = activeStations[0];
    const currentTime = Date.now();

    // Update station with new voter ID
    const updatedVoterList = [...selectedStation.currentVoterIds, voterId];
    await set(ref(rtdb, `stations/${selectedStation.id}`), {
      session: "active",
      lastActive: currentTime,
      currentVoterIds: updatedVoterList
    });

    // Update Firestore with verification status
    const voterDoc = await getDoc(doc(db, "Voter detials", voterId));
    const voterData = voterDoc.data();

    await setDoc(doc(db, "Voter detials", voterId), {
      ...voterData,
      hasVerified: true,
      verifiedAt: currentTime
    });

    statusDiv.innerHTML += `
      <div class="alert alert-success mt-3">
        <strong>Station Assigned Successfully!</strong><br>
        You have been assigned to <strong>${selectedStation.id}</strong>.
        <div class="mt-3">
          <button onclick="window.location.href='index.html'" class="btn btn-primary">Back to Home</button>
        </div>
      </div>
    `;

    assignBtn.disabled = true;
    assignBtn.textContent = "Assigned to Station";
  } catch (error) {
    console.error("Assignment error:", error);
    statusDiv.innerHTML += `
      <div class="alert alert-danger mt-3">
        Error assigning to station. Please try again.
      </div>
    `;
    assignBtn.disabled = false;
    assignBtn.textContent = "Retry Assign to Station";
  }
}

async function checkActiveStations() {
  try {
    const stationsRef = ref(rtdb, "stations");
    const stationsSnapshot = await get(stationsRef);

    if (!stationsSnapshot.exists()) {
      return { error: "No stations found in database. Please contact an administrator." };
    }

    const stationsData = stationsSnapshot.val();
    const activeStations = Object.entries(stationsData)
      .filter(([_, data]) => data.session === "active")
      .map(([id, data]) => ({
        id,
        lastActive: data.lastActive || 0,
        currentVoterIds: data.currentVoterIds || []
      }));

    if (activeStations.length === 0) {
      return { error: "No active stations available. Please try again." };
    }

    // Sort by lastActive timestamp (oldest first)
    activeStations.sort((a, b) => a.lastActive - b.lastActive);
    return { activeStations };
  } catch (error) {
    console.error("Error checking stations:", error);
    return { error: "Error checking station status. Please try again." };
  }
}

function showError(message, showBackButton = false) {
  let html = `
    <div class="alert alert-danger">
      <strong>Error!</strong> ${message}
  `;

  if (showBackButton) {
    html += `<br><button onclick="window.location.href='scan.html'" class="btn btn-primary mt-3">Go Back</button>`;
  }

  html += `</div>`;
  document.getElementById("upload-status").innerHTML = html;
}