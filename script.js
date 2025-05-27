const container = document.getElementById("recipes-container");

function searchRecipe() {
  const query = document.getElementById("searchInput").value.trim();
  container.innerHTML = "<p>Loading recipes...</p>";

  if (!query) {
    container.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      const meals = data.meals;
      if (!meals) {
        container.innerHTML = "<p>No recipes found. Try something else!</p>";
        return;
      }

      meals.forEach(meal => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        const detailsId = `details-${meal.idMeal}`;

        card.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="content">
            <h3>${meal.strMeal}</h3>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <button onclick="toggleDetails('${meal.idMeal}')">View Recipe</button>
            <div class="recipe-details" id="${detailsId}" style="display:none;"></div>
          </div>
        `;

        container.appendChild(card);
      });
    });
}

function toggleDetails(id) {
  const detailsDiv = document.getElementById(`details-${id}`);

  if (detailsDiv.innerHTML !== "") {
    detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients.push(`${measure} ${ing}`);
        }
      }

      detailsDiv.innerHTML = `
        <h4>Ingredients:</h4>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>Instructions:</h4>
        <p>${meal.strInstructions}</p>
      `;
      detailsDiv.style.display = "block";
    });
}
