const LOGIN_URL = "https://testapi-touo.onrender.com/api/auth/login";
const spinner = document.getElementById("spinner");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("errorBox"); // ✅ FIXED

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorBox.style.display = "none"; // Hide old errors

  if (!email || !password) {
    errorBox.innerText = data.message || "Please enter both email and password.";
    errorBox.style.display = "block";
    return;
  }

  // Show spinner, disable button
  spinner.style.display = "block";
  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    spinner.style.display = "none";
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";

    if (!data.token || !data.user) {
      errorBox.innerText = data.message || "Invalid email or password.";
      errorBox.style.display = "block";
      return;
    }

    // Save data to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    localStorage.setItem("userId", data.user._id);

    // Redirect user
    if (data.user.role === "admin") {
      window.location.href = "/pages/dashboard.html";
    } else if(data.user.role === "staff") {
      window.location.href = "/pages/profile.html";
    }
  })
  .catch(err => {
    spinner.style.display = "none";
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";

    console.error("Login error:", err);
    errorBox.innerText = data.message;
    errorBox.style.display = "block";
  });
});
