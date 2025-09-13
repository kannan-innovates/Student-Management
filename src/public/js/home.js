document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.querySelector('.modal-title');
    const studentTableBody = document.querySelector('tbody');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-container .btn');
    const paginationContainer = document.querySelector('.pagination');
    const form = document.getElementById('studentForm');

    // Helper function to clear all previous error messages
    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-input').forEach(el => el.classList.remove('is-invalid'));
    }

    // Helper function to display errors from the server
    function displayFormErrors(errors) {
        for (const field in errors) {
            const errorElement = document.getElementById(`${field}-error`);
            const inputElement = document.querySelector(`[name="${field}"]`);
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
            if (inputElement) {
                inputElement.classList.add('is-invalid');
            }
        }
    }

    let currentPage = 1;
    let currentSearchQuery = '';
    const studentsPerPage = 5;

    // Handle modal show/hide
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        modalTitle.textContent = "Add New Student";
        form.reset();
        form.dataset.mode = "create";
        form.dataset.studentId = "";
        modal.style.display = 'block';
    });

    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission (Create & Update)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFormErrors(); // Clear previous errors on new submission

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const studentId = form.dataset.studentId;
        const mode = form.dataset.mode;

        try {
            let response;
            if (mode === "create") {
                response = await fetch('/api/students', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else if (mode === "update") {
                response = await fetch(`/api/students/${studentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }

            const responseData = await response.json();

            // NEW: Check for validation errors (status 422)
            if (response.status === 422) {
                displayFormErrors(responseData.errors);
                return; // Stop execution
            }

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            }

            await refreshStudentTable();
            modal.style.display = 'none';

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Student ${mode === 'create' ? 'added' : 'updated'} successfully!`,
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Operation failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: error.message,
            });
        }
    });


    // Handle Edit and Delete button clicks (Event delegation)
    studentTableBody.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        const studentId = row.dataset.id;

        // EDIT button logic
        if (e.target.classList.contains('btn-edit')) {
            modalTitle.textContent = "Edit Student";
            form.dataset.mode = "update";
            form.dataset.studentId = studentId;

            try {
                const response = await fetch(`/api/students/${studentId}`);
                if (!response.ok) {
                    throw new Error("Student not found.");
                }
                const student = await response.json();

                document.getElementById('student_Id_input').value = student.studentId;
                document.getElementById('firstName_input').value = student.firstName;
                document.getElementById('lastName_input').value = student.lastName;
                document.getElementById('email_input').value = student.email;
                document.getElementById('phone_input').value = student.phone;
                document.getElementById('course_input').value = student.course;
                document.getElementById('year_input').value = student.year;

                modal.style.display = 'block';

            } catch (error) {
                console.error('Failed to fetch student for edit:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        }

        // DELETE button logic
        if (e.target.classList.contains('btn-edit')) {
            // ... (keep existing edit logic)
            try {
                // ... (fetch logic for editing)
            } catch (error) {
                console.error('Failed to fetch student for edit:', error);
                // ✨ CHANGED: Replaced alert() with Swal.fire() for errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message,
                });
            }
        }

        // DELETE button logic
        if (e.target.classList.contains('btn-delete')) {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`/api/students/${studentId}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || "Failed to delete student.");
                        }

                        await refreshStudentTable();

                        Swal.fire(
                            'Deleted!',
                            'The student has been deleted.',
                            'success'
                        );

                    } catch (error) {
                        console.error('Failed to delete student:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Deletion Failed',
                            text: error.message,
                        });
                    }
                }
            });
        }
    });

    // SEARCH FUNCTIONALITY
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        currentSearchQuery = query;
        currentPage = 1;
        refreshStudentTable(currentPage, currentSearchQuery);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });

    // Clear search functionality
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        searchInput.value = '';
        refreshStudentTable();
    });

    // Handle pagination button clicks
    paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn') && !e.target.classList.contains('active')) {
            const newPage = parseInt(e.target.dataset.page);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                refreshStudentTable(currentPage, currentSearchQuery);
            }
        }
    });
    // Function to refresh the student table
    async function refreshStudentTable(page = 1, query = '') {
        try {
            const url = query
                ? `/api/students/search?q=${encodeURIComponent(query)}&page=${page}&limit=${studentsPerPage}`
                : `/api/students?page=${page}&limit=${studentsPerPage}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch students.");
            }
            const data = await response.json();
            const { students, totalPages } = data;

            // Clear existing table rows
            studentTableBody.innerHTML = '';

            if (students.length === 0) {
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = `<td colspan="8" style="text-align:center;">No students found.</td>`;
                studentTableBody.appendChild(noDataRow);
            } else {
                // Populate the table with new data
                students.forEach(student => {
                    const row = document.createElement('tr');
                    row.dataset.id = student._id;
                    row.innerHTML = `
                    <td>${student.studentId}</td>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.course}</td>
                    <td>${student.year}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-edit">Edit</button>
                            <button class="btn btn-small btn-delete">Delete</button>
                        </div>
                    </td>
                `;
                    studentTableBody.appendChild(row);
                });
            }

            renderPagination(totalPages, page);

        } catch (error) {
            console.error('Error refreshing table:', error);
        }
    }

    function renderPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createButton = (text, page) => {
            const button = document.createElement('button');
            button.className = 'page-btn';
            button.textContent = text;
            button.dataset.page = page;
            if (page === currentPage) {
                button.classList.add('active');
            }
            return button;
        };

        if (currentPage > 1) {
            paginationContainer.appendChild(createButton('Previous', currentPage - 1));
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.appendChild(createButton(i, i));
        }

        if (currentPage < totalPages) {
            paginationContainer.appendChild(createButton('Next', currentPage + 1));
        }
    }

    // Initial load
    refreshStudentTable(currentPage, currentSearchQuery);

});