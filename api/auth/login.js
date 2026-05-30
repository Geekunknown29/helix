const users = [
  { role: "public", email: "public@healthsocial.demo", password: "Public@123", name: "Public User" },
  { role: "doctor", email: "doctor@healthsocial.demo", password: "Doctor@123", name: "Doctor" },
  { role: "vendor", email: "vendor@healthsocial.demo", password: "Vendor@123", name: "Vendor" }
];

function redirectForRole(role) {
  return `/src/html/pages/${role}-interface.html`;
}

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { role, email, password } = req.body || {};
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanRole = String(role || "").trim().toLowerCase();
  const match = users.find((user) => user.role === cleanRole && user.email === cleanEmail && user.password === password);

  if (!match) return res.status(401).json({ error: "Invalid credentials for selected role." });

  return res.status(200).json({
    role: match.role,
    email: match.email,
    name: match.name,
    redirect: redirectForRole(match.role)
  });
};
