const messages = [
  "Are you sure?",
  "Really sure??",
  "Are you positive?",
  "Pookie please...",
  "Just think about it!",
  "If you say no, I will be really sad...",
  "I will be very sad...",
  "I will be very very very sad...",
  "Ok fine, I will stop asking...",
  "Just kidding, say yes please! ❤️",
];

let messageIndex = 0;

function handleNoClick() {
  const noButton = document.querySelector(".no-button");
  const yesButton = document.querySelector(".yes-button");
  if (!noButton || !yesButton) return;

  noButton.textContent = messages[messageIndex];
  messageIndex = (messageIndex + 1) % messages.length;

  const currentSize = parseFloat(getComputedStyle(yesButton).fontSize);
  yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function showPage(page) {
  const pageIndex = document.getElementById("page-index");
  const pageYes = document.getElementById("page-yes");
  if (!pageIndex || !pageYes) return;

  const isYes = page === "yes";
  pageIndex.style.display = isYes ? "none" : "block";
  pageYes.style.display = isYes ? "block" : "none";

  // change URL without reloading (so audio keeps playing)
  //history.pushState({ page }, "", isYes ? "yes_page.html" : "index.html");
}

function handleYesClick() {
  showPage("yes");
}

window.addEventListener("popstate", () => {
  const isYes = location.pathname.includes("yes_page.html");
  const pageIndex = document.getElementById("page-index");
  const pageYes = document.getElementById("page-yes");
  if (!pageIndex || !pageYes) return;

  pageIndex.style.display = isYes ? "none" : "block";
  pageYes.style.display = isYes ? "block" : "none";
});

// ===========================
// AUDIO CONTROLS (postMessage)
// ===========================
window.addEventListener("DOMContentLoaded", () => {
  // Set initial view if user loads yes_page.html directly
  const pageIndex = document.getElementById("page-index");
  const pageYes = document.getElementById("page-yes");
  if (pageIndex && pageYes) {
    const isYes = location.pathname.includes("yes_page.html");
    pageIndex.style.display = isYes ? "none" : "block";
    pageYes.style.display = isYes ? "block" : "none";
  }

  const btn = document.getElementById("audioControl");
  const frame = document.getElementById("audioFrame");
  if (!btn || !frame) return;

  const setIcon = (playing) => {
    btn.innerText = playing ? "❤️" : "🤍";
    btn.classList.toggle("paused", !playing);
  };


  window.addEventListener("message", (event) => {
    const msg = event.data;
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "AUDIO_STATE") setIcon(!!msg.playing);
  });

  const requestState = () => {
    frame.contentWindow?.postMessage({ type: "GET_AUDIO_STATE" }, "*");
  };

  btn.addEventListener("click", () => {
    frame.contentWindow?.postMessage({ type: "TOGGLE_AUDIO" }, "*");
  });

  requestState();
  frame.addEventListener("load", requestState);

  // small fallback poll (covers slow iframe init)
  const start = Date.now();
  const t = setInterval(() => {
    requestState();
    if (Date.now() - start > 3000) clearInterval(t);
  }, 200);
});
