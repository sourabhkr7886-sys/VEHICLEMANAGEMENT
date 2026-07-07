from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from jwta.jwt import admin_only, manager_only, driver_only
from models.user import User
from models.vehicle import Vehicle

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ADMIN DASHBOARD

@router.get("/admin")
def admin_dashboard(
    current_user=Depends(admin_only),
    db: Session = Depends(get_db)
):
    admin_id = current_user["user_id"]

    total_vehicles = db.query(Vehicle).count()

    total_drivers = db.query(User).filter(
        User.role == "driver"
    ).count()

    total_managers = db.query(User).filter(
        User.role == "manager"
    ).count()

    vehicles_added_by_admin = db.query(Vehicle).filter(
        Vehicle.created_by == current_user["email"]
    ).count()

    drivers_added_by_admin = db.query(User).filter(
        User.role == "driver",
        User.created_by == str(admin_id)
    ).count()

    unassigned_vehicles = db.query(Vehicle).filter(
        Vehicle.driver_id.is_(None)
    ).count()

    assigned_driver_ids = db.query(Vehicle.driver_id).filter(
        Vehicle.driver_id.isnot(None)
    )

    unassigned_drivers = db.query(User).filter(
        User.role == "driver",
        ~User.id.in_(assigned_driver_ids)
    ).count()

    invited_managers = db.query(User).filter(
        User.role == "manager",
        User.joined_on == None
    ).count()

    return {
        "total_vehicles": total_vehicles,
        "total_drivers": total_drivers,
        "total_managers": total_managers,
        "vehicles_added_by_admin": vehicles_added_by_admin,
        "drivers_added_by_admin": drivers_added_by_admin,
        "unassigned_vehicles": unassigned_vehicles,
        "unassigned_drivers": unassigned_drivers,
        "invited_managers": invited_managers
    }


# MANAGER DASHBOARD

@router.get("/manager")
def manager_dashboard(
    current_user=Depends(manager_only),
    db: Session = Depends(get_db)
):
    manager_id = current_user["user_id"]

    total_vehicles = db.query(Vehicle).count()

    total_drivers = db.query(User).filter(
        User.role == "driver"
    ).count()

    vehicles_added_by_manager = db.query(Vehicle).filter(
        Vehicle.created_by == current_user["email"]
    ).count()

    drivers_added_by_manager = db.query(User).filter(
        User.role == "driver",
        User.created_by == str(manager_id)
    ).count()

    unassigned_vehicles = db.query(Vehicle).filter(
        Vehicle.driver_id.is_(None)
    ).count()

    assigned_driver_ids = db.query(Vehicle.driver_id).filter(
        Vehicle.driver_id.isnot(None)
    )

    unassigned_drivers = db.query(User).filter(
        User.role == "driver",
        ~User.id.in_(assigned_driver_ids)
    ).count()

    return {
        "total_vehicles": total_vehicles,
        "total_drivers": total_drivers,
        "vehicles_added_by_manager": vehicles_added_by_manager,
        "drivers_added_by_manager": drivers_added_by_manager,
        "unassigned_vehicles": unassigned_vehicles,
        "unassigned_drivers": unassigned_drivers
    }


# DRIVER DASHBOARD

@router.get("/driver")
def driver_dashboard(
    current_user=Depends(driver_only),
    db: Session = Depends(get_db)
):
    driver = db.query(User).filter(
        User.email == current_user["email"],
        User.role == "driver"
    ).first()

    if not driver:
        return {
            "message": "Driver not found"
        }

    vehicle = db.query(Vehicle).filter(
        Vehicle.driver_id == driver.id
    ).first()

    return {
        "message": "Welcome Driver",

        "id": driver.id,
        "username": driver.username,
        "first_name": driver.first_name,
        "last_name": driver.last_name,
        "email": driver.email,
        "role": driver.role,

        "active": driver.active,
        "dob": driver.dob,

        "profile_image": driver.profile_image,

        "driving_license": driver.driving_license,
        "license_expiry_date": driver.license_expiry_date,

        "driver_address": driver.driver_address,
        "experience_years": driver.experience_years,

        "vehicle_name": (
            vehicle.vehicle_name if vehicle else None
        ),

        "registration_number": (
            vehicle.registration_number if vehicle else None
        ),

        "vehicle_model": (
            vehicle.vehicle_model if vehicle else None
        ),

        "vehicle_type": (
            vehicle.vehicle_type if vehicle else None
        ),

        "assigned_vehicle_name": (
            f"{vehicle.vehicle_name} ({vehicle.registration_number})"
            if vehicle else "No Vehicle Assigned"
        ),

        "joined_on": driver.joined_on,
        "created_at": driver.created_at,
        "updated_at": driver.updated_at
    }
