from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from jwta.jwt import admin_only, manager_only, driver_only
from database import get_db
from models.user import User
from models.vehicle import Vehicle

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


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
        Vehicle.driver_id == None
    ).count()

    unassigned_drivers = db.query(User).filter(
        User.role == "driver",
        User.vehicle_assigned == None
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
        Vehicle.driver_id == None
    ).count()

    unassigned_drivers = db.query(User).filter(
        User.role == "driver",
        User.vehicle_assigned == None
    ).count()

    return {
        "total_vehicles": total_vehicles,
        "total_drivers": total_drivers,
        "vehicles_added_by_manager": vehicles_added_by_manager,
        "drivers_added_by_manager": drivers_added_by_manager,
        "unassigned_vehicles": unassigned_vehicles,
        "unassigned_drivers": unassigned_drivers
    }
@router.get("/driver")
def driver_dashboard(
    user=Depends(driver_only),
    db: Session = Depends(get_db)
):
    driver = db.query(User).filter(
        User.email == user.get("email"),
        User.role == "driver"
    ).first()

    if not driver:
        return {
            "message": "Driver not found"
        }

    vehicle = None

    if hasattr(driver, "vehicle_assigned") and driver.vehicle_assigned:
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == driver.vehicle_assigned
        ).first()

    if not vehicle:
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

        "vehicle_assigned": driver.vehicle_assigned,

        "vehicle_name": (
            vehicle.vehicle_name
            if vehicle else None
        ),

        "registration_number": (
            vehicle.registration_number
            if vehicle else None
        ),

        "assigned_vehicle_name": (
            f"{vehicle.vehicle_name} ({vehicle.registration_number})"
            if vehicle else "No Vehicle Assigned"
        ),

        "joined_on": driver.joined_on,
        "created_at": driver.created_at,
        "updated_at": driver.updated_at
    }