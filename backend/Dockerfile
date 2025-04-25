FROM python:3.10-slim

# Ustawiamy folder roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy pliki requirements.txt
COPY requirements.txt /app/

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy cały folder backend do kontenera
COPY backend /app/backend

# Dodajemy folder app do PYTHONPATH, żeby można było importować moduły
ENV PYTHONPATH="${PYTHONPATH}:/app"

# Ustawiamy zmienne środowiskowe
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ekspozycja portu
EXPOSE 8000

# Używamy entrypoint, który umożliwi uruchamianie
CMD ["uvicorn", "backend.beautyai.main:app", "--host", "0.0.0.0", "--port", "8000"]
