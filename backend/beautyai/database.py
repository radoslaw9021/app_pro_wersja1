# database.py - Database configuration

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:mojehaslo@beautyai_db:5432/beautyai"




# W środowisku produkcyjnym używaj zmiennych środowiskowych dla danych dostępowych

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
