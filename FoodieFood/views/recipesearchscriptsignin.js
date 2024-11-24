const API_KEY = "d618406857c34320bf55b6e945393eba";
const recipeListEl = document.getElementById("recipeList");

async function searchRecipe() {
  const searchInput = document.getElementById("searchInput").value;

  // Check if search input is not empty
  if (!searchInput.trim()) {
    alert("Please enter a recipe name.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchInput}&number=5`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      displayRecipes(data.results);
    } else {
      alert("No recipes found. Try a different search term.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred while fetching recipes. Please try again later.");
  }
}

function displayRecipes(recipes) {
  recipeListEl.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeItemEl = document.createElement("li");
    recipeItemEl.classList.add("card");

    // Add onclick attribute to each card
    recipeItemEl.setAttribute("onclick", `redirectToRecipeDetails('${recipe.id}')`);

    const featuredImageEl = document.createElement("img");
    featuredImageEl.src = recipe.image; // Assuming recipe.image is the URL of the image
    featuredImageEl.alt = recipe.title; // Provide a meaningful alt text
    featuredImageEl.classList.add("featured-image");
    featuredImageEl.style.height = "200px"; // Set the desired height

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

function saveRecipe(recipeId, recipeTitle) {
  // Modify this function to save the recipe details as needed
  console.log(`Recipe ID: ${recipeId}, Recipe Title: ${recipeTitle} saved.`);
}

function redirectToRecipeDetails(recipeId) {
  // Redirect to a page with details of the recipe using the recipeId
  window.location.href = `/recipedetailssignin.ejs?id=${recipeId}`;
}
