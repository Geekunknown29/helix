module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { role = "public", email, name, phone } = req.body || {};
  const cleanRole = String(role).trim().toLowerCase();
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !["public", "doctor", "vendor"].includes(cleanRole)) {
    return res.status(400).json({ error: "Valid email and role are required." });
  }

  return res.status(201).json({
    ok: true,
    role: cleanRole,
    email: cleanEmail,
    name: String(name || cleanEmail.split("@")[0] || cleanRole),
    phone: String(phone || "Not provided"),
    verification: cleanRole === "public" ? "Not required" : "Pending verification"
  });
};
