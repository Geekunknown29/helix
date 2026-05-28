const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const status = document.getElementById("auth-status");

const demoUsers = [
  { role: "public", email: "public@healthsocial.demo", password: "Public@123", redirect: "./public-interface.html" },
  { role: "doctor", email: "doctor@healthsocial.demo", password: "Doctor@123", redirect: "./doctor-interface.html" },
  { role: "vendor", email: "vendor@healthsocial.demo", password: "Vendor@123", redirect: "./vendor-interface.html" }
];

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const roleInput = loginForm.querySelector('select[name="role"]');
    const emailInput = loginForm.querySelector('input[name="email"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');
    if (!roleInput || !emailInput || !passwordInput) return;

    const role = roleInput.value;
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const match = demoUsers.find((user) => user.role === role && user.email === email && user.password === password);

    if (!match) {
      if (status) status.textContent = "Invalid credentials for selected role. Check dummy users file.";
      return;
    }

    localStorage.setItem("prototypeRole", role);
    localStorage.setItem("prototypeEmail", email);
    window.location.href = match.redirect;
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = signupForm.role.value;
    const verification = role === "public" ? "Not required" : "Pending verification";
    if (status) status.textContent = `Signup submitted for ${role}. Verification status: ${verification}.`;
    signupForm.reset();
  });
}
