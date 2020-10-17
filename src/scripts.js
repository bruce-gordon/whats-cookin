const homeButton = document.querySelector(".home-view-button");
const favoritesButton = document.querySelector(".favorites-view-button");
const searchButton = document.querySelector(".search-button");
const welcome = document.querySelector(".greeting");
const searchBar = document.querySelector(".search-input");

const sectionHeading = document.querySelector(".recipes-heading");

const homeView = document.querySelector(".home-view");
const favoriteView = document.querySelector(".favorite-view");
const singleCategoryView = document.querySelector(".single-category-view");
const recipeView = document.querySelector(".recipe-view");

const checkPantryButton = document.querySelector("#pantry-button");
const getShoppingList = document.querySelector("#shopping-list-button");
const recipeImage = document.querySelector(".recipe-image");
const ingredientList = document.querySelector(".ingredient-list");
const directionsList = document.querySelector(".directions-list")

let user;
let pantry;

window.addEventListener('load', loadApp);
homeView.addEventListener('click', function() {
  goToRecipeResults(event.target.innerText.toLowerCase());
});
searchButton.addEventListener('click', function() {
  goToRecipeResults(searchBar.value);
});
homeButton.addEventListener('click', goToHome);
favoritesButton.addEventListener('click', goToFavorites);
singleCategoryView.addEventListener('click', function() {
  showSelectRecipe(event.target.closest('article').children[2].innerText);
});

function goToHome() {
  singleCategoryView.classList.add('hidden');
  homeView.classList.remove('hidden');
  sectionHeading.innerText = `Need Ideas?`;
}

function goToFavorites() {
  singleCategoryView.classList.add('hidden');
  homeView.classList.add('hidden');
  favoriteView.classList.remove('hidden');
  sectionHeading.innerText = `My favorite recipes`;
}

function getTags() {
  let tags = [];
  recipeData.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  return tags.map(tag => {
    let word = tag.charAt(0).toUpperCase() + tag.slice(1);
    return word;
  });
}

function generateCategories() {
  let categories = getTags();
  displayCat(categories);
}

function displayCat(items) {
  homeView.innerHTML = '';
  items.forEach(item => {
    homeView.innerHTML += `<article class="category">${item}
    </article>`;
  });
}

function getRandom(max) {
  return Math.floor(Math.random() * max)
}

function instantiatePantry(data, index) {
  pantry = new Pantry(data[index].pantry);
}

function instantiateUser(data, index) {
  user = new User(data[index].id, data[index].name, pantry);
}

function getFirstName(name) {
  let splitName = name.split(' ');
  return splitName.shift();
}

function loadApp() {
  let indexNum = getRandom(usersData.length);
  instantiatePantry(usersData, indexNum);
  instantiateUser(usersData, indexNum);
  welcome.innerText = `Welcome ${getFirstName(user.name)}!`
  generateCategories();
}

function getRecipesByCategory(category) {
  let matches = [];
  recipeData.forEach(recipe => {
    if (recipe.tags.includes(category)) {
      matches.push(recipe);
    }
  });
  return matches;
}

function getRecipesByIngredient(input) {
  let matches = [];
  let ingredientId = '';
  ingredientsData.forEach(ingredient => {
    if (ingredient.name === input || ingredient.name === input.toLowerCase()) {
      ingredientId = ingredient.id;
    }
  });
  recipeData.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.id === ingredientId) {
        matches.push(recipe);
      }
    });
  });
  return matches;
}

function getRecipes(input) {
  let recipes = '';
  if (getRecipesByCategory(input).length) {
    recipes = getRecipesByCategory(input);
  } else if (getRecipesByIngredient(input).length) {
    recipes = getRecipesByIngredient(input);
  };
  return recipes;
}

function getSingleRecipe(name) {
  let rInfo = recipeData.find(recipe => recipe.name === name);
  console.log(rInfo.ingredients);
  let recipe = new Recipe(rInfo.id, rInfo.image, rInfo.ingredients, rInfo.instructions, rInfo.name, rInfo.tags);
  return recipe
}

function goToRecipeResults(input) {
  let recipes = getRecipes(input);
  if (recipes) {
    singleCategoryView.innerHTML = '';
    recipes.forEach(recipe => {
      singleCategoryView.innerHTML += `<article class="category-recipe"><img class="recipe-picture" src="${recipe.image}" alt="photo of ${recipe.name}"><img id="favorite" src="assets/icons/001-bookmark.svg" alt="bookmark-icon"><h4 class="recipe-name">${recipe.name}</h4></article>`;
    });
    sectionHeading.innerText = input.charAt(0).toUpperCase() + input.slice(1);
  } else {
    singleCategoryView.innerHTML = '';
    sectionHeading.innerText = `Sorry!  We did not find ${input} in our recipes.  Please try again.`;
  }
  singleCategoryView.classList.remove('hidden');
  homeView.classList.add('hidden');
}

function showSelectRecipe(targetName) {
  let recipe = getSingleRecipe(targetName);
  console.log(recipe);
  console.log(recipe.getInstructions());
  sectionHeading.innerText = `${recipe.name}`;

  recipeImage.innerHTML = `<img class="single-recipe-picture" src="${recipe.image}" alt="photo of ${recipe.image}"><img id="favorite" src="assets/icons/001-bookmark.svg" alt="bookmark-icon">`;

  displayIngredients(recipe);
  displayDirections(recipe);

  recipeView.classList.remove('hidden');
  singleCategoryView.classList.add('hidden');
  favoriteView.classList.add('hidden');
}

function displayDirections(recipe) {
  let list = recipe.getInstructions();
  directionsList.innerHTML = '';
  list.forEach(item => {
    directionsList.innerHTML += `<p class="direction-item">Step ${item.stepNumber}: ${item.step}</><br>`
  });
}

function displayIngredients(recipe) {
  let list = recipe.getIngredientList();
  ingredientList.innerHTML = '';
  list.forEach(item => {
    ingredientList.innerHTML += `<p class="ingredient-item">${item}</p><br>`
  });
}
