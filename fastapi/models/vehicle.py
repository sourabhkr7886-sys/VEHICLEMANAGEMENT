from sqlalchemy import (Column,Integer,String,Text,DateTime,ForeignKey)
from sqlalchemy.orm import relationship
from datetime import datetime, UTC

from database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_name = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_type = Column(String(50), nullable=False)

  
    vehicle_photo = Column(String, nullable=True)

    chassi_number = Column(String(100), unique=True, nullable=False, index=True)
    registration_number = Column(String(100), unique=True, nullable=False, index=True)

  
    vehicle_description = Column(Text, nullable=True)

    status = Column(String(20), default="Active", nullable=False)

  
    driver_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )


    driver = relationship("User", back_populates="vehicle")

    
    created_on = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC)
    )
    created_by = Column(String(100))

    updated_on = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC)
    )
    updated_by = Column(String(100))