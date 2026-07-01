from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from datetime import date, datetime

# SCHEMAS


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Literal["admin", "manager", "driver"]


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Literal["admin", "manager", "driver"]


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    email: EmailStr
    token: str
    new_password: str

# PROFILE SCHEMAS

class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[date] = None

    active: Optional[bool] = True

    profile_image: Optional[str] = None

    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    joined_on: Optional[datetime] = None

    class Config:
        from_attributes = True


class UpdateProfile(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    dob: Optional[date] = None


class UpdatePassword(BaseModel):
    old_password: str
    new_password: str


class ProfileResponse(BaseModel):
    id: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    role: Optional[str]
    active: bool
    dob: Optional[date]
    profile_image: Optional[str]
    driving_license: Optional[str]
    license_expiry_date: Optional[date]
    vehicle_assigned: Optional[int]
    driver_address: Optional[str]
    experience_years: Optional[int]
    created_at: Optional[datetime]
    created_by: Optional[str]
    updated_at: Optional[datetime]
    updated_by: Optional[str]
    joined_on: Optional[datetime]
    reset_token: Optional[str]
    reset_token_expiry: Optional[datetime]

    class Config:
        from_attributes = True
class AddManager(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    password: str

class AddDriver(BaseModel):
    username: str
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    password: str