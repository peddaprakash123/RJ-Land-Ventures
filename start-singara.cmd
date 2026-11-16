@echo off
setlocal
cd /d "%~dp0"

echo Starting Singara Realties...
echo API: http://localhost:4000
echo Web: http://localhost:3000

start "Singara Realties API" cmd /k node ".\node_modules\tsx\dist\cli.mjs" server\index.ts
start "Singara Realties Web" cmd /k node ".\node_modules\vite\bin\vite.js" --port=3000 --host=0.0.0.0 client

echo.
echo Two terminal windows were opened. Keep both running while using the site.
timeout /t 3 >nul
endlocal
