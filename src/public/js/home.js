document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const modalTitle = document.querySelector('.modal-title');
    const studentTableBody = document.querySelector('tbody');

    // Handle modal show/hide
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        modalTitle.textContent = "Add New Student";
        form.reset(); // Clear the form
        form.dataset.mode = "create"; // Set form mode to 'create'
        form.dataset.studentId = ""; // Clear any existing student ID
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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Something went wrong.");
            }

            // After a successful operation, refresh the table and close the modal
            await refreshStudentTable();
            modal.style.display = 'none';
            alert(`Student ${mode === 'create' ? 'added' : 'updated'} successfully!`);

        } catch (error) {
            console.error('Operation failed:', error);
            alert(`Error: ${error.message}`);
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

                // Populate form fields with student data
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
                alert(`Error: ${error.message}`);
            }
        }

        // DELETE button logic
        if (e.target.classList.contains('btn-delete')) {
            if (confirm("Are you sure you want to delete this student?")) {
                try {
                    const response = await fetch(`/api/students/${studentId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || "Failed to delete student.");
                    }

                    await refreshStudentTable();
                    alert("Student deleted successfully!");

                } catch (error) {
                    console.error('Failed to delete student:', error);
                    alert(`Error: ${error.message}`);
                }
            }
        }
    });

    // Function to refresh the student table
    async function refreshStudentTable() {
        try {
            const response = await fetch('/api/students');
            if (!response.ok) {
                throw new Error("Failed to fetch students.");
            }
            const students = await response.json();

            // Clear existing table rows
            studentTableBody.innerHTML = '';

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
        } catch (error) {
            console.error('Error refreshing table:', error);
        }
    }
});