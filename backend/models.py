from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Dog(Base):
    __tablename__ = 'dogs'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    image_url = Column(String(512))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class UserPhoto(Base):
    __tablename__ = 'user_photos'
    id = Column(Integer, primary_key=True, index=True)
    dog_id = Column(Integer, ForeignKey('dogs.id'))
    photo_url = Column(String(512), nullable=False)
    uploaded_by = Column(String(255))
    uploaded_at = Column(DateTime, server_default=func.now())