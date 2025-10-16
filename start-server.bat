@echo off
echo ========================================
echo    WealthEase-AI Server Starter
echo ========================================
echo.

echo Starting local server...
start "WealthEase Server" cmd /k "python -m http.server 8000"

echo.
echo Server started at: http://localhost:8000
echo.
echo To make it accessible from phone/others:
echo 1. Download ngrok from https://ngrok.com/download
echo 2. Extract ngrok.exe to this folder
echo 3. Run: ngrok http 8000
echo 4. Share the ngrok URL (e.g., https://abc123.ngrok.io)
echo.
echo Press any key to continue...
pause > nul
