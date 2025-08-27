// Absolute minimal test - no imports
document.getElementById("root")!.innerHTML = `
  <div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #059669;
    color: white;
    font-family: Arial;
    font-size: 24px;
    text-align: center;
  ">
    <div>
      <h1>🎉 JAVASCRIPT IS WORKING!</h1>
      <p>Platform will be restored in 10 seconds...</p>
      <div id="countdown">10</div>
    </div>
  </div>
`;

let count = 10;
const countdown = setInterval(() => {
  count--;
  const element = document.getElementById("countdown");
  if (element) element.textContent = count.toString();
  if (count <= 0) {
    clearInterval(countdown);
    window.location.reload();
  }
}, 1000);
