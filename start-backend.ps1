#!/usr/bin/env pwsh
# Kill any existing Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
 
Start-Sleep -Seconds 2

# Navigate to backend and start
Set-Location -Path "C:\Users\hasir\OneDrive\Documents\BordingBook\backend"
Write-Output "Starting backend server..."
& npm start
