import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Firebase configuration (ensure this matches your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDuKns6v5EOUDL-aZXMA2i6223aquQzo1E",
    authDomain: "voter-card-scanner.firebaseapp.com",
    projectId: "voter-card-scanner",
    storageBucket: "voter-card-scanner.appspot.com",
    messagingSenderId: "665299220821",
    appId: "1:665299220821:web:f8025478a24f5375c697dc",
    measurementId: "G-G88F77H8VR"
};

console.log("Firebase config loaded in booth_login.js:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const boothLoginForm = document.getElementById('boothLoginForm');
    const loginError = document.getElementById('loginError');
    const loadingMessage = document.getElementById('loading');

    boothLoginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const boothId = boothLoginForm.elements.boothId.value.trim();
        const officerId = boothLoginForm.elements.officerId.value.trim();
        const password = boothLoginForm.elements.password.value;

        loginError.style.display = 'none';
        loadingMessage.style.display = 'block';

        try {
            const credentialRef = doc(db, "officer_credentials", boothId); // Use boothId as document ID
            const docSnap = await getDoc(credentialRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data && data.officerId === officerId && data.password === password) {
                    localStorage.setItem('booth_id', boothId);
                    localStorage.setItem('officer_id', officerId);
                    window.location.href = 'scan.html';
                } else {
                    loginError.style.display = 'block'; // Incorrect Officer ID or Password for this Booth
                }
            } else {
                loginError.style.display = 'block'; // Booth ID not found
            }
        } catch (error) {
            console.error("Error fetching officer credentials:", error);
            loginError.textContent = "An error occurred during login.";
            loginError.style.display = 'block';
        } finally {
            loadingMessage.style.display = 'none';
        }
    });
});