$ErrorActionPreference = "Stop"
Write-Output "Killing all node processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Output "Starting backend only..."
Set-Location "C:\Users\uros\Desktop\travel-api"
& npm.cmd run dev
