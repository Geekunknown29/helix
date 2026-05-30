const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const status = document.getElementById("auth-status");

const demoUsers = [
  { role: "public", email: "public@healthsocial.demo", password: "Public@123", redirect: "./public-interface.html" },
  { role: "doctor", email: "doctor@healthsocial.demo", password: "Doctor@123", redirect: "./doctor-interface.html" },
  { role: "vendor", email: "vendor@healthsocial.demo", password: "Vendor@123", redirect: "./vendor-interface.html" }
];

function backendEnabled() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

function enterApp(role, email, redirect) {
  localStorage.setItem("prototypeRole", role);
  localStorage.setItem("prototypeEmail", email);
  window.location.href = redirect;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const roleInput = loginForm.querySelector('select[name="role"]');
    const emailInput = loginForm.querySelector('input[name="email"]');
    const passwordInput = loginForm.querySelector('input[name="password"]');
    if (!roleInput || !emailInput || !passwordInput) return;

    const role = roleInput.value;
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (backendEnabled()) {
      try {
        const result = await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ role, email, password })
        });
        enterApp(result.role, result.email, result.redirect.replace("/src/html/pages/", "./"));
        return;
      } catch (error) {
        if (status) status.textContent = error.message;
        return;
      }
    }

    const match = demoUsers.find((user) => user.role === role && user.email === email && user.password === password);
    if (!match) {
      if (status) status.textContent = "Invalid credentials for selected role. Check dummy users file.";
      return;
    }
    enterApp(role, email, match.redirect);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const role = signupForm.role.value;

    if (backendEnabled()) {
      try {
        const result = await apiRequest("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            name: signupForm.name?.value,
            email: signupForm.email?.value,
            phone: signupForm.phone?.value,
            role
          })
        });
        if (status) status.textContent = `Signup submitted for ${result.role}. Verification status: ${result.verification}. Prototype password: Healix@123.`;
        signupForm.reset();
        return;
      } catch (error) {
        if (status) status.textContent = error.message;
        return;
      }
    }

    const verification = role === "public" ? "Not required" : "Pending verification";
    if (status) status.textContent = `Signup submitted for ${role}. Verification status: ${verification}.`;
    signupForm.reset();
  });
}
