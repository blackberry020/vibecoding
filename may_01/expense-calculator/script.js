// Store expenses and categories in arrays
let expenses = [];
let categories = [];

// Load categories from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    setupEventListeners();
});

// Function to switch between tabs
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content and activate its button
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Function to load categories from localStorage
function loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    categories = savedCategories ? JSON.parse(savedCategories) : [];
    updateCategoriesList();
    updateCategoryDropdown();
}

// Function to save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Function to add a new category
function addCategory() {
    const categoryInput = document.getElementById('newCategory');
    const categoryName = categoryInput.value.trim();
    
    if (categoryName) {
        if (categories.includes(categoryName)) {
            alert('This category already exists!');
            return;
        }
        
        categories.push(categoryName);
        saveCategories();
        updateCategoriesList();
        updateCategoryDropdown();
        categoryInput.value = '';
    } else {
        alert('Please enter a category name!');
    }
}

// Function to delete a category
function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category? The category will be removed from the dropdown but existing expenses will be preserved.')) {
        categories.splice(index, 1);
        saveCategories();
        updateCategoriesList();
        updateCategoryDropdown();
    }
}

// Function to update the categories list in the table
function updateCategoriesList() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';
    
    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category}</td>
            <td>
                <button class="delete-btn" onclick="deleteCategory(${index})">Delete</button>
            </td>
        `;
        categoriesList.appendChild(row);
    });
}

// Function to update the category dropdown
function updateCategoryDropdown() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add active categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Add categories from existing expenses that are not in the active categories list
    const usedCategories = new Set(expenses.map(expense => expense.category));
    usedCategories.forEach(category => {
        if (!categories.includes(category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `${category} (inactive)`;
            option.classList.add('inactive-category');
            categorySelect.appendChild(option);
        }
    });
}

// Function to add a new expense
function addExpense() {
    const categorySelect = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);

    if (!categorySelect.value) {
        alert('Please select a category!');
        return;
    }

    if (!amountInput.value || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0!');
        return;
    }

    if (amount > 999999999.99) {
        alert('Amount is too large! Maximum allowed is $999,999,999.99');
        return;
    }

    // Round to 2 decimal places to avoid floating point issues
    const roundedAmount = Math.round(amount * 100) / 100;
    
    expenses.push({ category: categorySelect.value, amount: roundedAmount });
    updateExpensesList();
    clearForm();
}

// Function to clear the form
function clearForm() {
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpensesList();
    calculateExpenses();
}

// Function to update the expenses list in the table
function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        const isInactiveCategory = !categories.includes(expense.category);
        row.innerHTML = `
            <td>${expense.category}${isInactiveCategory ? ' (inactive)' : ''}</td>
            <td>$${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        if (isInactiveCategory) {
            row.classList.add('inactive-category-row');
        }
        expensesList.appendChild(row);
    });
}

// Function to calculate and display expense statistics
function calculateExpenses() {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalExpenses').textContent = 
        `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Calculate average daily expense
    const averageDaily = total / 30; // Assuming 30 days per month
    document.getElementById('averageExpense').textContent = 
        `$${averageDaily.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Combine expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = {
                category: expense.category,
                amount: 0,
                isInactive: !categories.includes(expense.category)
            };
        }
        acc[expense.category].amount += expense.amount;
        return acc;
    }, {});

    // Find top 3 expenses by category
    const topExpenses = Object.values(expensesByCategory)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    const topExpensesList = document.getElementById('topExpenses');
    topExpensesList.innerHTML = topExpenses.length > 0 
        ? topExpenses.map(expense => 
            `<li>${expense.category}${expense.isInactive ? ' (inactive)' : ''}: $${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>`
        ).join('')
        : '<li>No expenses yet</li>';
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('newCategory').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCategory();
        }
    });

    document.getElementById('amount').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addExpense();
        }
    });
} 