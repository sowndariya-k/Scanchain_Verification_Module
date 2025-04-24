// Disable right-click
document.addEventListener('contextmenu', event => event.preventDefault());

// Block some keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
      (e.ctrlKey && e.key.toLowerCase() === "u") ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c")) {
    e.preventDefault();
  }
});

// Warn before leaving
window.onbeforeunload = function() {
  return "Are you sure you want to leave this page?";
};

// Request full screen on first click anywhere
function openFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function onFirstClick() {
  openFullscreen();
  // Remove listener after first click
  document.removeEventListener('click', onFirstClick);
}

document.addEventListener('click', onFirstClick);