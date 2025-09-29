const API_URL = "https://testapi-touo.onrender.com/api/auth/reset-password";
const resetBtn = document.getElementById("resetBtn");
const messageBox = document.getElementById("messageBox");
const spinner = document.getElementById("spinner");

resetBtn.addEventListener("click", function() {
  const email = document.getElementById("email").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  messageBox.style.display = "none";

  if (!email || !newPassword || !confirmPassword) {
    showMessage("Please fill in all fields.", "red");
    return;
  }

  if (newPassword.length < 6) {
    showMessage("Password should be at least 6 characters.", "red");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("Passwords do not match.", "red");
    return;
  }

  spinner.style.display = "block";
  resetBtn.disabled = true;

  // ✅ Correct POST request
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      showMessage("Password updated successfully! Redirecting to login...", "green");
      setTimeout(() => window.location.href = "/index.html", 1000);
    } else {
      showMessage(data.message || "User not found.", "red");
    }
  })
  .catch(err => {
    console.error(err);
    showMessage("Failed to update password.", "red");
  })
  .finally(() => {
    spinner.style.display = "none";
    resetBtn.disabled = false;
  });
});

function showMessage(msg, color) {
  messageBox.innerText = msg;
  messageBox.style.color = color;
  messageBox.style.display = "block";
}
