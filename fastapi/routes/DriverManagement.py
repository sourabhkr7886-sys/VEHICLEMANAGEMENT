from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.vehicle import Vehicle

router = APIRouter(tags=["Driver Management"])


@router.get("/user/drivers")
def get_drivers(db: Session = Depends(get_db)):

    drivers = db.query(User).filter(
        User.role == "driver"
    ).all()

    result = []

    for driver in drivers:

        vehicle = None

       
        if hasattr(driver, "vehicle_assigned") and driver.vehicle_assigned:
            vehicle = db.query(Vehicle).filter(
                Vehicle.id == driver.vehicle_assigned
            ).first()
 
        # Fallback: check vehicle.driver_id
        if not vehicle:
            vehicle = db.query(Vehicle).filter(
                Vehicle.driver_id == driver.id
            ).first()

        result.append({
            "id": driver.id,

            "username": driver.username,
            "first_name": getattr(driver, "first_name", None),
            "last_name": getattr(driver, "last_name", None),
            "email": driver.email,
            "dob": getattr(driver, "dob", None),

            "role": driver.role,
            "active": getattr(driver, "active", True),

            "profile_image": getattr(
                driver,
                "profile_image",
                None
            ),

            "driving_license": getattr(
                driver,
                "driving_license",
                None
            ),

            "license_expiry_date": getattr(
                driver,
                "license_expiry_date",
                None
            ),

  
            "driver_address": getattr(
                driver,
                "driver_address",
                None
            ),

            "experience_years": getattr(
                driver,
                "experience_years",
                None
            ),

  
            "vehicle_assigned": getattr(
                driver,
                "vehicle_assigned",
                None
            ),
            
            "vehicle_name": (
                vehicle.vehicle_name
                if vehicle
                else None
            ),
            
            "registration_number": (
                vehicle.registration_number
                if vehicle
                else None
            ),
            "created_at": getattr(
                driver,
                "created_at",
                None
            ),

            "created_by": getattr(
                driver,
                "created_by",
                None
            ),

            "updated_at": getattr(
                driver,
                "updated_at",
                None
            ),

            "updated_by": getattr(
                driver,
                "updated_by",
                None
            ),

            "joined_on": getattr(
                driver,
                "joined_on",
                None
            )
        })

    return result


@router.get("/user/drivers/{user_id}")
def get_driver(
    user_id: int,
    db: Session = Depends(get_db)
):

    driver = db.query(User).filter(
        User.id == user_id,
        User.role == "driver"
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    vehicle = db.query(Vehicle).filter(
        Vehicle.driver_id == driver.id
    ).first()

    return {
        "id": driver.id,
        "username": driver.username,
        "first_name": getattr(driver, "first_name", None),
        "last_name": getattr(driver, "last_name", None),
        "email": driver.email,
        "dob": getattr(driver, "dob", None),
        "role": driver.role,
        "active": getattr(driver, "active", True),

        "profile_image": getattr(
            driver,
            "profile_image",
            None
        ),

        "driving_license": getattr(
            driver,
            "driving_license",
            None
        ),

        "license_expiry_date": getattr(
            driver,
            "license_expiry_date",
            None
        ),

        "driver_address": getattr(
            driver,
            "driver_address",
            None
        ),

        "experience_years": getattr(
            driver,
            "experience_years",
            None
        ),

        "assigned_vehicle_name": (
            f"{vehicle.vehicle_name} ({vehicle.registration_number})"
            if vehicle
            else "Not Assigned"
        ),

        "created_at": getattr(
            driver,
            "created_at",
            None
        ),

        "created_by": getattr(
            driver,
            "created_by",
            None
        ),

        "updated_at": getattr(
            driver,
            "updated_at",
            None
        ),

        "updated_by": getattr(
            driver,
            "updated_by",
            None
        ),

        "joined_on": getattr(
            driver,
            "joined_on",
            None
        )
    }

@router.put("/user/drivers/{user_id}")
def update_driver(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    driver = db.query(User).filter(
        User.id == user_id,
        User.role == "driver"
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.username = data.get(
        "username",
        driver.username
    )

    driver.first_name = data.get(
        "first_name",
        getattr(driver, "first_name", None)
    )

    driver.last_name = data.get(
        "last_name",
        getattr(driver, "last_name", None)
    )

    driver.email = data.get(
        "email",
        driver.email
    )

    driver.dob = data.get(
        "dob",
        getattr(driver, "dob", None)
    )

    driver.driver_address = data.get(
        "driver_address",
        getattr(driver, "driver_address", None)
    )

    driver.experience_years = data.get(
        "experience_years",
        getattr(driver, "experience_years", None)
    )

    driver.license_expiry_date = data.get(
        "license_expiry_date",
        getattr(driver, "license_expiry_date", None)
    )

    db.commit()
    db.refresh(driver)

    return {
        "message": "Driver updated successfully"
    }

@router.delete("/user/drivers/{user_id}")
def delete_driver(
    user_id: int,
    db: Session = Depends(get_db)
):

    driver = db.query(User).filter(
        User.id == user_id,
        User.role == "driver"
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

  
    vehicle = db.query(Vehicle).filter(
        Vehicle.driver_id == driver.id
    ).first()

    if vehicle:
        vehicle.driver_id = None

    if hasattr(driver, "vehicle_assigned"):
        driver.vehicle_assigned = None

    db.commit()

    db.delete(driver)
    db.commit()

    return {
        "message": "Driver deleted successfully"
    }


@router.post("/assign-vehicle")
def assign_vehicle(
    data: dict,
    db: Session = Depends(get_db)
):

    driver_id = data.get("driver_id")
    vehicle_id = data.get("vehicle_id")

    driver = db.query(User).filter(
        User.id == driver_id,
        User.role == "driver"
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    old_vehicle = db.query(Vehicle).filter(
        Vehicle.driver_id == driver.id
    ).first()

    if old_vehicle and old_vehicle.id != vehicle.id:
        old_vehicle.driver_id = None

  
    if vehicle.driver_id and vehicle.driver_id != driver.id:

        old_driver = db.query(User).filter(
            User.id == vehicle.driver_id
        ).first()

        if old_driver:
            old_driver.vehicle_assigned = None


    vehicle.driver_id = driver.id
    driver.vehicle_assigned = vehicle.id

    db.commit()
    db.refresh(driver)
    db.refresh(vehicle)

    return {
        "message": "Vehicle assigned successfully",
        "driver_id": driver.id,
        "driver_name": f"{driver.first_name} {driver.last_name}",
        "vehicle_id": vehicle.id,
        "vehicle_name": vehicle.vehicle_name,
        "registration_number": vehicle.registration_number
    }
@router.put("/user/status/{user_id}")
def change_driver_status(
    user_id: int,
    db: Session = Depends(get_db)
):

    driver = db.query(User).filter(
        User.id == user_id,
        User.role == "driver"
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.active = not driver.active

    db.commit()

    return {
        "message": f"Driver {'Activated' if driver.active else 'Deactivated'} Successfully",
        "active": driver.active
    }