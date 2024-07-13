/// <reference types="../@types/jquery" />
const menuToggle = document.getElementById("menu-toggle");
const leftMenu = document.getElementById("leftMenu");
const homeContent = document.getElementById("home-content");
const closeIcon = menuToggle.querySelector(".close");
const openIcon = menuToggle.querySelector(".fa-bars");

const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
const search = document.getElementById("search");
const categoriesButton = document.getElementById("categories");
const areaButton = document.getElementById("allArea");

menuToggle.addEventListener("click", function () {
  if (leftMenu.style.width === "250px") {
    closeNav();
  } else {
    openNav();
  }
});
function openNav() {
  leftMenu.style.width = "250px";
  homeContent.style.marginLeft = "250px";
  closeIcon.classList.replace("d-none", "d-block");
  openIcon.style.display = "none";

  // Loop through each anchor tag and animate
  $(".nav-link a").each(function (index) {
    $(this).animate(
      {
        top: 0,
        opacity: 1,
      },
      (index + 5) * 40
    );
  });
}

function closeNav() {
  leftMenu.style.width = "0";
  homeContent.style.marginLeft = "0";
  closeIcon.classList.replace("d-block", "d-none");
  openIcon.style.display = "block";

  $(".nav-link a").each(function (index) {
    $(this).animate(
      {
        top: 200,
        opacity: 0.3,
      },
      (index + 5) * 80
    );
  });
}

$(".nav-link a").on("click", function (e) {
  e.preventDefault();
  closeNav();
});
$(document).ready(() => {
  $(".loading-screen").fadeIn(400);
  setTimeout(() => {
    $(".loading-screen").fadeOut(300);
  }, 3000);

  SearchByName("").then(() => {
    $("body").css("overflow", "auto");
    $(".loading-screen").fadeOut(300);
  });
});
async function defaultCategories(term) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    response = await response.json();
    displayMeals(response.meals);
  } catch (error) {
    displayError("Error fetching meals. Please try again later.");
  }

  $(".loading-screen").fadeOut(300);
}

function displayMeals(arr) {
  let Box = "";

  if (!arr || arr.length === 0) {
    Box = `
        <div class="col-12 text-center">
          <h3 class="text-danger">No meals found. Please try a different search letter.</h3>
        </div>`;
  } else {
    for (let i = 0; i < arr.length; i++) {
      Box += `
          <div class="col-md-3">
            <div data-id="${arr[i].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${arr[i].strMealThumb}" alt="">
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${arr[i].strMeal}</h3>
              </div>
            </div>
          </div>
        `;
    }
  }
  rowData.innerHTML = Box;
  addMealClickEvent();
}

async function getMealById(id) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    response = await response.json();
    displayDetailsMealData(response.meals[0]);
  } catch (error) {
    displayError("Error fetching meal details. Please try again later.");
  }

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
}

function addMealClickEvent() {
  const meals = document.querySelectorAll(".meal");
  meals.forEach((meal) => {
    meal.addEventListener("click", (e) => {
      let mealId = meal.getAttribute("data-id");
      getMealById(mealId);
    });
  });
}

function displayDetailsMealData(details) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (details[`strIngredient${i}`]) {
      ingredients += `<span class="bg-info-subtle fs-6 text-info-emphasis p-2 rounded-2 text-black m-2 d-inline-block">${
        details[`strMeasure${i}`]
      } ${details[`strIngredient${i}`]}</span>`;
    }
  }
  let tags = "";
  if (details.strTags) {
    details.strTags.split(",").forEach((tag) => {
      tags += `<span class="bg-danger-subtle rounded-1 text-danger-emphasis d-inline-block p-2 m-1 fs-6">${tag}</span>`;
    });
  }

  let box2 = ` 
      <div class="col-md-4 details">
        <img class="w-100 mt-5 " src="${details.strMealThumb}" alt="${
    details.strMeal
  }"/>
        <h2 class="pt-5">${details.strMeal}</h2>
      </div>
      <div class="col-md-8 pt-5">
        <div class="">
          <h3>Instructions</h3>
          <p>${details.strInstructions}</p>
        </div>
        <p class="mt-1 fs-3">Area: 
          <span class="fs-3">${
            details.strArea ? details.strArea : "Unknown"
          } </span>
        </p>
        <p class="mt-2 fs-3">Category:
          <span class="p-2 rounded-4">${details.strCategory}</span>
        </p>
        <p class="mt-2 fs-3">Recipes: <br/>
          ${ingredients}
        </p>
        <p class="mt-2 fs-3">Tags:<br/>
          ${tags}
        </p>
        <a type="button" href="${
          details.strSource
        }" target="_blank" class="btn btn-success my-5">Source</a>
        <a type="button" href="${
          details.strYoutube
        }" target="_blank" class="btn btn-danger my-5">YouTube</a>
      </div>`;

  rowData.innerHTML = box2;
  closeNav();
}

search.addEventListener("click", function () {
  searchContainer.style.display = "block";
  rowData.style.display = "none";
  let box2 = `
      <div class="mb-3 d-flex gx-4 colorPlaceholder">
        <input type="text" class="form-control me-4 bg-black text-white" id="SearchByName" placeholder="Search By Name ">
        <input type="text" class="form-control bg-black text-white" id="SearchByFirstLetter" placeholder="Search By First Letter">
      </div>  
    `;

  searchContainer.innerHTML = box2;
  addEvent();

  const searchByName = document.getElementById("SearchByName");
  const searchByFirstLetter = document.getElementById("SearchByFirstLetter");

  searchByName.addEventListener("focus", function (e) {
    searchByFirstLetter.value = "";
    closeNav();
  });
  searchByFirstLetter.addEventListener("focus", function (e) {
    searchByName.value = "";
    closeNav();
  });
});

async function SearchByName(name) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );
    response = await response.json();
    displayMeals(response.meals);
  } catch (error) {
    displayError("Error fetching meals. Please try again later.");
  }

  $(".loading-screen").fadeOut(300);
}

async function SearchByFirstLetter(letter) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  if (letter === "") {
    rowData.innerHTML = `<div class="col-12 text-center">
          <h3 class="text-danger">Please Enter First Letter</h3>
        </div>`;
    $(".loading-screen").fadeOut(300);
    return;
  }

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    response = await response.json();
    displayMeals(response.meals);
  } catch (error) {
    displayError("Please enter a First letter only.");
  }

  $(".loading-screen").fadeOut(300);
}

function addEvent() {
  document
    .getElementById("SearchByName")
    .addEventListener("input", function (e) {
      SearchByName(e.target.value);
      rowData.style.display = "flex";
    });

  document
    .getElementById("SearchByFirstLetter")
    .addEventListener("input", function (e) {
      SearchByFirstLetter(e.target.value);
      rowData.style.display = "flex";
    });
}

categoriesButton.addEventListener("click", function (e) {
  allCategories();
});

async function allCategories() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  displayCategories(response.categories);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

// Display categories in the UI
function displayCategories(categories) {
  let box = "";
  categories.forEach((category) => {
    box += `
    <div class="col-md-3">
      <div data-id="${
        category.strCategory
      }" class="text-center meal position-relative overflow-hidden rounded-2 cursor-pointer" >
        <img class="w-100 rounded-3" src="${category.strCategoryThumb}" alt="">
        <div class="meal-layer position-absolute d-flex align-items-center flex-column text-black p-2">
          <h3>${category.strCategory}</h3>
          <p>${category.strCategoryDescription
            .split(" ")
            .slice(0, 20)
            .join(" ")}</p>
        </div>
      </div>
    </div>
    `;
  });
  rowData.innerHTML = box;
  addCategoryClickEvent();
}

function addCategoryClickEvent() {
  const categoryElements = document.querySelectorAll(".meal");
  categoryElements.forEach((categoryElement) => {
    categoryElement.addEventListener("click", (e) => {
      let categoryId = categoryElement.getAttribute("data-id");
      getCategoryById(categoryId);
  closeNav();
    });
  });
}

async function getCategoryById(categoryId) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`
  );
  response = await response.json();
  displayMeals(response.meals);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

areaButton.addEventListener("click", function (e) {
  getArea();
});

async function getArea() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  displayAreas(response.meals);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

function displayAreas(areas) {
  let box = "";
  areas.forEach((area) => {
    box += `
      <div class="col-md-3">
        <div data-area="${area.strArea}" class="text-center meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h2>${area.strArea}</h2>
        </div>
      </div>`;
  });
  rowData.innerHTML = box;
  addAreaClickEvent();
}

function addAreaClickEvent() {
  const areaElements = document.querySelectorAll("[data-area]");
  areaElements.forEach((areaElement) => {
    areaElement.addEventListener("click", (e) => {
      let areaName = areaElement.getAttribute("data-area");
      getMealsByArea(areaName);
      closeNav();
    });
  });
}

async function getMealsByArea(areaName) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  response = await response.json();
  displayMeals(response.meals);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

let Ingredients = document.getElementById("Ingredients");
Ingredients.addEventListener("click", function (e) {
  getIngredients();
});

async function getIngredients() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngredients(response.meals);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

function displayIngredients(ingredients) {
  let box = "";
  let displayedCount = 0;

  for (let i = 0; i < ingredients.length && displayedCount < 20; i++) {
    const ingredient = ingredients[i];
    box += `
        <div class="col-md-3">
          <div data-id="${
            ingredient.strIngredient
          }" class="text-center meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${ingredient.strIngredient}</h3>
            <p>${
              ingredient.strDescription
                ? ingredient.strDescription.split(" ").slice(0, 20).join(" ")
                : "No description available"
            }</p>
          </div>
        </div>`;
    displayedCount++;
  }

  rowData.innerHTML = box;
  addIngredientClickEvent();
}

function addIngredientClickEvent() {
  const IngredientElements = document.querySelectorAll(".meal");
  IngredientElements.forEach((IngredientElement) => {
    IngredientElement.addEventListener("click", (e) => {
      let IngredientId = IngredientElement.getAttribute("data-id");
      getIngredientById(IngredientId);
      closeNav();
    });
  });
}

async function getIngredientById(IngredientId) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${IngredientId}`
  );
  response = await response.json();
  displayMeals(response.meals);

  $(".loading-screen").fadeOut(300);
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
}

function displayError(message) {
  rowData.innerHTML = `<div class="col-12 text-center">
      <h3 class="text-danger">${message}</h3>
    </div>`;
  $(".loading-screen").fadeOut(300);
}

let Contact = document.getElementById("Contact");
Contact.addEventListener("click", function (e) {
  displayContact();
  searchContainer.style.display = "none";
  rowData.style.display = "flex";
});

function displayContact() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput"  type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none ">
                      3 : 15 Letters <br /> 
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput"  type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput"  type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput"  type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age From 20 To 100
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput"  type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none ">
                   
"Password must contain a letter, number, special character, and be at least 8 characters long"
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput"  type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;

  const submitBtn = document.getElementById("submitBtn");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");
  const phoneInput = document.getElementById("phoneInput");
  const ageInput = document.getElementById("ageInput");
  addInputEvent();
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (
      validateInputs(nameInput) &&
      validateInputs(emailInput) &&
      validateInputs(passwordInput) &&
      validateInputs(repasswordInput) &&
      validateInputs(phoneInput) &&
      validateInputs(ageInput)
    ) {
      displaySuccessMessage();
    } else {
      rowData.innerHTML = `
          <div class="col-12 text-center">
            <h3 class="text-danger">Please fill out all fields.</h3>
          </div>`;
    }
  });
}

// The rest of your code...
function validateInputs(element) {
  const regex = {
    nameInput: /^[a-zA-Z ]{3,15}$/,
    emailInput: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phoneInput: /^\+?(?:\d{1,3})?[-. (]?\d{3}[-. )]?\d{3}[-. ]?\d{4}$/,
    ageInput: /^(2[0-9]|[3-9][0-9]|100)$/,
    passwordInput:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    repasswordInput:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  };

  if (!regex[element.id]) {
    return;
  }

  if (element.value === "") {
    element.classList.remove("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
    checkAllInputsValid();
    return false;
  }

  if (regex[element.id].test(element.value)) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
    element.nextElementSibling.classList.add("d-none");
    checkAllInputsValid();
    return true;
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.nextElementSibling.classList.remove("d-none");

    return false;
  }
}

function checkAllInputsValid() {
  const inputs = document.querySelectorAll("input");
  let allValid = true;

  inputs.forEach((input) => {
    if (!input.classList.contains("is-valid")) {
      allValid = false;
    }
  });

  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");

  if (passwordInput.value !== repasswordInput.value) {
    repasswordInput.classList.remove("is-valid");
    repasswordInput.classList.add("is-invalid");
    repasswordInput.nextElementSibling.classList.remove("d-none");
    allValid = false;
  } else if (repasswordInput.value !== "") {
    repasswordInput.classList.remove("is-invalid");
    repasswordInput.classList.add("is-valid");
    repasswordInput.nextElementSibling.classList.add("d-none");
  } else {
    repasswordInput.classList.remove("is-valid");
    repasswordInput.classList.remove("is-invalid");
    repasswordInput.nextElementSibling.classList.add("d-none");
  }

  const submitBtn = document.getElementById("submitBtn");

  if (submitBtn) {
    if (allValid) {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", true);
    }
  }
}

function addInputEvent() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      validateInputs(event.target);
    });
  });
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      closeNav();
    });
  });
}

function displaySuccessMessage() {
  rowData.innerHTML = `
      <div class="col-12 text-center">
        <h3 class="text-success">Your message has been sent successfully !</h3>
      </div>`;
}
