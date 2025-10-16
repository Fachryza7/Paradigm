@echo off
echo ========================================
echo    WealthEase-AI with ngrok
echo ========================================
echo.

REM Check if ngrok exists
if not exist "ngrok.exe" (
    echo ERROR: ngrok.exe not found!
    echo.
    echo Please download ngrok from: https://ngrok.com/download
    echo Extract ngrok.exe to this folder and try again.
    echo.
    pause
    exit /b 1
)

echo Starting local server...
start "WealthEase Server" cmd /k "python -m http.server 8000"

echo.
echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Starting ngrok tunnel...
echo.
echo Your app will be available at the ngrok URL below:
echo (Share this URL to access from phone or others)
echo.
ngrok http 8000

pause
