// Clear browser storage script - fixes routing issues
console.log("🧹 Clearing browser storage to fix routing...");

// Clear localStorage
localStorage.clear();

// Clear sessionStorage  
sessionStorage.clear();

// Clear specific monitoring tokens that cause redirects
localStorage.removeItem("authToken");
localStorage.removeItem("userType");
localStorage.removeItem("userRole");
localStorage.removeItem("userId");
localStorage.removeItem("username");

console.log("✅ Browser storage cleared successfully");
console.log("🔄 Redirecting to Polipus front page...");

// Force redirect to the correct front page
window.location.href = "/front-page";