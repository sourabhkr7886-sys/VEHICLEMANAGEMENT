🚗 Vehicle Management System
A full-stack Vehicle Management System built with FastAPI, React (Vite), and PostgreSQL. The application enables administrators and managers to manage vehicles, drivers, and user accounts with secure JWT authentication.
________________________________________
📌 Features
Authentication
•	JWT-based authentication
•	Role-based access control
•	Secure password hashing
•	Forgot Password
•	Reset Password
User Management
•	Admin, Manager, and Driver roles
•	Register new managers and drivers
•	Activate/Deactivate users
•	Delete users
•	Update user profiles
•	Upload profile images
Vehicle Management
•	Add vehicles
•	Update vehicle details
•	Delete vehicles
•	Upload vehicle photos
•	Search vehicles
•	Assign drivers to vehicles
•	View all vehicles
Driver Management
•	Add drivers
•	Update driver information
•	Delete drivers
•	Assign vehicles
•	Search drivers
•	Activate/Deactivate drivers
Dashboard
•	Responsive dashboard
•	Sidebar navigation
•	Dark-themed UI
•	Search and filter functionality
________________________________________
🛠️ Technology Stack
Frontend
•	React
•	Vite
•	Axios
•	React Router
•	CSS
Backend
•	FastAPI
•	SQLAlchemy
•	Pydantic
•	JWT Authentication
•	Passlib (bcrypt)
Database
•	PostgreSQL
________________________________________
📁 Project Structure
vehicle-management/
│
├── fastapi/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── jwta/
│  
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
________________________________________
⚙️ Installation
1. Clone the repository
git clone https://github.com/your-username/vehicle-management.git
cd vehicle-management
________________________________________
2. Backend Setup
cd fastapi
python -m venv .venv
Windows
.venv\Scripts\activate
Install dependencies
pip install -r requirements.txt
________________________________________
3. Configure Environment Variables
Create a .env file inside the fastapi folder.
Example:
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_management

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
________________________________________
4. Run Backend
uvicorn main:app --reload
Backend runs on:
http://127.0.0.1:8000
Swagger Documentation:
http://127.0.0.1:8000/docs
________________________________________
5. Frontend Setup
Open a new terminal.
cd frontend
npm install
Run:
npm run dev
Frontend runs on:
http://localhost:5173
________________________________________
🔐 User Roles
•	Admin
•	Manager
•	Driver
________________________________________
📸 Main Modules
•	Authentication
•	Vehicle Management
•	Driver Management
•	Manager Management
•	User Profile
•	Dashboard
________________________________________
🗄️ Database
Database used:
•	PostgreSQL
ORM:
•	SQLAlchemy
________________________________________
📡 API Documentation
FastAPI automatically generates API documentation.
Swagger UI:
http://127.0.0.1:8000/docs
ReDoc:
http://127.0.0.1:8000/redoc
________________________________________
🚀 Future Improvements
•	Email-based password reset
•	Vehicle service history
•	Fuel management
•	Maintenance scheduling
•	GPS tracking integration
•	Reports and analytics
•	Notifications
•	File storage using cloud services
•	Docker support
•	CI/CD pipeline
________________________________________
👨💻 Author
Sourabh Kumar
GitHub: https://github.com/sourabhkr7886-sys

