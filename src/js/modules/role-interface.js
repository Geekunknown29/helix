const APP_CITY = "Delhi";

const doctors = [
  { id: 1, name: "Dr. A. Mehra", specialization: "General Physician", locality: "Dwarka", phone: "9876543210", verified: true },
  { id: 2, name: "Dr. N. Bhatia", specialization: "Nutrition", locality: "Rohini", phone: "9988776655", verified: true },
  { id: 3, name: "Dr. S. Gupta", specialization: "Child Specialist", locality: "Saket", phone: "9911002200", verified: true }
];

const vendors = [
  { id: 1, business: "Fresh Basket", category: "Fruits & Vegetables", locality: "Janakpuri", phone: "9001002003", verified: true },
  { id: 2, business: "Fit Fuel Store", category: "Supplements", locality: "Dwarka", phone: "9001002004", verified: true },
  { id: 3, business: "GreenMart Delhi", category: "Organic Foods", locality: "Rohini", phone: "9001002099", verified: true }
];

const root = document.getElementById("role-interface");
const activeRole = root?.dataset.role || "public";
const cityNode = document.getElementById("city-label");
const roleNode = document.getElementById("role-label");
const bottomButtons = document.querySelectorAll(".bottom-nav button");
const sections = document.querySelectorAll("[data-section]");

const dummyPosts = [
  {
    id: 1,
    author: "Doug Out",
    subtitle: "wonder-ful day!",
    body: "Sharing a light evening walk and hydration reminder for everyone.",
    media: "post-media-large"
  },
  {
    id: 2,
    author: "Dr. A. Mehra",
    subtitle: "Delhi Health Tip",
    body: "Mild headache? Rest, hydrate, and avoid screen strain for an hour.",
    media: "post-media-small"
  },
  {
    id: 3,
    author: "Fresh Basket",
    subtitle: "Vendor Update",
    body: "Fresh apples, mangoes, and spinach stocked today in Janakpuri.",
    media: "post-media-small"
  }
];

const conversations = ["HARI", "Animesh", "Hitesh", "Riya", "Kunal", "Neha", "Aarav", "Meera", "Kabir", "Tanya", "Ishaan", "Priya"];
const messagesByConversation = {
  HARI: [
    { from: "HARI", body: "hey whats up" },
    { from: "You", body: "good, what about you?" },
    { from: "HARI", body: "I am having high headache since morning. what should I do?" }
  ],
  Animesh: [
    { from: "Animesh", body: "Can you share the doctor list near Dwarka?" },
    { from: "You", body: "Sure, I found a few verified options." }
  ],
  Hitesh: [
    { from: "Hitesh", body: "Is the evening walk plan still on?" },
    { from: "You", body: "Yes, 6 PM works for me." }
  ],
  Riya: [
    { from: "Riya", body: "Do you know a good nutrition vendor nearby?" }
  ],
  Kunal: [
    { from: "Kunal", body: "I saved the hydration post. It was useful." }
  ],
  Neha: [
    { from: "Neha", body: "Please remind me about the appointment booking." }
  ],
  Aarav: [
    { from: "Aarav", body: "Can you check if the service section has vendors?" }
  ],
  Meera: [
    { from: "Meera", body: "The chatbot gave me a simple diet table." }
  ],
  Kabir: [
    { from: "Kabir", body: "I need a general physician recommendation." }
  ],
  Tanya: [
    { from: "Tanya", body: "Does green flag mean doctor approved?" }
  ],
  Ishaan: [
    { from: "Ishaan", body: "Can I message a vendor from here?" }
  ],
  Priya: [
    { from: "Priya", body: "Adding more fruits helped my routine." }
  ]
};
const postState = new Map();
let activeConversation = conversations[0];
const chatbotMessages = [
  {
    from: "You",
    body: "good, what about you? im having a very high headache since morning, what should i do ?"
  },
  {
    from: "Bot",
    body:
      "this is normal, just follow the given table:<br />" +
      "fruits and vegetables: apple, mango, potato<br />" +
      "exercise: pranayam<br />" +
      "doctors: dr abc contact, dr dse contact<br />" +
      "vendors: zxc contact, bbd contact<br /><br />" +
      "immediate: lay down and drink some water with lemon essence"
  }
];

if (cityNode) cityNode.textContent = `Serving: ${APP_CITY}`;
if (roleNode) roleNode.textContent = activeRole.charAt(0).toUpperCase() + activeRole.slice(1);

function setSection(tab) {
  sections.forEach((section) => {
    section.hidden = section.dataset.section !== tab;
  });
  bottomButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
}

function getPostState(postId) {
  if (!postState.has(postId)) {
    postState.set(postId, {
      likes: 0,
      dislikes: 0,
      shares: 0,
      flagged: false,
      liked: false,
      disliked: false,
      saved: false
    });
  }
  return postState.get(postId);
}

function actionLabel(action, state) {
  if (action === "like") return `Like${state.likes ? ` ${state.likes}` : ""}`;
  if (action === "dislike") return `Dislike${state.dislikes ? ` ${state.dislikes}` : ""}`;
  if (action === "share") return `Share${state.shares ? ` ${state.shares}` : ""}`;
  if (action === "save") return state.saved ? "Saved" : "Save";
  if (action === "flag") return state.flagged ? "Green Flagged" : "Green Flag";
  return action;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderPostActions(postId) {
  const state = getPostState(postId);
  const flagLocked = activeRole !== "doctor";
  return `
    <button class="post-action ${state.liked ? "active" : ""}" type="button" data-post-id="${postId}" data-action="like">${actionLabel("like", state)}</button>
    <button class="post-action ${state.disliked ? "active" : ""}" type="button" data-post-id="${postId}" data-action="dislike">${actionLabel("dislike", state)}</button>
    <button class="post-action green-flag ${state.flagged ? "active" : ""}" type="button" data-post-id="${postId}" data-action="flag" ${flagLocked ? "disabled title=\"Only doctor users can green flag posts\"" : ""}>${actionLabel("flag", state)}</button>
    <button class="post-action" type="button" data-post-id="${postId}" data-action="share">${actionLabel("share", state)}</button>
    <button class="post-action ${state.saved ? "active" : ""}" type="button" data-post-id="${postId}" data-action="save">${actionLabel("save", state)}</button>
  `;
}

function handlePostAction(event) {
  const button = event.target.closest("[data-action][data-post-id]");
  if (!button) return;

  const postId = Number(button.dataset.postId);
  const action = button.dataset.action;
  const state = getPostState(postId);

  if (action === "like") {
    state.liked = !state.liked;
    state.likes += state.liked ? 1 : -1;
    if (state.liked && state.disliked) {
      state.disliked = false;
      state.dislikes = Math.max(0, state.dislikes - 1);
    }
  }
  if (action === "dislike") {
    state.disliked = !state.disliked;
    state.dislikes += state.disliked ? 1 : -1;
    if (state.disliked && state.liked) {
      state.liked = false;
      state.likes = Math.max(0, state.likes - 1);
    }
  }
  if (action === "share") state.shares += 1;
  if (action === "save") state.saved = !state.saved;
  if (action === "flag") state.flagged = !state.flagged;

  renderFeed();
}

function renderFeed() {
  const list = document.getElementById("feed-posts");
  if (!list) return;

  list.innerHTML = dummyPosts
    .map(
      (post) => `
      <article class="post-card-ui">
        <header class="post-head-ui">
          <span class="avatar">U</span>
          <div>
            <strong>${post.author}</strong>
            <p class="muted">${post.subtitle}</p>
          </div>
        </header>
        <div class="${post.media}"></div>
        <p>${post.body}</p>
        <footer class="post-actions-ui">
          ${renderPostActions(post.id)}
        </footer>
      </article>`
    )
    .join("");
}

function renderMessages() {
  const list = document.getElementById("conversation-list");
  const thread = document.getElementById("message-thread");
  if (list) {
    list.innerHTML = conversations
      .map(
        (name) =>
          `<button class="conversation-item ${name === activeConversation ? "active" : ""}" type="button" data-conversation="${name}"><span class="avatar">${name.charAt(0)}</span>${name}</button>`
      )
      .join("");
  }
  if (thread) {
    const messages = messagesByConversation[activeConversation] || [];
    thread.innerHTML = messages
      .map((message) => {
        const isSelf = message.from === "You";
        return `
          <div class="bubble-row ${isSelf ? "self" : ""}">
            ${isSelf ? "" : `<span class="avatar">${activeConversation.charAt(0)}</span>`}
            <div class="chat-bubble">${message.body}</div>
            ${isSelf ? `<span class="avatar">U</span>` : ""}
          </div>`;
      })
      .join("");
    thread.scrollTop = thread.scrollHeight;
  }
}

function setActiveConversation(name) {
  if (!messagesByConversation[name]) messagesByConversation[name] = [];
  activeConversation = name;
  renderMessages();
}

function sendMessage(body) {
  const cleanBody = body.trim();
  if (!cleanBody) return;
  messagesByConversation[activeConversation].push({ from: "You", body: cleanBody });
  renderMessages();
}

function renderChatbot() {
  const out = document.getElementById("chatbot-output");
  if (!out) return;
  out.innerHTML = chatbotMessages
    .map((message) => {
      const isSelf = message.from === "You";
      return `
        <div class="bubble-row ${isSelf ? "self" : ""}">
          ${isSelf ? "" : `<span class="avatar">AI</span>`}
          <div class="chat-bubble ${isSelf ? "" : "bot"}">${message.body}</div>
          ${isSelf ? `<span class="avatar">U</span>` : ""}
        </div>`;
    })
    .join("");
  out.scrollTop = out.scrollHeight;
}

function sendChatbotMessage(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return;

  chatbotMessages.push({ from: "You", body: escapeHtml(cleanQuery) });
  chatbotMessages.push({
    from: "Bot",
    body:
      "I noted your message. For health concerns, hydrate, rest, and check the services tab for verified doctors if symptoms continue."
  });
  renderChatbot();
}

function renderServices() {
  const target = document.getElementById("services-cards");
  if (!target) return;
  const doctorCards = doctors
    .filter((d) => d.verified)
    .map(
      (doctor) => `
      <article class="service-card">
        <div class="service-identity">
          <span class="avatar big">Dr</span>
          <h4>${doctor.name}</h4>
          <p>${doctor.specialization}</p>
        </div>
        <div class="service-details">
          <p>location: ${doctor.locality}, ${APP_CITY}</p>
          <p>time: everyday 9 to 5</p>
          <div class="service-actions">
            <button>book appointment</button>
            <button>online consultation</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  const vendorCards = vendors
    .filter((v) => v.verified)
    .map(
      (vendor) => `
      <article class="service-card">
        <div class="service-identity">
          <span class="avatar big">V</span>
          <h4>${vendor.business}</h4>
          <p>${vendor.category}</p>
        </div>
        <div class="service-details">
          <p>location: ${vendor.locality}, ${APP_CITY}</p>
          <p>time: everyday 9 to 5</p>
          <div class="service-actions">
            <button>call vendor</button>
            <button>order now</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  target.innerHTML = doctorCards + vendorCards;
}

const chatForm = document.getElementById("chatbot-form");
if (chatForm) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChatbotMessage(chatForm.elements.query.value);
    chatForm.reset();
  });
}

bottomButtons.forEach((btn) => {
  btn.addEventListener("click", () => setSection(btn.dataset.tab));
});

document.getElementById("feed-posts")?.addEventListener("click", handlePostAction);
document.getElementById("conversation-list")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-conversation]");
  if (!button) return;
  setActiveConversation(button.dataset.conversation);
});

document.getElementById("message-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  sendMessage(form.elements.body.value);
  form.reset();
});

const logout = document.getElementById("logout-btn");
if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("prototypeRole");
    localStorage.removeItem("prototypeEmail");
    window.location.href = "./login.html";
  });
}

renderFeed();
renderMessages();
renderChatbot();
renderServices();
setSection("feed");
