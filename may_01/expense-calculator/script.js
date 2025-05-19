// Store expenses and categories in arrays
let expenses = [];
let categories = [];

// Function to load expenses from localStorage
function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        try {
            expenses = JSON.parse(savedExpenses);
        } catch (e) {
            console.error('Error loading expenses:', e);
            expenses = [];
        }
    } else {
        expenses = [];
    }
    displayExpenses(); // Immediately display expenses after loading
}

// Load categories from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories(); // Load categories first
    loadExpenses(); // This will also call displayExpenses
    setupEventListeners();
    initializeImprovements();
    
    // Set max date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').max = today;
    if (document.getElementById('editExpenseDate')) {
        document.getElementById('editExpenseDate').max = today;
    }
    
    // Add modal close button event listener
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('editExpenseModal');
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
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
    if (savedCategories) {
        try {
            categories = JSON.parse(savedCategories);
        } catch (e) {
            console.error('Error loading categories:', e);
            categories = [];
        }
    } else {
        // Set default categories if none exist
        categories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping'];
        // Save default categories to localStorage
        saveCategories();
    }
    updateCategoriesList();
    updateCategoryDropdown();
}

// Function to save categories to localStorage
function saveCategories() {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
    } catch (e) {
        console.error('Error saving categories:', e);
    }
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
    const categorySelect = document.getElementById('expenseCategory');
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add only active categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to validate date
function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Check if date is not in the future
    if (date > today) {
        return false;
    }
    
    // Check if year is reasonable (not before 1900 and not after current year)
    const year = date.getFullYear();
    const currentYear = today.getFullYear();
    if (year < 1900 || year > currentYear) {
        return false;
    }
    
    return true;
}

// Function to add a new expense
function addExpense(event) {
    event.preventDefault();
    
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const currency = document.getElementById('currencySelect').value;
    const editId = event.target.querySelector('button').dataset.editId;

    if (!amount || !category || !date || !currency) {
        alert('Please fill in all fields');
        return;
    }

    // Validate date
    if (!isValidDate(date)) {
        alert('Please enter a valid date (not in the future and not before 1900)');
        return;
    }

    const expense = {
        id: editId || Date.now().toString(),
        amount: parseFloat(amount),
        category,
        date,
        currency
    };
    
    if (editId) {
        const index = expenses.findIndex(e => e.id === editId);
        if (index !== -1) {
            expenses[index] = expense;
        }
        event.target.querySelector('button').textContent = 'Add Expense';
        delete event.target.querySelector('button').dataset.editId;
    } else {
        expenses.push(expense);
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
    event.target.reset();
    displayExpenses();
    updateDashboard();
    createExpenseChart();
}

// Function to clear the form
function clearForm() {
    document.getElementById('category').value = '';
    document.getElementById('amount').value = '';
}

// Function to delete an expense
function deleteExpense(id) {
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
        if (confirm('Are you sure you want to delete this expense?')) {
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            displayExpenses();
            updateDashboard();
            createExpenseChart();
        }
    }
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
            <td>${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${expense.currency || 'USD'}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense('${expense.id}')">Delete</button>
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
    // Calculate totals by currency
    const totalsByCurrency = expenses.reduce((acc, expense) => {
        const currency = expense.currency || 'USD';
        if (!acc[currency]) {
            acc[currency] = 0;
        }
        acc[currency] += expense.amount;
        return acc;
    }, {});

    // Display totals for each currency
    const totalExpensesElement = document.getElementById('totalExpenses');
    const totalsHtml = Object.entries(totalsByCurrency)
        .map(([currency, amount]) => 
            `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
        )
        .join('<br>');
    totalExpensesElement.innerHTML = totalsHtml || '0.00';

    // Calculate average daily expense for each currency
    const averagesByCurrency = Object.entries(totalsByCurrency).reduce((acc, [currency, total]) => {
        acc[currency] = total / 30; // Assuming 30 days per month
        return acc;
    }, {});

    // Display averages for each currency
    const averageExpenseElement = document.getElementById('averageExpense');
    const averagesHtml = Object.entries(averagesByCurrency)
        .map(([currency, amount]) => 
            `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}/day`
        )
        .join('<br>');
    averageExpenseElement.innerHTML = averagesHtml || '0.00';

    // Combine expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = {
                category: expense.category,
                amounts: {},
                isInactive: !categories.includes(expense.category)
            };
        }
        const currency = expense.currency || 'USD';
        if (!acc[expense.category].amounts[currency]) {
            acc[expense.category].amounts[currency] = 0;
        }
        acc[expense.category].amounts[currency] += expense.amount;
        return acc;
    }, {});

    // Format category totals for display
    const topExpenses = Object.values(expensesByCategory)
        .sort((a, b) => {
            // Sort by the sum of amounts in each currency
            const aTotal = Object.values(a.amounts).reduce((sum, amount) => sum + amount, 0);
            const bTotal = Object.values(b.amounts).reduce((sum, amount) => sum + amount, 0);
            return bTotal - aTotal;
        })
        .slice(0, 3);

    const topExpensesList = document.getElementById('topExpenses');
    topExpensesList.innerHTML = topExpenses.length > 0 
        ? topExpenses.map(expense => {
            const amountStrings = Object.entries(expense.amounts)
                .map(([currency, amount]) => 
                    `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
                )
                .join('<br>');
            return `<li>
                <strong>${expense.category}${expense.isInactive ? ' (inactive)' : ''}</strong>:<br>
                ${amountStrings}
            </li>`;
        }).join('')
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

// Add export functionality
function exportData() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    const data = {
        expenses: expenses,
        categories: categories,
        exportDate: new Date().toISOString(),
        summary: {
            totalExpenses: calculateTotalExpenses(),
            averageExpense: calculateAverageExpense(),
            categoryBreakdown: calculateCategoryTotals()
        }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Add expense editing functionality
function editExpense(id) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDate').value = expense.date;
    
    // Remove the old expense
    const updatedExpenses = expenses.filter(e => e.id !== id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    // Update the button to show we're in edit mode
    const addButton = document.querySelector('#expenseForm button');
    addButton.textContent = 'Update Expense';
    addButton.dataset.editId = id;
}

// Add date range filtering
function filterExpensesByDate(startDate, endDate) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
}

// Function to update edit category dropdown
function updateEditCategoryDropdown(selectedCategory) {
    const categorySelect = document.getElementById('editExpenseCategory');
    if (!categorySelect) return;

    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add all categories (both active and the selected one if it's inactive)
    const allCategories = [...new Set([...categories, selectedCategory])];
    
    allCategories.forEach(category => {
        if (category) { // Only add if category is not null/undefined
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    });

    // Set the selected category
    if (selectedCategory) {
        categorySelect.value = selectedCategory;
    }
}

// Function to open the edit modal
function openEditModal(id) {
    // Find the expense in our global expenses array
    const expense = expenses.find(e => e.id === id);
    if (!expense) {
        console.error('Expense not found');
        return;
    }

    // Update categories dropdown with the current expense category
    updateEditCategoryDropdown(expense.category);

    // Get all the form elements
    const amountInput = document.getElementById('editExpenseAmount');
    const dateInput = document.getElementById('editExpenseDate');
    const currencySelect = document.getElementById('editCurrencySelect');
    const idInput = document.getElementById('editExpenseId');

    // Set all form values to current expense state
    if (amountInput) amountInput.value = expense.amount;
    if (dateInput) dateInput.value = expense.date;
    if (currencySelect) currencySelect.value = expense.currency || 'USD';
    if (idInput) idInput.value = expense.id;

    // Show the modal
    const modal = document.getElementById('editExpenseModal');
    if (modal) {
        modal.style.display = 'block';
    }

    // Log the current state for debugging
    console.log('Opening edit modal for expense:', {
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        currency: expense.currency
    });
}

// Function to update an expense
function updateExpense(event) {
    event.preventDefault();
    
    // Get all form values
    const id = document.getElementById('editExpenseId').value;
    const amount = document.getElementById('editExpenseAmount').value;
    const category = document.getElementById('editExpenseCategory').value;
    const date = document.getElementById('editExpenseDate').value;
    const currency = document.getElementById('editCurrencySelect').value;

    if (!amount || !category || !date || !currency) {
        alert('Please fill in all fields');
        return;
    }

    // Validate date
    if (!isValidDate(date)) {
        alert('Please enter a valid date (not in the future and not before 1900)');
        return;
    }

    // Find the expense index
    const index = expenses.findIndex(e => e.id === id);
    
    if (index !== -1) {
        // Update the expense
        expenses[index] = {
            id,
            amount: parseFloat(amount),
            category,
            date,
            currency
        };
        
        // Save to localStorage
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Close modal and update display
        closeModal();
        displayExpenses();
        updateDashboard();
        createExpenseChart();
    }
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('editExpenseModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('editExpenseForm');
        if (form) {
            form.reset();
        }
    }
}

// Function to display expenses
function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    if (!expensesList) return;

    expensesList.innerHTML = '';
    
    // Get expenses from localStorage if the global array is empty
    if (expenses.length === 0) {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            expenses = JSON.parse(savedExpenses);
        }
    }

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${expense.currency}</td>
            <td>${expense.category}</td>
            <td>
                <button onclick="openEditModal('${expense.id}')" class="edit-btn">Edit</button>
                <button onclick="deleteExpense('${expense.id}')" class="delete-btn">Delete</button>
            </td>
        `;
        expensesList.appendChild(row);
    });

    // Update the dashboard and chart
    updateDashboard();
    createExpenseChart();
}

// Add chart visualization
function createExpenseChart() {
    const ctx = document.getElementById('expenseChart');
    if (!ctx) return;

    // Group expenses by category and currency
    const categoryTotals = expenses.reduce((acc, expense) => {
        const key = `${expense.category} (${expense.currency})`;
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += expense.amount;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Expenses by Category and Currency'
            }
        }
    });
}

// Initialize the improvements
function initializeImprovements() {
    // Add currency selector
    const currencySelector = document.createElement('select');
    currencySelector.id = 'currencySelector';
    Object.keys(exchangeRates).forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.text = currency;
        currencySelector.appendChild(option);
    });
    currencySelector.addEventListener('change', (e) => changeCurrency(e.target.value));
    document.querySelector('.container').insertBefore(currencySelector, document.querySelector('#expenseForm'));

    // Add date range filters
    const dateFilters = document.createElement('div');
    dateFilters.className = 'date-filters';
    dateFilters.innerHTML = `
        <input type="date" id="startDate" placeholder="Start Date">
        <input type="date" id="endDate" placeholder="End Date">
        <button onclick="displayExpenses()">Filter</button>
    `;
    document.querySelector('.container').insertBefore(dateFilters, document.querySelector('#expensesList'));

    // Add export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Data';
    exportButton.onclick = exportData;
    document.querySelector('.container').appendChild(exportButton);

    // Add chart canvas
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'expenseChart';
    document.querySelector('.container').appendChild(chartCanvas);

    // Add modal close button event listener
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('editExpenseModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Update result cards styling for multiple lines
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.style.minHeight = '120px';
        card.style.height = 'auto';
    });
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeImprovements();
    displayExpenses();
    updateDashboard();
    createExpenseChart();
}); 