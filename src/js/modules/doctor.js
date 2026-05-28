const appointmentList = document.getElementById("appointment-list");

const appointments = [
  { patient: "Rahul", time: "10:30 AM", concern: "Fatigue" },
  { patient: "Sneha", time: "1:00 PM", concern: "Diet Planning" }
];

if (appointmentList) {
  appointmentList.innerHTML = appointments
    .map((item) => `<article class="list-item"><h3>${item.patient}</h3><p>${item.time}</p><p>${item.concern}</p></article>`)
    .join("");
}
