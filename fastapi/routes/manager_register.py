from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from jwta.jwt import hash_password
from schemas.user import AddManager

router = APIRouter(
    prefix="/user",
    tags=["Manager Registration"]
)


@router.post("/add-manager")
def add_manager(
    data: AddManager,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    manager = User(
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hash_password(data.password),
        role="manager",
        active=True,
        created_by="admin"
    )

    db.add(manager)
    db.commit()
    db.refresh(manager)

    return {
        "message": "Manager created successfully",
        "manager_id": manager.id,
        "username": manager.username,
        "email": manager.email,
        "role": manager.role
    }