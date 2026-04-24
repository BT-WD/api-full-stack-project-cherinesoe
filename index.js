const mdbBaseUrl = "https://www.themealdb.com/api/json/v1/1/";
const searchBar = document.getElementById("search-bar");
const findBtn = document.getElementById("find");

const getCuisines = async () => {
  const cuisineRequestEndpoint = "list.php?a=list";
  const urlToFetch = `${mdbBaseUrl}${cuisineRequestEndpoint}`;

  try{
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      const cuisines = jsonResponse.meals;
      return cuisines;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMainIngredient = async (ingredient) => {
  const mainIngEndpoint = `filter.php?i=${ingredient}`;
  const urlToFetch = `${mdbBaseUrl}${mainIngEndpoint}`;

  try{
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      const meals = jsonResponse.meals;
      console.log(meals);
      return meals;
    }
  } catch (error) {
    console.log(error);
  }
};

const populateCuisineDropdown = (cuisines) => {
  const select = document.getElementById("cuisines");

  for (const cuisine of cuisines) {
    let option = document.createElement("option");
    option.text = cuisine.strArea;
    select.appendChild(option);
  }
};

const getCuisineRecipes = async () => {
  const selectedCuisine = document.getElementById("cuisines").value;
  console.log(selectedCuisine);

  const urlToFetch = `${mdbBaseUrl}filter.php?a=${selectedCuisine}`; 

  try{
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      const recipes = jsonResponse.meals;
      console.log(recipes);
      return recipes;
    }
  } catch (error) {
    console.log(error);
  }
}

const getRecipes = async () => {
  const mainIng = await getMainIngredient(searchBar.value);
  const cuisineRecipes = await getCuisineRecipes();
  const showRecipes = [];

  for (const recipe of cuisineRecipes) {
    for (const main of mainIng) {
      if (recipe.strMeal == main.strMeal) {
        showRecipes.push(recipe);
      }
    }
  }

  console.log(showRecipes);
}

const displayRecipes = (recipes) => {
  const recipesDiv = document.getElementById("recipes");
  
  // Clear the div so old searches don't stay there
  recipesDiv.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    recipesDiv.innerHTML = "<p>No recipes found matching both criteria.</p>";
    return;
  }

  // Loop through each recipe and create a 'card'
  recipes.forEach(recipe => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card"; // Good for styling later

    recipeCard.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
      <h3>${recipe.strMeal}</h3>
      <button onclick="likeRecipe('${recipe.strMeal}')">Like</button>
    `;

    recipesDiv.appendChild(recipeCard);
  });
};

getCuisines().then(populateCuisineDropdown);

findBtn.addEventListener('click', async () => {
  // const mainIng = getMainIngredient(searchBar.value);
  // const cuisineRecipes = getCuisineRecipes();

  const results = await getRecipes();

  displayRecipes(results);
  // getRecipes();
});