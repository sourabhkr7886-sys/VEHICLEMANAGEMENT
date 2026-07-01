from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean
from datetime import datetime, UTC
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    role = Column(String, default="driver", nullable=False)

    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True),default=lambda: datetime.now(UTC))

    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)

    dob = Column(Date, nullable=True)

    active = Column(Boolean, default=True)

    profile_image = Column(String, nullable=True)

    created_by = Column(String, nullable=True)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC)
    )

    updated_by = Column(String, nullable=True)

    joined_on = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC)
    )

    driving_license = Column(String, nullable=True)

    license_expiry_date = Column(Date, nullable=True)

     

    vehicle = relationship(
    "Vehicle",
    back_populates="driver",
    foreign_keys="Vehicle.driver_id",
    uselist=False
    )
    

    driver_address = Column(String, nullable=True)

    experience_years = Column(Integer, nullable=True)