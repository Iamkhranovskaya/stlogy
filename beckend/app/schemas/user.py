from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    phone: str
    name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone: Optional[str] = None 