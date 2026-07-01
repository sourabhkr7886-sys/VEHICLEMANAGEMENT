from fastapi import (APIRouter,Depends,HTTPException,UploadFile,File,Form)
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.vehicle import Vehicle

from datetime import datetime
import shutil
import os

router = APIRouter(
    prefix="/DriverProfile",
    tags=["Driver Profile"]
)


PROFILE_FOLDER = "uploads/profile"
LICENSE_FOLDER = "uploads/licenses"

os.makedirs(PROFILE_FOLDER, exist_ok=True)
os.makedirs(LICENSE_FOLDER, exist_ok=True)



@router.get("/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    assigned_vehicle_name = "Not Assigned Yet"

    if user.vehicle_assigned:
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == user.vehicle_assigned
        ).first()

        if vehicle:
            assigned_vehicle_name = (
                f"{vehicle.vehicle_name} "
                f"({vehicle.registration_number})"
            )

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "dob": user.dob,
        "role": user.role,
        "active": user.active,

        "driving_license": user.driving_license,
        "license_expiry_date": user.license_expiry_date,

        "driver_address": user.driver_address,
        "experience_years": user.experience_years,

        "created_at": user.created_at,
        "created_by": user.created_by,
        "updated_at": user.updated_at,
        "updated_by": user.updated_by,
        "joined_on": user.joined_on,

        "profile_image": user.profile_image,

        "vehicle_assigned": user.vehicle_assigned,
        "assigned_vehicle_name": assigned_vehicle_name
    }


# UPDATE DRIVER PROFILE


@router.put("/{user_id}")
async def update_profile(
    user_id: int,

    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),

    dob: str = Form(None),
    role: str = Form(None),

    license_expiry_date: str = Form(None),

    driver_address: str = Form(None),
    experience_years: int = Form(None),

    driving_license: UploadFile = File(None),

    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.first_name = first_name
    user.last_name = last_name
    user.email = email

    if role:
        user.role = role

    if dob:
        user.dob = dob

    if license_expiry_date:
        user.license_expiry_date = license_expiry_date

    user.driver_address = driver_address
    user.experience_years = experience_years

    if driving_license:

        allowed_types = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ]

        if driving_license.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and Image files allowed"
            )

        filename = (
            f"{datetime.now().timestamp()}_"
            f"{driving_license.filename}"
        )

        filepath = f"{LICENSE_FOLDER}/{filename}"

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(
                driving_license.file,
                buffer
            )

        user.driving_license = filepath

    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return {
        "message": "Driver Profile Updated Successfully",
        "user_id": user.id
    }


# PROFILE IMAGE UPLOAD

@router.post("/upload-image/{user_id}")
async def upload_profile_image(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files allowed"
        )

    filename = (
        f"{datetime.now().timestamp()}_"
        f"{file.filename}"
    )

    filepath = f"{PROFILE_FOLDER}/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    user.profile_image = filepath
    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile Image Uploaded Successfully",
        "image_path": filepath
    }

# GET DRIVER LICENSE

@router.get("/license/{user_id}")
def get_driver_license(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "driving_license": user.driving_license
    }


# DELETE DRIVER LICENSE

@router.delete("/license/{user_id}")
def delete_driver_license(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.driving_license:

        if os.path.exists(user.driving_license):
            os.remove(user.driving_license)

        user.driving_license = None

        db.commit()

    return {
        "message": "Driving License Deleted Successfully"
    }