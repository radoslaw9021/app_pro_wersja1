from sqlalchemy.orm import Session
from sqlalchemy import text
from database import SessionLocal

def test_db_connection():
    try:
        db: Session = SessionLocal()
        db.execute(text("SELECT 1"))
        print("✅ Połączenie z bazą danych działa!")
    except Exception as e:
        print("❌ Błąd połączenia z bazą:", e)
    finally:
        db.close()

test_db_connection()

