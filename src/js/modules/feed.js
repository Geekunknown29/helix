import { posts } from "../core/data.js";

const list = document.getElementById("feed-list");
const form = document.getElementById("new-post-form");
const activeRole = localStorage.getItem("prototypeRole") || "public";
const postState = new Map();

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

  render();
}

function render() {
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
        <p>${post.content}</p>
        <footer class="post-actions-ui">
          ${renderPostActions(post.id)}
        </footer>
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
render();
