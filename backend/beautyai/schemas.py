# schemas.py - Pydantic models

from pydantic import BaseModel, EmailStr, Field, HttpUrl, validator
from typing import List, Optional, Union, Dict
from datetime import datetime, date
from enum import Enum

# Enumeracje
class UserRole(str, Enum):
    ADMIN = "admin"         # Kosmetolog (administrator)
    CLIENT = "client"       # Klientka

class SkinType(str, Enum):
    DRY = "dry"             # Sucha
    OILY = "oily"           # Tłusta
    COMBINATION = "combination"  # Mieszana
    NORMAL = "normal"       # Normalna
    SENSITIVE = "sensitive" # Wrażliwa

class SkinConcern(str, Enum):
    ACNE = "acne"           # Trądzik
    AGING = "aging"         # Starzenie
    PIGMENTATION = "pigmentation"  # Przebarwienia
    REDNESS = "redness"     # Zaczerwienienia
    DEHYDRATION = "dehydration"    # Odwodnienie

# Token Authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[UserRole] = UserRole.CLIENT

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Client schemas
class ClientBase(BaseModel):
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    user_id: Optional[int] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class ClientUpdate(ClientBase):
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class Client(ClientBase):
    id: int
    user_id: int
    cosmetologist_id: Optional[int] = None
    
    class Config:
        orm_mode = True

class ClientDetail(Client):
    user: User
    
    class Config:
        orm_mode = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None

class ProductCreate(ProductBase):
    skin_types: List[SkinType] = []
    skin_concerns: List[SkinConcern] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    skin_types: Optional[List[SkinType]] = None
    skin_concerns: Optional[List[SkinConcern]] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skin_types: List[SkinType] = []
    skin_concerns: List[SkinConcern] = []
    
    class Config:
        orm_mode = True

# Analysis schemas
class AnalysisBase(BaseModel):
    client_id: int
    skin_type: Optional[SkinType] = None
    notes: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisUpdate(BaseModel):
    skin_type: Optional[SkinType] = None
    hydration_level: Optional[float] = None
    sebum_level: Optional[float] = None
    pigmentation: Optional[float] = None
    wrinkles: Optional[float] = None
    pores: Optional[float] = None
    sensitivity: Optional[float] = None
    notes: Optional[str] = None
    ai_recommendations: Optional[str] = None

class AnalysisResult(BaseModel):
    skin_type: SkinType
    hydration_level: float
    sebum_level: float
    pigmentation: float
    wrinkles: float
    pores: float
    sensitivity: float
    ai_recommendations: str
    recommended_product_ids: List[int] = []

class Analysis(AnalysisBase):
    id: int
    created_by: int
    performed_at: datetime
    image_path: Optional[str] = None
    hydration_level: Optional[float] = None
    sebum_level: Optional[float] = None
    pigmentation: Optional[float] = None
    wrinkles: Optional[float] = None
    pores: Optional[float] = None
    sensitivity: Optional[float] = None
    ai_recommendations: Optional[str] = None
    
    class Config:
        orm_mode = True

class AnalysisDetail(Analysis):
    client: Client
    recommended_products: List[Product] = []
    
    class Config:
        orm_mode = True

# CarePlan schemas
class CarePlanItemBase(BaseModel):
    product_id: int
    usage_time: Optional[str] = None
    usage_frequency: Optional[str] = None
    usage_instructions: Optional[str] = None
    order: int

class CarePlanItemCreate(CarePlanItemBase):
    pass

class CarePlanItem(CarePlanItemBase):
    id: int
    care_plan_id: int
    
    class Config:
        orm_mode = True

class CarePlanItemDetail(CarePlanItem):
    product: Product
    
    class Config:
        orm_mode = True

class CarePlanBase(BaseModel):
    client_id: int
    analysis_id: int
    title: str
    description: Optional[str] = None
    valid_until: Optional[datetime] = None

class CarePlanCreate(CarePlanBase):
    items: List[CarePlanItemCreate] = []

class CarePlan(CarePlanBase):
    id: int
    created_by: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class CarePlanDetail(CarePlan):
    client: Client
    analysis: Analysis
    items: List[CarePlanItemDetail] = []
    
    class Config:
        orm_mode = True

# Chat Message schemas
class ChatMessageBase(BaseModel):
    client_id: int
    message: str
    is_from_client: bool = True

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    sender_id: int
    sent_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# File Upload schema
class ImageUpload(BaseModel):
    client_id: int
    image_data: str = Field(..., description="Base64 encoded image data")

# AI Analysis Request/Response
class AnalysisRequest(BaseModel):
    image_path: str
    client_id: int

class AnalysisAIResponse(BaseModel):
    skin_type: SkinType
    metrics: Dict[str, float]
    recommendations: str
