import { doctors, vendors } from "../core/data.js";

const form = document.getElementById("chatbot-form");
const output = document.getElementById("chatbot-output");

function buildResponse(query) {
  const safeDoctors = doctors.filter((d) => d.verified).slice(0, 3);
  const safeVendors = vendors.filter((v) => v.verified).slice(0, 3);
  return {
    safety: "If you have severe chest pain, breathing difficulty, confusion, or fainting, seek urgent care immediately.",
    concerns: `Your concern "${query}" may be related to hydration, rest, or mild digestive/stress factors.`,
    actions: "Drink water, rest in a comfortable position, avoid intense exercise for now, and monitor symptoms.",
    diet: "Try light foods and seasonal fruits. Avoid oily and very sugary foods today.",
    exercise: "If you feel stable, do only gentle stretching or short breathing exercises.",
    doctors: safeDoctors,
    vendors: safeVendors
  };
}

if (form && output) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = form.query.value.trim();
    if (!query) return;
    const response = buildResponse(query);
    output.innerHTML = `
      <div class="card chatbot-output">
        <h3>Safety First</h3><p>${response.safety}</p>
        <h3>Possible Concern Category</h3><p>${response.concerns}</p>
        <h3>Immediate Safe Steps</h3><p>${response.actions}</p>
        <h3>Diet Suggestions</h3><p>${response.diet}</p>
        <h3>Light Activity</h3><p>${response.exercise}</p>
        <h3>Verified Doctors</h3>
        <ul>${response.doctors.map((d) => `<li>${d.name} (${d.specialization}, ${d.locality}) - ${d.phone}</li>`).join("")}</ul>
        <h3>Verified Vendors</h3>
        <ul>${response.vendors.map((v) => `<li>${v.business} (${v.category}, ${v.locality}) - ${v.phone}</li>`).join("")}</ul>
        <p class="muted">This is informational guidance, not a medical diagnosis.</p>
      </div>
    `;
    form.reset();
  });
}
