from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserProfile, UpdateProfile
import shutil
import os

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/{user_id}", response_model=UserProfile)
def get_profile(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.put("/{user_id}")
def update_profile(
    user_id: int,
    data: UpdateProfile,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.first_name = data.first_name
    user.last_name = data.last_name
    user.email = data.email
    user.dob = data.dob

    db.commit()

    return {"message": "Profile updated successfully"}


@router.post("/upload-image/{user_id}")
def upload_profile_image(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    user.profile_image = file_path

    db.commit()

    return {
        "message": "Image uploaded successfully",
        "image_url": file_path
    }