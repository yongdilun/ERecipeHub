@echo off
echo Starting Frontend and Backend servers...

start cmd /k "cd frontend && npm start"
start cmd /k "cd backend && npm start"

echo Servers are starting... 