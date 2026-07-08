from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine

from routes.register import router as register_router
from routes.login import router as login_router
from routes.vehicle import router as vehicle_router
from routes.dashboard import router as dashboard_router
from routes.profile import router as profile_router
from routes.DriverProfile import router as DriverProfile_router
from routes.manager_register import router as manager_register_router
from routes.add_driver import router as add_driver_router


from routes.DriverManagement import router as DriverManagement_router
from routes.ManagerDetails import router as ManagerDetails_router
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vehicle Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "https://vehiclemanagement-2.onrender.com",
        "https://vehiclemanagement-okah-git-master-sourabhkr7886-sys-projects.vercel.app",
        "https://vehiclemanagement-okah-gt9olcrwr-sourabhkr7886-sys-projects.vercel.app",
        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
os.makedirs("uploads", exist_ok=True)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
# Routers
app.include_router(register_router)
app.include_router(login_router)
app.include_router(vehicle_router)
app.include_router(add_driver_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(manager_register_router)
app.include_router(DriverProfile_router)
app.include_router(DriverManagement_router)
app.include_router(ManagerDetails_router)
@app.get("/")
def home():
    return {"message": "Vehicle Management API Running"}
