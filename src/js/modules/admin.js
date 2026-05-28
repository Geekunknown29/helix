const doctorQueue = document.getElementById("doctor-verification-queue");
const vendorQueue = document.getElementById("vendor-verification-queue");

const pendingDoctors = [
  { name: "Dr. R. Shah", reg: "MH-12345" }
];

const pendingVendors = [
  { business: "Gym Gear Hub", doc: "GST + ID" }
];

function queueItem(labelA, valueA, labelB, valueB) {
  return `<article class="list-item"><p><strong>${labelA}:</strong> ${valueA}</p><p><strong>${labelB}:</strong> ${valueB}</p><div class="grid two"><button class="btn">Approve</button><button class="btn secondary">Reject</button></div></article>`;
}

if (doctorQueue) {
  doctorQueue.innerHTML = pendingDoctors.map((d) => queueItem("Doctor", d.name, "Reg No", d.reg)).join("");
}

if (vendorQueue) {
  vendorQueue.innerHTML = pendingVendors.map((v) => queueItem("Vendor", v.business, "Documents", v.doc)).join("");
}
