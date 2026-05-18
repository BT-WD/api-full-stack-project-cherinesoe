const mdbBaseUrl = "https://www.themealdb.com/api/json/v1/1/";
const searchBar = document.getElementById("search-bar");
const findBtn = document.getElementById("find");
const recipesDiv = document.getElementById("recipes");
const recipeImg = document.getElementById("recipeImg");
const recipeName = document.getElementById("recipeName");
const text = document.getElementById("text")
const instructions = document.getElementById("instructions");
const likedBtn = document.getElementById("likedBtn");
const likedList = document.getElementById("likedList");
recipeImg.style.setProperty("display", "none");


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
      return recipes;
    }
  } catch (error) {
    console.log(error);
  }
}

const getRecipes = async () => {
  const cuisineRecipes = await getCuisineRecipes();
  const showRecipes = [];

  if (searchBar.value == "" && (cuisineRecipes != null || cuisineRecipes != undefined)) {
    for (const recipe of cuisineRecipes) {
      showRecipes.push(recipe);
    }
  } else {
    const mainIng = await getMainIngredient(searchBar.value);
    if (mainIng == null || mainIng == undefined || cuisineRecipes == null || cuisineRecipes == undefined) {
      return showRecipes;
    }

    for (const recipe of cuisineRecipes) {
      for (const main of mainIng) {
        if (recipe.strMeal == main.strMeal) {
          showRecipes.push(recipe);
        }
      }
    }
  }

  console.log(showRecipes);
  return showRecipes;
}

const getRecipeInfo = async(recipe) => {
  const urlToFetch = `${mdbBaseUrl}lookup.php?i=${recipe.idMeal}`; 

  try{
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      const info = jsonResponse.meals[0];
      return info;
    }
  } catch (error) {
    console.log(error);
  }
}

const displayRecipes = (info) => {
  console.log(info)
  recipeImg.src = info.strMealThumb;
  recipeName.innerText = info.strMeal;
  instructions.innerText = info.strInstructions;
};

const populateLiked = () => {
  const liked = JSON.parse(localStorage.getItem("liked")) || [];
  list = "";

  for (const like of liked) {
    list += like + '\n';
  }
  
  likedList.innerText = list;

  localStorage.setItem("liked", JSON.stringify(liked));
}

getCuisines().then(populateCuisineDropdown);
populateLiked();

findBtn.addEventListener('click', async () => {
  const results = await getRecipes();
  const randomRecipe = results[Math.floor(Math.random() * results.length)];

  if (results.length == 0) {
    text.innerText = "No recipes found matching both criteria.";
    recipeImg.style.setProperty("display", "none");
    instructions.innerText = "";
    recipeName.innerText = '';
    return;
  } else {
    text.innerText = "";
    recipeImg.style.removeProperty("display");
  }

  const info = await getRecipeInfo(randomRecipe);

  displayRecipes(info);

  likedBtn.onclick = () => {
    const liked = JSON.parse(localStorage.getItem("liked")) || [];
    liked.push(info.strMeal);
    localStorage.setItem("liked", JSON.stringify(liked));
    populateLiked();
  }
});