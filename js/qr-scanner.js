function onScanSuccess(qrMessage) {
    document.getElementById("qr-result").innerText = "QR Code Scanned: " + qrMessage;
    localStorage.setItem("voter_id", qrMessage);
    // Redirect to voter details page after a brief delay
    setTimeout(() => {
      window.location.href = "voter.html";
    }, 1500);
  }
  
  const html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  ).catch(err => console.error("QR scanning error:", err));