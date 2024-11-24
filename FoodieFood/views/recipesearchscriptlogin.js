const API_KEY = "d618406857c34320bf55b6e945393eba";
    const recipeListEl = document.getElementById("recipeList");

    async function searchRecipe() {
      const searchInput = document.getElementById("searchInput").value;

      // Check if search input is not empty
      if (!searchInput.trim()) {
        alert("Please enter a recipe name.");
        return;
      }

      // Get selected allergens
      const allergens = getSelectedAllergens();

      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${searchInput}&number=5` +
          `&intolerances=${allergens}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          displayRecipes(data.results, allergens);
        } else {
          alert("No recipes found. Try a different search term.");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while fetching recipes. Please try again later.");
      }
    }

    function getSelectedAllergens() {
      const allergens = [
        "dairy", "egg", "gluten", "grain", "peanut", "seafood",
        "sesame", "shellfish", "soy", "sulfite", "treenut", "wheat"
      ];

      return allergens.filter(allergen => document.getElementById(allergen).checked).join(",");
    }

    function displayRecipes(recipes, selectedAllergens) {
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

    const saveButtonEl = document.createElement("button");
    saveButtonEl.innerHTML = `<img src="/images/bookmark.svg" onclick="saveRecipe('${recipe.id}', '${recipe.title}')"/>`;


    const headerEl = document.createElement("header");

    const titleEl = document.createElement("div");
    titleEl.classList.add("title");
    titleEl.innerHTML = `<h3>${recipe.title}</h3>`;

    // Display intolerances only when there are selected intolerances
    const selectedIntolerances = getRecipeIntolerances(recipe, selectedAllergens);
    if (selectedIntolerances) {
      const intolerancesEl = document.createElement("div");
      //intolerancesEl.innerHTML = `<p><strong>Intolerances:</strong> ${selectedIntolerances}</p>`;
      //headerEl.appendChild(intolerancesEl);
    }

    headerEl.appendChild(titleEl);
    cardBodyEl.appendChild(headerEl);

    recipeItemEl.appendChild(featuredImageEl);
    recipeItemEl.appendChild(cardBodyEl);
    recipeItemEl.appendChild(saveButtonEl);

    recipeListEl.appendChild(recipeItemEl);
  });
}


    function getRecipeIntolerances(recipe, selectedAllergens) {
      const intolerances = [];

      // Check if each selected allergen is intolerant
      selectedAllergens.split(",").forEach(allergen => {
        const isIntolerant = recipe.intolerances && recipe.intolerances.includes(allergen);
        intolerances.push(`${allergen}: ${isIntolerant}`);
      });

      return intolerances.join(", ");
    }

    function redirectToRecipeDetails(recipeId) {
      // Redirect to a page with details of the recipe using the recipeId
      window.location.href = `/recipedetailslogin.ejs?id=${recipeId}`;
    }