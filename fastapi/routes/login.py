from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import (
    ForgotPassword,
    ResetPassword
)
from jwta.jwt import (
    verify_password,
    create_access_token,
    hash_password,
    verify_reset_token
)

router = APIRouter()


# ==========================================================
# LOGIN
# ==========================================================
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    if not db_user.active:
        raise HTTPException(
            status_code=403,
            detail="Your account is deactivated. Contact Admin."
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Wrong password"
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role,
            "user_id": db_user.id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful",
        "role": db_user.role,
        "user_id": db_user.id
    }


# ==========================================================
# FORGOT PASSWORD
# ==========================================================
@router.post("/forgot-password")
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    reset_token = create_access_token(
        {
            "sub": user.email
        },
        expires_delta=1,
        token_type="reset"
    )

    return {
        "message": "Reset token generated",
        "reset_token": reset_token
    }


# ==========================================================
# RESET PASSWORD
# ==========================================================
@router.post("/reset-password")
def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):

    payload = verify_reset_token(data.token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired reset token"
        )

    if payload.get("sub") != data.email:
        raise HTTPException(
            status_code=401,
            detail="Token does not belong to this email"
        )

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.password = hash_password(data.new_password)

    db.commit()

    return {
        "message": "Password reset successful"
    }