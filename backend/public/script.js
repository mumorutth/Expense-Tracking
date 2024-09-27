document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Retrieve values from the form
    const expenseName = document.getElementById('expense-name').value;
    const category = document.getElementById('category').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const amount = document.getElementById('amount').value;
    const date = new Date().toLocaleDateString(); // Get the current date

    // Incremental ID based on number of rows
    const tableBody = document.getElementById('expenses-table-body');
    const expenseID = tableBody.rows.length + 1;

    // Create a new row and insert into the table body
    const newRow = tableBody.insertRow();
    
    // Insert cells into the row
    newRow.innerHTML = `
        <td>${expenseID}</td>
        <td>${expenseName}</td>
        <td>${category}</td>
        <td>${paymentMethod}</td>
        <td>$${amount}</td>
        <td>${date}</td>
        <td>
            <button class="btn btn-info btn-sm edit-btn">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;

    // Clear form inputs after submission
    document.getElementById('expense-form').reset();

    // Add delete functionality to the newly created row
    newRow.querySelector('.delete-btn').addEventListener('click', function() {
        tableBody.removeChild(newRow);
    });

    // You can add edit functionality here as well
    newRow.querySelector('.edit-btn').addEventListener('click', function() {
        // Handle editing of the expense
        document.getElementById('expense-name').value = expenseName;
        document.getElementById('category').value = category;
        document.getElementById('payment-method').value = paymentMethod;
        document.getElementById('amount').value = amount;
        // Optionally, remove the row for an update
        tableBody.removeChild(newRow);
    });
});
