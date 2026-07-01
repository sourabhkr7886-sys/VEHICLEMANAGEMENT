from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User

router = APIRouter(tags=["Manager Management"])


@router.get("/user/managers")
def get_managers(db: Session = Depends(get_db)):

    managers = db.query(User).filter(
        User.role == "manager"
    ).all()

    result = []

    for manager in managers:

        result.append({
            "id": manager.id,
            "username": manager.username,
            "first_name": getattr(manager, "first_name", None),
            "last_name": getattr(manager, "last_name", None),
            "email": manager.email,
            "dob": getattr(manager, "dob", None),
            "role": manager.role,
            "active": getattr(manager, "active", True),

        
            "profile_image": getattr(manager,"profile_image",None),

            "created_at": getattr(
                manager,
                "created_at",
                None
            ),

            "created_by": getattr(
                manager,
                "created_by",
                None
            ),

            "updated_at": getattr(
                manager,
                "updated_at",
                None
            ),

            "updated_by": getattr(
                manager,
                "updated_by",
                None
            ),

            "joined_on": getattr(
                manager,
                "joined_on",
                None
            )
        })

    return result


@router.get("/user/managers/{manager_id}")
def get_manager(
    manager_id: int,
    db: Session = Depends(get_db)
):

    manager = db.query(User).filter(
        User.id == manager_id,
        User.role == "manager"
    ).first()

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found"
        )

    return {
        "id": manager.id,

        "username": manager.username,
        "first_name": getattr(manager, "first_name", None),
        "last_name": getattr(manager, "last_name", None),

        "email": manager.email,

        "dob": getattr(
            manager,
            "dob",
            None
        ),

        "role": manager.role,

        "active": getattr(
            manager,
            "active",
            True
        ),

        "profile_image": getattr(
            manager,
            "profile_image",
            None
        ),

        "created_at": getattr(
            manager,
            "created_at",
            None
        ),

        "created_by": getattr(
            manager,
            "created_by",
            None
        ),

        "updated_at": getattr(
            manager,
            "updated_at",
            None
        ),

        "updated_by": getattr(
            manager,
            "updated_by",
            None
        ),

        "joined_on": getattr(
            manager,
            "joined_on",
            None
        )
    }


@router.put("/user/managers/{manager_id}")
def update_manager(
    manager_id: int,
    data: dict,
    db: Session = Depends(get_db)
):

    manager = db.query(User).filter(
        User.id == manager_id,
        User.role == "manager"
    ).first()

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found"
        )

    manager.username = data.get(
        "username",
        manager.username
    )

    manager.first_name = data.get(
        "first_name",
        manager.first_name
    )

    manager.last_name = data.get(
        "last_name",
        manager.last_name
    )

    manager.email = data.get(
        "email",
        manager.email
    )

    manager.dob = data.get(
        "dob",
        manager.dob
    )

    manager.active = data.get(
        "active",
        manager.active
    )

    manager.profile_image = data.get(
        "profile_image",
        manager.profile_image
    )

    manager.updated_by = data.get(
        "updated_by",
        manager.updated_by
    )

    db.commit()
    db.refresh(manager)

    return {
        "message": "Manager updated successfully"
    }


@router.delete("/user/managers/{manager_id}")
def delete_manager(
    manager_id: int,
    db: Session = Depends(get_db)
):

    manager = db.query(User).filter(
        User.id == manager_id,
        User.role == "manager"
    ).first()

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found"
        )

    db.delete(manager)
    db.commit()

    return {
        "message": "Manager deleted successfully"
    }

# SEARCH MANAGER

@router.get("/user/managers/search/{keyword}")
def search_manager(
    keyword: str,
    db: Session = Depends(get_db)
):

    managers = db.query(User).filter(
        User.role == "manager"
    ).all()

    result = []

    for manager in managers:

        if (
            keyword.lower() in str(manager.first_name or "").lower()
            or keyword.lower() in str(manager.last_name or "").lower()
            or keyword.lower() in str(manager.email or "").lower()
            or keyword.lower() in str(manager.username or "").lower()
        ):
            result.append(manager)

    return result