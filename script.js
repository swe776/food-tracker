const targetCalories = 1250;
const targetProtein = 85;

let totalCalories = 0;
let totalProtein = 0;

// Load food DB from localStorage
let foodDB = JSON.parse(localStorage.getItem('foodDB')) || [];
populateFoodSelect();
renderFoodDBTable();

// Add food to DB
function addFoodToDB() {
  const name = document.getElementById('dbFoodName').value;
  const servingGrams = parseFloat(document.getElementById('dbServingGrams').value);
  const calories = parseFloat(document.getElementById('dbCalories').value);
  const protein = parseFloat(document.getElementById('dbProtein').value);

  if (!name || isNaN(servingGrams) || isNaN(calories) || isNaN(protein)) {
    alert("Enter valid food and macros!");
    return;
  }

  foodDB.push({ name, servingGrams, calories, protein });
  localStorage.setItem('foodDB', JSON.stringify(foodDB));

  populateFoodSelect();
  renderFoodDBTable();

  // Clear inputs
  document.getElementById('dbFoodName').value = '';
  document.getElementById('dbServingGrams').value = '';
  document.getElementById('dbCalories').value = '';
  document.getElementById('dbProtein').value = '';
}

// Render Food DB Table
function renderFoodDBTable() {
  const tableBody = document.querySelector('#dbTable tbody');
  tableBody.innerHTML = '';

  foodDB.forEach((food, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${food.name}</td>
      <td>${food.servingGrams}</td>
      <td>${food.calories}</td>
      <td>${food.protein}</td>
      <td><button onclick="deleteFoodDB(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Delete food from DB
function deleteFoodDB(index) {
  if (confirm(`Delete ${foodDB[index].name} from database?`)) {
    foodDB.splice(index, 1);
    localStorage.setItem('foodDB', JSON.stringify(foodDB));
    populateFoodSelect();
    renderFoodDBTable();
  }
}

// Populate food dropdown
function populateFoodSelect() {
  const select = document.getElementById('foodSelect');
  select.innerHTML = '<option value="">-- Select Food --</option>';
  foodDB.forEach((food, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${food.name} (${food.servingGrams}g, ${food.calories} kcal, ${food.protein} g)`;
    select.appendChild(option);
  });
}

// Add food to daily log
function addFoodToDay() {
  const index = document.getElementById('foodSelect').value;
  const grams = parseFloat(document.getElementById('grams').value);

  if (index === "" || isNaN(grams) || grams <= 0) {
    alert("Select a food and enter valid grams!");
    return;
  }

  const food = foodDB[index];
  const calories = (food.calories * grams) / food.servingGrams;
  const protein = (food.protein * grams) / food.servingGrams;

  const tableBody = document.querySelector('#foodTable tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${food.name}</td>
    <td>${grams} g</td>
    <td>${calories.toFixed(1)}</td>
    <td>${protein.toFixed(1)}</td>
    <td><button onclick="removeFood(this, ${calories}, ${protein})">Remove</button></td>
  `;
  tableBody.appendChild(row);

  totalCalories += calories;
  totalProtein += protein;
  updateTotals();

  document.getElementById('grams').value = '';
}

// Remove food from daily log
function removeFood(button, calories, protein) {
  button.parentElement.parentElement.remove();
  totalCalories -= calories;
  totalProtein -= protein;
  updateTotals();
}

// Update totals and progress bars
function updateTotals() {
  document.getElementById('totalCalories').textContent = totalCalories.toFixed(1);
  document.getElementById('totalProtein').textContent = totalProtein.toFixed(1);

  const calPercent = Math.min((totalCalories / targetCalories) * 100, 100);
  const protPercent = Math.min((totalProtein / targetProtein) * 100, 100);

  const calBar = document.getElementById('calProgress');
  const protBar = document.getElementById('protProgress');

  calBar.style.width = calPercent + "%";
  protBar.style.width = protPercent + "%";

  calBar.style.background = totalCalories <= targetCalories ? "#27ae60" : "#e74c3c";
  protBar.style.background = totalProtein <= targetProtein ? "#27ae60" : "#e74c3c";
}
