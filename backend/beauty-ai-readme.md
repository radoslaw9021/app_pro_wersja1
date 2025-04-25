# BeautyAI API

API dla systemu wspierającego kosmetologów w analizie skóry klientek i tworzeniu planów pielęgnacji.

## Wymagania

- Python 3.8+
- PostgreSQL
- Biblioteki Python (zobacz `requirements.txt`)

## Instalacja

1. Sklonuj repozytorium
2. Utwórz wirtualne środowisko Python:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
3. Zainstaluj wymagane biblioteki:
   ```
   pip install -r requirements.txt
   ```
4. Utwórz bazę danych PostgreSQL:
   ```
   createdb beautyai
   ```
5. Skonfiguruj połączenie z bazą danych w pliku `database.py`

## Uruchomienie

```bash
uvicorn main:app --reload
```

API będzie dostępne pod adresem: http://localhost:8000

## Dokumentacja API

Po uruchomieniu aplikacji, automatyczna dokumentacja API będzie dostępna pod:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Struktura projektu

```
beautyai/
├── main.py            # Główny plik aplikacji FastAPI
├── database.py        # Konfiguracja bazy danych
├── models.py          # Modele SQLAlchemy
├── schemas.py         # Modele Pydantic
├── requirements.txt   # Wymagane biblioteki
└── uploads/           # Katalog na przesyłane pliki
```

## Wymagane biblioteki (requirements.txt)

```
fastapi==0.100.0
uvicorn==0.22.0
sqlalchemy==2.0.19
psycopg2-binary==2.9.6
passlib==1.7.4
python-jose==3.3.0
python-multipart==0.0.6
pydantic==2.0.3
pydantic[email]==2.0.3
tensorflow==2.13.0
pillow==10.0.0
python-dotenv==1.0.0
aiofiles==23.1.0
bcrypt==4.0.1
```

## Endpointy API

### Uwierzytelnianie
- `POST /token` - Logowanie i generowanie tokenu JWT

### Użytkownicy (Users)
- `POST /users/` - Tworzenie nowego użytkownika (tylko admin)
- `GET /users/me/` - Pobieranie informacji o bieżącym użytkowniku
- `GET /users/` - Pobieranie listy wszystkich użytkowników (tylko admin)
- `GET /users/{user_id}` - Pobieranie informacji o konkretnym użytkowniku (tylko admin)
- `PUT /users/{user_id}` - Aktualizacja użytkownika
- `DELETE /users/{user_id}` - Deaktywacja konta użytkownika (tylko admin)

### Klientki (Clients)
- `POST /clients/` - Dodawanie nowej klientki (tylko admin)
- `GET /clients/` - Pobieranie listy klientek
- `GET /clients/{client_id}` - Pobieranie informacji o konkretnej klientce
- `PUT /clients/{client_id}` - Aktualizacja danych klientki

### Produkty (Products)
- `POST /products/` - Dodawanie nowego produktu (tylko admin)
- `GET /products/` - Pobieranie listy produktów (z możliwością filtrowania)
- `GET /products/{product_id}` - Pobieranie informacji o konkretnym produkcie
- `PUT /products/{product_id}` - Aktualizacja produktu (tylko admin)
- `DELETE /products/{product_id}` - Usuwanie produktu (tylko admin)

### Analizy skóry (Analyses)
- `POST /upload-image/` - Przesyłanie zdjęcia do analizy (tylko admin)
- `POST /upload-image-base64/` - Przesyłanie zdjęcia w formacie base64 (tylko admin)
- `GET /analyses/` - Pobieranie listy analiz
- `GET /analyses/{analysis_id}` - Pobieranie konkretnej analizy
- `PUT /analyses/{analysis_id}` - Aktualizacja analizy (tylko admin)
- `POST /analyses/{analysis_id}/recommend-products` - Rekomendacja produktów na podstawie analizy

### Plany pielęgnacyjne (Care Plans)
- `POST /care-plans/` - Tworzenie nowego planu pielęgnacyjnego
- `GET /care-plans/` - Pobieranie listy planów pielęgnacyjnych
- `GET /care-plans/{care_plan_id}` - Pobieranie konkretnego planu
- `PUT /care-plans/{care_plan_id}` - Aktualizacja planu
- `DELETE /care-plans/{care_plan_id}` - Usuwanie planu

### Czat (Chat)
- `POST /chat/messages/` - Wysyłanie wiadomości
- `GET /chat/messages/{client_id}` - Pobieranie historii czatu
- `PUT /chat/messages/{message_id}/read` - Oznaczanie wiadomości jako przeczytanej
