@echo off
echo Konfiguracja frontendu...

REM Usuń istniejący katalog frontend jeśli istnieje
if exist frontend (
    rd /s /q frontend
)

REM Utwórz nowy projekt React
npx create-react-app frontend

REM Przejdź do katalogu frontend
cd frontend

REM Usuń istniejące node_modules i package-lock.json
rd /s /q node_modules
del package-lock.json

REM Instalacja dodatkowych zależności
echo Instalacja zaleznosci...
call npm install
call npm install @emotion/react @emotion/styled @mui/material @mui/icons-material axios react-router-dom react-quill jwt-decode --save

REM Tworzenie struktury katalogów
mkdir src\components
mkdir src\pages

REM Dodaj font Roboto do index.html
echo ^<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /^> >> public\index.html

echo Konfiguracja frontendu zakonczona!

REM Uruchom aplikację
npm start
cd .. 