from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import UserCreate
from jwta.jwt import hash_password, create_access_token

router = APIRouter(
    prefix="/register",
    tags=["Register"]
)


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        for user in users
    ]


@router.post("/")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(
        {
            "sub": new_user.email,
            "role": new_user.role,
            "user_id": new_user.id
        }
    )

    return {
        "message": "User registered successfully",
        "token": token,
        "role": new_user.role
    }