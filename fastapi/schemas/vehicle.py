from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VehicleResponse(BaseModel):
    id: int

    vehicle_name: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_year: Optional[int] = None
    vehicle_type: Optional[str] = None

    vehicle_photo: Optional[str] = None

    chassi_number: Optional[str] = None
    registration_number: Optional[str] = None

    vehicle_description: Optional[str] = None

    status: Optional[str] = None

    created_on: Optional[datetime] = None
    created_by: Optional[str] = None

    updated_on: Optional[datetime] = None
    updated_by: Optional[str] = None

    class Config:
        from_attributes = True