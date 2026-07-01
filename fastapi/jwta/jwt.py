from jose import jwt, JWTError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer


# CONFIG

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# PASSWORD 

def safe_password(password: str) -> str:
    if not password:
        raise ValueError("Password cannot be empty")
    return password


def hash_password(password: str) -> str:
    password = safe_password(password)
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    plain_password = safe_password(
        plain_password
    )

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ACCESS TOKEN


def create_access_token(
    data: dict,
    expires_delta: int = ACCESS_TOKEN_EXPIRE_HOURS,
    token_type: str = "access"
):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=expires_delta
    )

    payload.update({
        "exp": expire,
        "type": token_type
    })

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# VERIFY ACCESS TOKEN


def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "access":
            return None

        return payload

    except JWTError:
        return None


# RESET TOKEN


def verify_reset_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "reset":
            return None

        return payload

    except JWTError:
        return None


# CURRENT USER


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return {
        "user_id": payload.get("user_id"),
        "email": payload.get("sub"),
        "role": payload.get("role")
    }

# ROLE AUTHORIZATION


def admin_only(
    user=Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only"
        )

    return user


def manager_only(
    user=Depends(get_current_user)
):

    if user["role"] != "manager":
        raise HTTPException(
            status_code=403,
            detail="Manager only"
        )

    return user


def driver_only(
    user=Depends(get_current_user)
):

    if user["role"] != "driver":
        raise HTTPException(
            status_code=403,
            detail="Driver only"
        )

    return user

