# models.py - SQLAlchemy models

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Boolean, Table, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from typing import List
import datetime

Base = declarative_base()

# Enumeracje
class UserRole(enum.Enum):
    ADMIN = "admin"         # Kosmetolog (administrator)
    CLIENT = "client"       # Klientka
    SUPERADMIN = "superadmin"  # Właściciel systemu

class SkinType(enum.Enum):
    DRY = "dry"             # Sucha
    OILY = "oily"           # Tłusta
    COMBINATION = "combination"  # Mieszana
    NORMAL = "normal"       # Normalna
    SENSITIVE = "sensitive" # Wrażliwa

class SkinConcern(enum.Enum):
    ACNE = "acne"           # Trądzik
    AGING = "aging"         # Starzenie
    PIGMENTATION = "pigmentation"  # Przebarwienia
    REDNESS = "redness"     # Zaczerwienienia
    DEHYDRATION = "dehydration"    # Odwodnienie

# Tabela łącząca dla relacji wiele-do-wielu między Analysis i Product
analysis_product = Table(
    'analysis_product',
    Base.metadata,
    Column('analysis_id', Integer, ForeignKey('analyses.id'), primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacje
    client_profile = relationship("Client", back_populates="user", uselist=False, foreign_keys="Client.user_id")
    cosmetologist_clients = relationship("Client", back_populates="cosmetologist", foreign_keys="Client.cosmetologist_id")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    cosmetologist_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String)
    birth_date = Column(DateTime)
    address = Column(String)
    notes = Column(Text)

    # Relacje
    user = relationship("User", back_populates="client_profile", foreign_keys=[user_id])
    cosmetologist = relationship("User", back_populates="cosmetologist_clients", foreign_keys=[cosmetologist_id])
    analyses = relationship("Analysis", back_populates="client")
    care_plans = relationship("CarePlan", back_populates="client")
    chat_messages = relationship("ChatMessage", back_populates="client")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    performed_at = Column(DateTime(timezone=True), server_default=func.now())
    image_path = Column(String)
    skin_type = Column(Enum(SkinType))

    # Wyniki analizy AI
    hydration_level = Column(Float)
    sebum_level = Column(Float)
    pigmentation = Column(Float)
    wrinkles = Column(Float)
    pores = Column(Float)
    sensitivity = Column(Float)

    notes = Column(Text)
    ai_recommendations = Column(Text)

    # Relacje
    client = relationship("Client", back_populates="analyses")
    creator = relationship("User")
    recommended_products = relationship("Product", secondary=analysis_product, back_populates="analyses")
    care_plan = relationship("CarePlan", back_populates="analysis", uselist=False)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String)
    category = Column(String)
    description = Column(Text)
    ingredients = Column(Text)
    image_url = Column(String)
    price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacje
    analyses = relationship("Analysis", secondary=analysis_product, back_populates="recommended_products")
    care_plan_items = relationship("CarePlanItem", back_populates="product")

class CarePlan(Base):
    __tablename__ = "care_plans"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    analysis_id = Column(Integer, ForeignKey("analyses.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    valid_until = Column(DateTime)

    # Relacje
    client = relationship("Client", back_populates="care_plans")
    analysis = relationship("Analysis", back_populates="care_plan")
    creator = relationship("User")
    items = relationship("CarePlanItem", back_populates="care_plan")

class CarePlanItem(Base):
    __tablename__ = "care_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    care_plan_id = Column(Integer, ForeignKey("care_plans.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    usage_time = Column(String)
    usage_frequency = Column(String)
    usage_instructions = Column(Text)
    order = Column(Integer)

    # Relacje
    care_plan = relationship("CarePlan", back_populates="items")
    product = relationship("Product", back_populates="care_plan_items")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    is_from_client = Column(Boolean, default=True)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))

    # Relacje
    client = relationship("Client", back_populates="chat_messages")
    sender = relationship("User")
