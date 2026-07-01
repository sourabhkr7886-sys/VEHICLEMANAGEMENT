from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.vehicle import Vehicle
from schemas.vehicle import VehicleResponse
from jwta.jwt import get_current_user

from datetime import datetime
import shutil
import os

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)

UPLOAD_FOLDER = "uploads/vehicles"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/")
async def create_vehicle(
    vehicle_name: str = Form(...),
    vehicle_model: str = Form(...),
    vehicle_year: int = Form(...),
    vehicle_type: str = Form(...),

    chassi_number: str = Form(...),
    registration_number: str = Form(...),

    vehicle_description: str = Form(""),

    status: str = Form("Active"),

    current_user = Depends(get_current_user),
    vehicle_photo: UploadFile = File(None),

    db: Session = Depends(get_db)
):

    photo_path = None

    if vehicle_photo:
        filename = f"{datetime.now().timestamp()}_{vehicle_photo.filename}"

        photo_path = f"{UPLOAD_FOLDER}/{filename}"

        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(vehicle_photo.file, buffer)

    vehicle = Vehicle(
        vehicle_name=vehicle_name,
        vehicle_model=vehicle_model,
        vehicle_year=vehicle_year,
        vehicle_type=vehicle_type,
        chassi_number=chassi_number,
        registration_number=registration_number,
        vehicle_description=vehicle_description,
        status=status,
        vehicle_photo=photo_path,
        created_by=current_user["email"],   # or username if included in JWT
        updated_by=current_user["email"],
        )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle created successfully",
        "id": vehicle.id
    }


@router.get("/", response_model=list[VehicleResponse])
def get_all_vehicles(
    db: Session = Depends(get_db)
):
    return db.query(Vehicle).all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return vehicle


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle_name: str = Form(...),
    vehicle_model: str = Form(...),
    vehicle_year: int = Form(...),
    vehicle_type: str = Form(...),

    chassi_number: str = Form(...),
    registration_number: str = Form(...),

    vehicle_description: str = Form(""),

    status: str = Form("Active"),

    updated_by: str = Form("Admin"),

    db: Session = Depends(get_db)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    vehicle.vehicle_name = vehicle_name
    vehicle.vehicle_model = vehicle_model
    vehicle.vehicle_year = vehicle_year
    vehicle.vehicle_type = vehicle_type
    vehicle.chassi_number = chassi_number
    vehicle.registration_number = registration_number
    vehicle.vehicle_description = vehicle_description
    vehicle.status = status

    vehicle.updated_by = updated_by
    vehicle.updated_on = datetime.utcnow()

    db.commit()

    return {"message": "Vehicle updated successfully"}


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}