const API_KEY = "d618406857c34320bf55b6e945393eba";
const recipeListEl = document.getElementById("recipe-list");

function displayRecipes(recipes) {
  recipeListEl.innerHTML = "";
  recipes.forEach((recipe, index) => {
    const recipeItemEl = document.createElement("li");
    recipeItemEl.classList.add("card");

    // Add onclick attribute to each card
    recipeItemEl.setAttribute("onclick", `displayRecipeDetails('${recipe.id}')`);

    const featuredImageEl = document.createElement("a");
    featuredImageEl.href = "#";
    featuredImageEl.classList.add("featured-image");
    featuredImageEl.style.backgroundImage = `url('${recipe.image}')`;

    const cardBodyEl = document.createElement("article");
    cardBodyEl.classList.add("card-body");

    const headerEl = document.createElement("header");

    const titleEl = document.createElement("div");
    titleEl.classList.add("title");
    titleEl.innerHTML = `<h3>${recipe.title}</h3>`;

    headerEl.appendChild(titleEl);

    cardBodyEl.appendChild(headerEl);
    recipeItemEl.appendChild(featuredImageEl);
    recipeItemEl.appendChild(cardBodyEl);

    recipeListEl.appendChild(recipeItemEl);
  });
}
function displayRecipeDetails(recipe) {
  // Display recipe image
  const recipeImage = document.getElementById("recipeImage");
  recipeImage.style.backgroundImage = `url('${recipe.image}')`;

  // Display recipe information
  const recipeInfo = document.getElementById("recipeInfo");
  recipeInfo.innerHTML = `
    <h2>${recipe.title}</h2>
    <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
    <p><strong>Servings:</strong> ${recipe.servings}</p>
    <p><strong>Instructions:</strong> ${recipe.instructions || 'No instructions available.'}</p>
  `;
}
function redirectToRecipeDetails(recipeId) {
  // Redirect to a page with details of the recipe using the recipeId
  window.location.href = `recipe-details.html?id=${recipeId}`;
}

async function getRecipes() {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/random?number=2&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.recipes;
}

async function init() {
  const recipes = await getRecipes();
  displayRecipes(recipes);
}

init();
