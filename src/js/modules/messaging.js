const thread = document.getElementById("message-thread");
const form = document.getElementById("message-form");

const messages = [
  { from: "You", body: "Hello doctor, can I book an appointment?" },
  { from: "Dr. A. Kulkarni", body: "Yes, please share your preferred time." }
];

function render() {
  if (!thread) return;
  thread.innerHTML = messages
    .map((msg) => {
      const isSelf = msg.from === "You";
      const initials = isSelf ? "U" : "Dr";
      return `
        <div class="bubble-row ${isSelf ? "self" : ""}">
          ${isSelf ? "" : `<span class="avatar">${initials}</span>`}
          <div class="chat-bubble">
            <strong>${msg.from}</strong>
            <span>${msg.body}</span>
          </div>
          ${isSelf ? `<span class="avatar">${initials}</span>` : ""}
        </div>`;
    })
    .join("");
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = form.body.value.trim();
    if (!body) return;
    messages.push({ from: "You", body });
    form.reset();
    render();
  });
}

render();
