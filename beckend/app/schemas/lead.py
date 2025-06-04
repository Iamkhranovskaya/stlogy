from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LeadFileBase(BaseModel):
    filename: str

class LeadFileCreate(LeadFileBase):
    pass

class LeadFile(LeadFileBase):
    id: int
    lead_id: int

    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    date: str
    time: str
    contact_method: str
    messenger: str
    comment: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    user_id: int
    files: List[LeadFile] = []

    class Config:
        from_attributes = True 