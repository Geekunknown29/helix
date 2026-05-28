import { APP_CITY } from "./data.js";

const cityBadges = document.querySelectorAll("[data-city-badge]");
cityBadges.forEach((node) => {
  node.textContent = `Serving: ${APP_CITY}`;
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
