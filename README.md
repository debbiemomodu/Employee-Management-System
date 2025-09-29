Employee Management Platform

A responsive, user-friendly employee management platform with separate access for admins and staff. Admins manage staff records from the dashboard, while staff log in directly to their profile page to view and manage their information.

Features

Dual Login System

Admin Login: Access to Dashboard for staff management (CRUD).

Staff Login: Direct access to their profile page (no dashboard access).

Admin Account Management (CRUD)

Create (Add): Add new employees with auto-generated email & password.

Read: View all staff records.

Update: Edit staff details (e.g., name, department).

Delete: Remove employees from the system.

Staff Profile Access

Secure login using credentials created by admin.

View personal information (name, department, contact details).

Reset password remotely anytime.

UI & UX

Modern responsive design.

Intuitive separation between Admin and Staff flows.

Mobile-friendly interface. Tech Stack

Frontend: HTML5, CSS3, Bootstrap

Icons: Bootstrap Icons

JavaScript: Vanilla JS (Fetch API for endpoint calls)

Authentication: Client-side session handling

Scenario: Abstract Company uses the Employee Management Platform to streamline staff data management, give employees secure access to their information and also give them a unique ID.

Actors:

Admin: HR Manager (Deborah)

Staff: Employee (Onyeka)

Precondition:

The platform is already deployed and accessible in the company network.

Admin has access to the admin login page.

Flow:

Admin Adds a New Employee

Deborah logs in to the Admin Dashboard via admin-login.html.

She navigates to the "Add Employee" section and enters Onyeka’s details (name, department, email, phone).

The system automatically generates a login email and password for John.

Onyeka’s record is now stored in the employee database.

Employee Logs in to Profile

Onyeka receives his login credentials from HR (Deborah).

He visits staff-login.html and enters his email and password.

The system authenticates him and redirects him to his Profile Page.

Employee Views Personal Info

On the profile page, John can view his personal details (name, department, contact info).

He confirms that all information is correct.

Employee Resets Password (Optional)

If John wants to change his password, he clicks Reset Password.

The system prompts him to enter a new password and updates his record securely.

Admin Updates Employee Info (Optional)

Later, if Onyeka moves to a different department, Deborah logs in to the dashboard and updates his department field.

Onyeka will see the updated information next time he logs in.

Postcondition:

Employee data is up to date.

Onyeka can log in anytime to see his details or reset his password.

Deborah can manage all staff records from a single dashboard