let currentUser = null;

function register() {
  const user = {
    name: regName.value,
    email: regEmail.value,
    password: regPassword.value,
    role: regRole.value,
    verified: false
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered! Now verify email.");
  showPage("verify");
}

function verifyEmail() {
  let users = JSON.parse(localStorage.getItem("users"));
  users[users.length - 1].verified = true;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Email Verified!");
  showPage("login");
}

function login() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === loginEmail.value && u.password === loginPassword.value);

  if (!user) return alert("Invalid credentials");
  if (!user.verified) return alert("Email not verified");

  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));

  document.body.classList.remove("not-authenticated");
  document.body.classList.add("authenticated");
  if (user.role === "admin") document.body.classList.add("is-admin");

  usernameDisplay.innerText = user.name;

  loadProfile();
  loadEmployees();
  loadDepartments();
  loadAccounts();
  loadRequests();

  showPage("profile");
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("currentUser"));
  if (saved) {
    currentUser = saved;
    document.body.classList.remove("not-authenticated");
    document.body.classList.add("authenticated");
    if (saved.role === "admin") document.body.classList.add("is-admin");
    usernameDisplay.innerText = saved.name;
    updateCardCounts();
  }
};

function loadProfile() {
  profileName.innerText = currentUser.name;
  profileEmail.innerText = currentUser.email;
  profileRole.innerText = currentUser.role;
  profileVerified.innerText = currentUser.verified ? "Yes" : "No";
}
function addEmployee() {
  let list = JSON.parse(localStorage.getItem("employees")) || [];
  list.push(empName.value);
  localStorage.setItem("employees", JSON.stringify(list));
  loadEmployees();
}
function loadEmployees() {
  employeeList.innerHTML = "";
  let list = JSON.parse(localStorage.getItem("employees")) || [];
  list.forEach((e,i)=>{
    employeeList.innerHTML += `<li class="list-group-item d-flex justify-content-between">${e}
      <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${i})">Delete</button></li>`;
  });
}
function deleteEmployee(i){
  let list = JSON.parse(localStorage.getItem("employees"));
  list.splice(i,1);
  localStorage.setItem("employees", JSON.stringify(list));
  loadEmployees();
}

function addDepartment(){
  let list = JSON.parse(localStorage.getItem("departments")) || [];
  list.push(deptName.value);
  localStorage.setItem("departments", JSON.stringify(list));
  loadDepartments();
}
function loadDepartments(){
  departmentList.innerHTML="";
  let list = JSON.parse(localStorage.getItem("departments")) || [];
  list.forEach((d,i)=>{
    departmentList.innerHTML += `<li class="list-group-item d-flex justify-content-between">${d}
      <button class="btn btn-sm btn-danger" onclick="deleteDepartment(${i})">Delete</button></li>`;
  });
}
function deleteDepartment(i){
  let list = JSON.parse(localStorage.getItem("departments"));
  list.splice(i,1);
  localStorage.setItem("departments", JSON.stringify(list));
  loadDepartments();
}

function loadAccounts(){
  accountList.innerHTML="";
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach(u=>{
    accountList.innerHTML += `<li class="list-group-item">
      ${u.name} (${u.role}) - Verified: ${u.verified}
    </li>`;
  });
  updateCardCounts();
}

function submitRequest(){
  let list = JSON.parse(localStorage.getItem("requests")) || [];
  list.push({user: currentUser.email, text: requestText.value});
  localStorage.setItem("requests", JSON.stringify(list));
  loadRequests();
}
function loadRequests(){
  requestList.innerHTML="";
  let list = JSON.parse(localStorage.getItem("requests")) || [];
  list.filter(r=>r.user===currentUser.email)
      .forEach(r=>{
        requestList.innerHTML += `<li class="list-group-item">${r.text}</li>`;
      });
  updateCardCounts();
}

function updateCardCounts() {
  // Update employee count
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  if (document.getElementById('empCount')) {
    document.getElementById('empCount').textContent = employees.length;
  }
  
  // Update department count
  const departments = JSON.parse(localStorage.getItem("departments")) || [];
  if (document.getElementById('deptCount')) {
    document.getElementById('deptCount').textContent = departments.length;
  }
  
  // Update account count
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (document.getElementById('accCount')) {
    document.getElementById('accCount').textContent = users.length;
  }
  
  // Update request count
  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  const userRequests = currentUser ? requests.filter(r => r.user === currentUser.email) : [];
  if (document.getElementById('reqCount')) {
    document.getElementById('reqCount').textContent = userRequests.length;
  }
}
function navigateTo(hash) {
  window.location.hash = hash;
}

function navigateTo(hash) {
    window.location.hash = hash;
}

function handleRouting() {
    let hash = window.location.hash || "#/";
    let route = hash.replace("#/", "");

    if (route === "") route = "home";

    const protectedRoutes = ["profile", "requests", "employees", "departments", "accounts"];
    const adminRoutes = ["employees", "departments", "accounts"];

    // Not logged in → block protected pages
    if (protectedRoutes.includes(route) && !currentUser) {
        window.location.hash = "#/login";
        return;
    }

    // Not admin → block admin pages
    if (adminRoutes.includes(route) && currentUser?.role !== "admin") {
        window.location.hash = "#/profile";
        return;
    }

    // Hide all pages
    document.querySelectorAll(".page").forEach(p =>
        p.classList.remove("active")
    );

    // Show correct page
    const page = document.getElementById(route);
    if (page) {
        page.classList.add("active");
        if (route === "home") {
            updateCardCounts();
        }
    }
}

window.addEventListener("hashchange", handleRouting);

window.onload = function () {
    if (!window.location.hash) {
        window.location.hash = "#/";
    }
    handleRouting();
};

function handleRouting() {
    let hash = window.location.hash;

    if (!hash) {
        window.location.hash = "#/login";
        return;
    }

    let route = hash.replace("#/", "");

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    let page = document.getElementById(route);

    if (page) {
        page.classList.add("active");
    }
}

window.addEventListener("hashchange", handleRouting);

window.onload = handleRouting;
