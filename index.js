const mdbBaseUrl = "https://www.themealdb.com/api/json/v1/1/";

const getCuisines = async () => {
  const cuisineRequestEndpoint = "list.php?a=list";
  const urlToFetch = `${mdbBaseUrl}${cuisineRequestEndpoint}`;

  try{
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json();
      const cuisines = jsonResponse.meals;
      console.log(cuisines);
      return cuisines;
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

getCuisines().then(populateCuisineDropdown);