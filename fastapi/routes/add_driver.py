from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import AddDriver
from jwta.jwt import hash_password, get_current_user

router = APIRouter(
    prefix="/user",
    tags=["Driver Registration"]
)


@router.post("/add-driver")
def add_driver(
    data: AddDriver,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    driver = User(
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hash_password(data.password),
        role="driver",
        active=True,
        created_by=str(current_user["user_id"])  
    )

    db.add(driver)
    db.commit()
    db.refresh(driver)
    return {
        "message": "Driver created successfully",
        "driver_id": driver.id,
        "username": driver.username,
        "email": driver.email,
        "role": driver.role
    }