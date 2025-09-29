
const API_URL = "https://testapi-touo.onrender.com/api/users";
let users = [];
let editIndex = null;
let totalAddedCount = parseInt(localStorage.getItem('totalAddedCount')) || 0;
let totalDeletedCount = parseInt(localStorage.getItem('totalDeletedCount')) || 0;

const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('.section');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const collapseBtn = document.getElementById('collapseBtn');
const mobileToggle = document.getElementById('mobileToggle');
const overlay = document.getElementById('overlay');
const linkTextEls = document.querySelectorAll('.link-text');

let isCollapsed = false;      
let isMobile = window.innerWidth < 768;


function applyCollapsed(collapsed) {
  if (collapsed) {
    sidebar.style.width = '64px';
    mainContent.style.marginLeft = '64px';
    linkTextEls.forEach(t => t.style.display = 'none');
    document.querySelectorAll('.sidebar-link').forEach(a => a.style.justifyContent = 'center');
    collapseBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
  } else {
    sidebar.style.width = '220px';
    mainContent.style.marginLeft = '220px';
    linkTextEls.forEach(t => t.style.display = 'inline');
    document.querySelectorAll('.sidebar-link').forEach(a => a.style.justifyContent = 'flex-start');
    collapseBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
  }
}


function openMobileSidebar() {
  sidebar.style.transform = 'translateX(0)';
  sidebar.style.width = '220px';
  overlay.style.display = 'block';
  overlay.style.opacity = '1';
}
function closeMobileSidebar() {
  sidebar.style.transform = 'translateX(-100%)';
  overlay.style.display = 'none';
}


function handleResize() {
  isMobile = window.innerWidth < 768;
  if (isMobile) {
   
    sidebar.style.transform = 'translateX(-100%)'
    mainContent.style.marginLeft = '0';
    mobileToggle.style.display = 'inline-block';
    collapseBtn.style.display = 'none';
  } else {
    
    overlay.style.display = 'none';
    sidebar.style.transform = 'translateX(0)';
    mobileToggle.style.display = 'none';
    collapseBtn.style.display = 'inline-block';

    applyCollapsed(isCollapsed);
  }
}


handleResize();
window.addEventListener('resize', handleResize);


collapseBtn.addEventListener('click', () => {
  
  if (window.innerWidth >= 768) {
    isCollapsed = !isCollapsed;
    applyCollapsed(isCollapsed);
  }
});


mobileToggle.addEventListener('click', () => {
  openMobileSidebar();
});


overlay.addEventListener('click', closeMobileSidebar);


sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
  
    if (window.innerWidth < 768) {
      closeMobileSidebar();
    }
   
  });

  link.addEventListener('mouseenter', () => link.style.backgroundColor = '#162447');
  link.addEventListener('mouseleave', () => { if (!link.classList.contains('active')) link.style.backgroundColor = 'transparent'; });
});


const userTable = document.getElementById("userTable");
const totalUsers = document.getElementById("totalUsers");
const totalAdded = document.getElementById("totalAdded");
const totalDeleted = document.getElementById("totalDeleted");
const searchInput = document.getElementById("searchInput");
const globalMessage = document.getElementById("globalMessage");

function updateCounts(){
  totalUsers.innerText = users.length;
  totalAdded.innerText = totalAddedCount;
  totalDeleted.innerText = totalDeletedCount;
}


function showGlobalMessage(msg, color="red"){
  globalMessage.innerText = msg;
  globalMessage.style.color = color;
  globalMessage.style.display="block";
  setTimeout(()=>{globalMessage.style.display="none";},5000);
}


function loadUsers(){
  document.getElementById("loadingSpinner").style.display="block";
  fetch(API_URL).then(res=>res.json())
  .then(data=>{
    users = data.user || [];
    users.forEach(u=>{u.employeeId = u._id ? u._id.substring(0,7).toUpperCase() : "N/A";});
    renderTable();
    document.getElementById("tableContainer").style.display="block";
    document.getElementById("loadingSpinner").style.display="none";
    updateCounts();
  }).catch(err=>{
    console.error(err);
    showGlobalMessage("Failed to load users");
    document.getElementById("loadingSpinner").style.display="none";
  });
}


function renderTable(filter=""){
  const search = filter.toLowerCase();
  let html="";
  users.forEach((u,index)=>{
    const name = u.name||"";
    const email = u.email||"";
    const role = u.role||"-";
    const dept = u.department||"-";
    const empId = u.employeeId||"N/A";
    if(name.toLowerCase().includes(search) || email.toLowerCase().includes(search)){
      html+=`<tr>
        <td>${name}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${dept}</td>
        <td>${empId}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-sm edit-btn" data-index="${index}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm delete-btn" data-id="${u._id}" data-index="${index}"><i class="bi bi-trash3"></i></button>
        </td>
      </tr>`;
    }
  });
  userTable.innerHTML = html;
  updateCounts();
  document.querySelectorAll(".edit-btn").forEach(btn=>btn.addEventListener("click",()=>openEditModal(btn.dataset.index)));
  document.querySelectorAll(".delete-btn").forEach(btn=>btn.addEventListener("click",()=>deleteUser(btn.dataset.id,btn.dataset.index)));
}


if (searchInput) {
  searchInput.addEventListener("input",()=>renderTable(searchInput.value.trim().toLowerCase()));
}


document.getElementById("addUserBtn").addEventListener("click", ()=>{ 
    const name = document.getElementById("addName").value.trim();
    const email = document.getElementById("addEmail").value.trim();
    const password = document.getElementById("addPassword").value.trim();
    const role = document.getElementById("addRole").value.trim();
    const department = document.getElementById("addDepartment").value.trim();
    if(!name || !email || !password || !role){
        const err = document.getElementById("addModalError");
        err.innerText = "All fields except department are required";
        err.style.display = "block";
        return;
    }

    document.getElementById("addSpinner").style.display = "block";

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, department })
    })
    .then(res => res.json())
    .then(data => {
        const newUser = data.user || data;
        newUser.employeeId = newUser._id ? newUser._id.substring(0,7).toUpperCase() : "N/A";
        users.push(newUser);
        totalAddedCount++;
        localStorage.setItem('totalAddedCount', totalAddedCount);

        setTimeout(() => renderTable(), 50); 
        document.getElementById("addSpinner").style.display = "none";
        showGlobalMessage("User added successfully", "green");

        const addUserModalEl = document.getElementById("addUserModal");
        const addUserModal = bootstrap.Modal.getOrCreateInstance(addUserModalEl);
        addUserModal.hide();

        
        addUserModalEl.addEventListener('hidden.bs.modal', () => {
            document.getElementById("addName").value = "";
            document.getElementById("addEmail").value = "";
            document.getElementById("addPassword").value = "";
            document.getElementById("addRole").value = "";
            document.getElementById("addDepartment").value = "";
            document.getElementById("addModalError").style.display = "none";
        },
          { once: true });
    })
    .catch(err => {
        console.error(err);
        document.getElementById("addSpinner").style.display = "none";
        showGlobalMessage("Failed to add user");
    });
});


function openEditModal(index){
  editIndex=index;
  const u=users[index];
  document.getElementById("editName").value=u.name||"";
  document.getElementById("editEmail").value=u.email||"";
  document.getElementById("editRole").value=u.role||"";
  document.getElementById("editDepartment").value=u.department||"";
  new bootstrap.Modal(document.getElementById("editUserModal")).show();
}

document.getElementById("editUserBtn").addEventListener("click", () => {
  if (editIndex === null) return;

  const user = users[editIndex];
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const role = document.getElementById("editRole").value.trim();
  const department = document.getElementById("editDepartment").value.trim();

  if (!name || !email || !role) { 
    showGlobalMessage("Name, Email and Role are required"); 
    return; 
  }

  document.getElementById("editSpinner").style.display = "block";

  const body = { name, email, role, department };

  fetch(`${API_URL}/${user._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(data => {
    
    users[editIndex] = {
      ...user,
      name,
      email,
      role,
      department,
      employeeId: user.employeeId 
    };

    renderTable();
    document.getElementById("editSpinner").style.display = "none";

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editUserModal"));
    modal.hide();
    showGlobalMessage("User updated successfully", "green");
  })
  .catch(err => {
    console.error(err);
    document.getElementById("editSpinner").style.display = "none";
    showGlobalMessage("Failed to update user");
  });
});


function deleteUser(id,index){
  if(!confirm("Are you sure you want to delete this user?")) return;
  fetch(`${API_URL}/${id}`,{method:"DELETE"})
  .then(res=>res.json())
  .then(()=>{
    users.splice(index,1);
    totalDeletedCount++;
    localStorage.setItem('totalDeletedCount', totalDeletedCount);
    renderTable();
    alert ("User deleted successfully","green");
  }).catch(err=>{console.error(err); showGlobalMessage("Failed to delete user"); });
}



function showSection(sectionId){

  sections.forEach(sec=>sec.style.display='none');
  document.getElementById(sectionId).style.display='block';

  sidebarLinks.forEach(link=>{ link.classList.remove('active'); link.style.backgroundColor='transparent'; });
  const linkEl = document.getElementById(sectionId+'Link');
  if (linkEl) {
    linkEl.classList.add('active');
    linkEl.style.backgroundColor='#0f3460';
  }

  
  if (window.innerWidth < 768) {
    closeMobileSidebar();
  }
}
showSection('dashboard');


document.getElementById("submitReportBtn").addEventListener("click",()=>{
  const reportInput=document.getElementById("reportInput");
  const reportMessage=document.getElementById("reportMessage");
  if(reportInput.value.trim()===""){
    reportMessage.innerText="Please type something before submitting!";
    reportMessage.style.color="red";
    reportMessage.style.display="block";
    return;
  }
  reportMessage.innerText="Report submitted successfully!";
  reportMessage.style.color="green";
  reportMessage.style.display="block";
  reportInput.value="";
  setTimeout(()=>{ reportMessage.style.display="none"; },3000);
});


loadUsers();