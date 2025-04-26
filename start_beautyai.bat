@echo off
echo 🔄 Zatrzymywanie starej instancji...
docker-compose down

echo 🔨 Budowanie i uruchamianie aplikacji...
docker-compose up --build -d

echo ✅ Gotowe! Otwórz http://localhost:8000/docs w przeglądarce :)
pause
