@echo off
setlocal
set "PATH=C:\Users\ABHI\AppData\Local\Programs\MinGit\cmd;%PATH%"

echo ==========================================================
echo   SmartAmbulance GitHub Push Automation Script
echo ==========================================================

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/USERNAME/smart-ambulance.git): "
if "%REPO_URL%"=="" (
    echo Error: No repository URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo Setting remote origin to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Renaming branch to main...
git branch -M main

echo Pushing main branch to GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==========================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo ==========================================================
) else (
    echo.
    echo [NOTE] If prompted for credentials, use your GitHub username and Personal Access Token (PAT).
)

pause
