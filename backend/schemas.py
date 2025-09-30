from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DogBase(BaseModel):
    name: str
    description: Optional[str] = None

class DogCreate(DogBase):
    pass

class DogUpdate(BaseModel):
    description: Optional[str]
    image_url: Optional[str]

class DogOut(DogBase):
    id: int
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserPhotoOut(BaseModel):
    id: int
    dog_id: Optional[int]
    photo_url: str
    uploaded_by: Optional[str]
    uploaded_at: datetime

    class Config:
        orm_mode = True