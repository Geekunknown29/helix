const form = document.getElementById("inventory-form");
const list = document.getElementById("inventory-list");

const inventory = [
  { name: "Banana", category: "Fruits", available: "Yes" },
  { name: "Whey Protein", category: "Supplements", available: "Yes" }
];

function render() {
  if (!list) return;
  list.innerHTML = inventory
    .map((item) => `<article class="list-item"><h3>${item.name}</h3><p>${item.category}</p><p>Available: ${item.available}</p></article>`)
    .join("");
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    inventory.push({
      name: form.name.value.trim(),
      category: form.category.value.trim(),
      available: form.available.value
    });
    form.reset();
    render();
  });
}

render();
