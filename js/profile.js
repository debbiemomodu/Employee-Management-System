const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const token = localStorage.getItem("token");
const userId = currentUser?._id || currentUser?.id;
const loader = document.getElementById("loader");
const profileContent = document.getElementById("profileContent");
const avatarEl = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const roleEl = document.getElementById("role");
const departmentEl = document.getElementById("department");
const emailEl = document.getElementById("email");
const employeeIdEl = document.getElementById("employeeId");
const errorMessage = document.getElementById("errorMessage");
const logoutBtnCard = document.getElementById("logoutBtnCard");

const API_URL = "https://testapi-touo.onrender.com/api/users";


  fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      loader.style.display = "none";
      errorMessage.textContent = data.error;
      errorMessage.style.display = "block";
      return;
    }

    const usersArray = data.user || [];
    const user = usersArray.find(u => String(u._id) === String(userId));

    if (user) {
      
      avatarEl.src =  "/asset/image/default-avatar.png";
      nameEl.textContent = user.name || "No Name";
      roleEl.textContent = user.role || "No Role";
      emailEl.textContent = user.email || "No Email";
      departmentEl.textContent = user.department || "No Department";
      employeeIdEl.textContent = user._id ? user._id.substring(0,7).toUpperCase() : "N/A";
     

      loader.style.display = "none";
      profileContent.style.display = "block";
    } else {
      loader.style.display = "none";
      errorMessage.textContent = data.message || "Failed to load profile";
      errorMessage.style.display = "block";
    }
  })
  .catch(err => {
    console.error("Error fetching profile:", err);
    loader.style.display = "none";
    errorMessage.textContent = "Failed to load profile. Please try again.";
    errorMessage.style.display = "block";
  });



logoutBtnCard.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
});

