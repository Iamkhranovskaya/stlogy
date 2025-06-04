from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String, nullable=True)
    date = Column(String)
    time = Column(String)
    contact_method = Column(String)
    messenger = Column(String)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="leads")
    files = relationship("LeadFile", back_populates="lead")

class LeadFile(Base):
    __tablename__ = "lead_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    
    lead = relationship("Lead", back_populates="files") 