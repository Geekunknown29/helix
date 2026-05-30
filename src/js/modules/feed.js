import { posts } from "../core/data.js";

const list = document.getElementById("feed-list");
const form = document.getElementById("new-post-form");
const activeRole = localStorage.getItem("prototypeRole") || "public";
const currentUserId = localStorage.getItem("prototypeEmail") || `${activeRole}:guest`;
const FEED_STATS_STORAGE_KEY = "healixFeedStats";
const shareFriends = ["HARI", "Animesh", "Hitesh", "Riya", "Kunal", "Neha"];
let feedStats = loadFeedStats();

function loadFeedStats() {
  try {
    return JSON.parse(localStorage.getItem(FEED_STATS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveFeedStats() {
  localStorage.setItem(FEED_STATS_STORAGE_KEY, JSON.stringify(feedStats));
}

function ensurePostStats(postId) {
  const key = String(postId);
  if (!feedStats[key]) {
    feedStats[key] = { likedBy: [], dislikedBy: [], savedBy: [], greenFlaggedBy: [], shares: [] };
  }
  return feedStats[key];
}

function hasValue(listValue, value) {
  return Array.isArray(listValue) && listValue.includes(value);
}

function toggleValue(listValue, value) {
  if (hasValue(listValue, value)) return listValue.filter((item) => item !== value);
  return [...listValue, value];
}

function getPostState(postId) {
  const stats = ensurePostStats(postId);
  return {
    likes: stats.likedBy.length,
    dislikes: stats.dislikedBy.length,
    shares: stats.shares.length,
    flagged: stats.greenFlaggedBy.length > 0,
    liked: hasValue(stats.likedBy, currentUserId),
    disliked: hasValue(stats.dislikedBy, currentUserId),
    saved: hasValue(stats.savedBy, currentUserId)
  };
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

function renderShareMenu(post) {
  return `
    <div class="share-menu" data-share-menu="${post.id}">
      <p>Share this post</p>
      <button type="button" data-share-target="whatsapp" data-post-id="${post.id}">WhatsApp</button>
      <button type="button" data-share-target="facebook" data-post-id="${post.id}">Facebook</button>
      <label>
        Message friend
        <select data-share-friend="${post.id}">
          ${shareFriends.map((name) => `<option value="${name}">${name}</option>`).join("")}
        </select>
      </label>
      <button type="button" data-share-target="friend" data-post-id="${post.id}">Send</button>
    </div>`;
}

function getPostById(postId) {
  return posts.find((post) => post.id === postId);
}

function postShareText(post) {
  return `${post.author}: ${post.content}`;
}

function recordShare(postId, channel, target = "") {
  const stats = ensurePostStats(postId);
  const shareKey = `${currentUserId}:${channel}:${target}`;
  if (!stats.shares.includes(shareKey)) {
    stats.shares.push(shareKey);
    saveFeedStats();
  }
  render();
}

function openExternalShare(post, channel) {
  const text = encodeURIComponent(postShareText(post));
  const url = encodeURIComponent(window.location.href);
  const shareUrl = channel === "whatsapp" ? `https://wa.me/?text=${text}` : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
  window.open(shareUrl, "_blank", "noopener,noreferrer");
  recordShare(post.id, channel);
}

function shareToFriend(post, friendName) {
  const key = "healixSharedMessages";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({ to: friendName, from: currentUserId, postId: post.id, body: postShareText(post) });
  localStorage.setItem(key, JSON.stringify(existing));
  recordShare(post.id, "friend", friendName);
}

function handlePostAction(event) {
  const button = event.target.closest("[data-action][data-post-id]");
  if (!button) return;

  const postId = Number(button.dataset.postId);
  const action = button.dataset.action;
  const stats = ensurePostStats(postId);

  if (action === "like") {
    stats.likedBy = toggleValue(stats.likedBy, currentUserId);
    if (hasValue(stats.likedBy, currentUserId)) stats.dislikedBy = stats.dislikedBy.filter((userId) => userId !== currentUserId);
  }
  if (action === "dislike") {
    stats.dislikedBy = toggleValue(stats.dislikedBy, currentUserId);
    if (hasValue(stats.dislikedBy, currentUserId)) stats.likedBy = stats.likedBy.filter((userId) => userId !== currentUserId);
  }
  if (action === "share") {
    render(postId);
    return;
  }
  if (action === "save") stats.savedBy = toggleValue(stats.savedBy, currentUserId);
  if (action === "flag" && activeRole === "doctor") stats.greenFlaggedBy = toggleValue(stats.greenFlaggedBy, currentUserId);

  saveFeedStats();
  render();
}

function handleShareChoice(event) {
  const button = event.target.closest("[data-share-target][data-post-id]");
  if (!button) return;

  const postId = Number(button.dataset.postId);
  const post = getPostById(postId);
  if (!post) return;

  const target = button.dataset.shareTarget;
  if (target === "whatsapp" || target === "facebook") openExternalShare(post, target);
  if (target === "friend") {
    const friendSelect = document.querySelector(`[data-share-friend="${postId}"]`);
    shareToFriend(post, friendSelect?.value || shareFriends[0]);
  }
}

function render(openSharePostId = null) {
  if (!list) return;
  list.innerHTML = posts
    .map(
      (post) => `
      <article class="post-card-ui">
        <header class="post-head-ui">
          <span class="avatar">U</span>
          <div>
            <h3>${post.author}</h3>
            <p class="muted">${post.category}</p>
          </div>
        </header>
        <div class="post-media-small"></div>
        <p>${escapeHtml(post.content)}</p>
        <footer class="post-actions-ui">
          ${renderPostActions(post.id)}
        </footer>
        ${openSharePostId === post.id ? renderShareMenu(post) : ""}
      </article>`
    )
    .join("");
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const author = form.author.value.trim() || "Public User";
    const category = form.category.value;
    const content = form.content.value.trim();
    if (!content) return;
    posts.unshift({ id: Date.now(), author, category, content });
    form.reset();
    render();
  });
}

list?.addEventListener("click", handlePostAction);
list?.addEventListener("click", handleShareChoice);
render();
