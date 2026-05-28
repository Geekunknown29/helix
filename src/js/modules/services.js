import { doctors, vendors } from "../core/data.js";

const doctorList = document.getElementById("doctor-list");
const vendorList = document.getElementById("vendor-list");
const localityInput = document.getElementById("locality-filter");

function render() {
  const q = (localityInput?.value || "").toLowerCase();
  const doctorItems = doctors.filter((d) => d.verified && (!q || d.locality.toLowerCase().includes(q)));
  const vendorItems = vendors.filter((v) => v.verified && (!q || v.locality.toLowerCase().includes(q)));

  if (doctorList) {
    doctorList.innerHTML = doctorItems
      .map(
        (d) => `<article class="list-item"><h3>${d.name}</h3><p>${d.specialization} - ${d.locality}</p><p>${d.phone}</p><span class="badge verified">Verified</span></article>`
      )
      .join("");
  }

  if (vendorList) {
    vendorList.innerHTML = vendorItems
      .map(
        (v) => `<article class="list-item"><h3>${v.business}</h3><p>${v.category} - ${v.locality}</p><p>${v.phone}</p><span class="badge verified">Verified</span></article>`
      )
      .join("");
  }
}

if (localityInput) localityInput.addEventListener("input", render);
render();
