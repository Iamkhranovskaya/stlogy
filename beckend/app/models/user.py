from sqlalchemy import Column, Integer, String, Boolean
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True) 