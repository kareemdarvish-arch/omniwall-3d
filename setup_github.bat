@echo off
setlocal
title OmniWall 3D - GitHub Repository Setup Helper

echo ========================================================
echo   OmniWall 3D - GitHub Free Hosting Setup
echo   University Graduation Project
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Git command line is not currently installed in PATH.
    echo.
    echo Don't worry! You don't even need Git installed to put this online.
    echo.
    echo === FASTEST FREE ONLINE METHOD (No download needed) ===
    echo 1. Open your browser and go to: https://github.com/new
    echo 2. Name your repo: omniwall-3d (set to Public)
    echo 3. Click 'uploading an existing file' on the page
    echo 4. Drag all files from this folder into GitHub
    echo 5. Go to Repo Settings -^> Pages -^> Branch: main -^> Save!
    echo.
    echo Your website will be live in 1 minute at:
    echo https://your-username.github.io/omniwall-3d/
    echo ========================================================
    echo.
    pause
    exit /b
)

echo [OK] Git is detected!
echo.
set /p REPO_URL="Enter your empty GitHub repository URL (e.g. https://github.com/username/omniwall-3d.git): "

if "%REPO_URL%"=="" (
    echo No repository URL entered. Exiting.
    pause
    exit /b
)

git init
git add .
git commit -m "Initial release of OmniWall 3D Graduation Project Configurator"
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ========================================================
echo [SUCCESS] Code pushed to GitHub!
echo.
echo Final Step to turn on the website for FREE:
echo 1. Open your repo on GitHub
echo 2. Click 'Settings' -^> 'Pages'
echo 3. Under 'Build and deployment', set Branch to 'main' and folder to '/ (root)'
echo 4. Click 'Save'
echo.
echo In 60 seconds, your site is live for anyone with the link!
echo ========================================================
pause
