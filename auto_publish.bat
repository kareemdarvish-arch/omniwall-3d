@echo off
setlocal enabledelayedexpansion
title OmniWall 3D - Automatic GitHub Publisher

:: Set PATH to include Git and GitHub CLI
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\GitHubCLI;%PATH%"

echo ========================================================
echo   OmniWall 3D - GitHub Automatic Publisher
echo   Faculty of Engineering - Graduation Project
echo ========================================================
echo.

:: 1. Verify Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git command was not found.
    echo Please make sure Git is installed in %LOCALAPPDATA%\Programs\Git\cmd
    pause
    exit /b 1
)

:: 2. Verify GitHub CLI
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] GitHub CLI command was not found.
    echo Please make sure gh is installed in %LOCALAPPDATA%\Programs\GitHubCLI
    pause
    exit /b 1
)

echo [OK] Git and GitHub tools are ready!
echo.

:: 3. Check GitHub Sign-in
echo [*] Checking your GitHub sign-in status...
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   ACTION REQUIRED: Quick One-Time Sign In
    echo ========================================================
    echo A one-time code will appear below.
    echo Press ENTER to open GitHub in your browser and authorize it!
    echo ========================================================
    echo.
    gh auth login --web -h github.com -p https -w
)

:: Verify authentication succeeded
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] GitHub login was not completed.
    echo Please run this file again to complete login.
    pause
    exit /b 1
)

:: 4. Get GitHub Username
for /f "tokens=*" %%i in ('gh api user -q .login') do set "GH_USER=%%i"
echo.
echo [OK] Successfully logged in as: !GH_USER!
echo.

:: 5. Prepare Local Git Repo
cd /d "%~dp0"
if not exist ".git" (
    git init
)

git config user.name "!GH_USER!"
git config user.email "!GH_USER!@users.noreply.github.com"

git add .
git commit -m "Release OmniWall 3D Graduation Project Configurator" >nul 2>nul
git branch -M main

:: 6. Create Remote Repository and Push
echo [*] Publishing repository 'omniwall-3d' to your GitHub account...
gh repo view !GH_USER!/omniwall-3d >nul 2>nul
if %errorlevel% equ 0 (
    echo [i] Repository already exists on your GitHub. Pushing latest updates...
    git remote remove origin >nul 2>nul
    git remote add origin https://github.com/!GH_USER!/omniwall-3d.git
    git push -u origin main --force
) else (
    gh repo create omniwall-3d --public --source=. --remote=origin --push
)

:: 7. Enable GitHub Pages for Free Web Hosting
echo [*] Activating GitHub Pages (free live web hosting)...
gh api repos/!GH_USER!/omniwall-3d/pages -X POST -f "source[branch]=main" -f "source[path]=/" >nul 2>nul

echo.
echo ========================================================
echo   SUCCESS! YOUR WEBSITE IS NOW ONLINE FOR FREE!
echo ========================================================
echo.
echo   Your Live Website URL (No download needed):
echo   https://!GH_USER!.github.io/omniwall-3d/
echo.
echo   Your GitHub Repository:
echo   https://github.com/!GH_USER!/omniwall-3d
echo.
echo   (Note: GitHub Pages takes about 30-60 seconds on first deploy)
echo ========================================================
echo.

start https://github.com/!GH_USER!/omniwall-3d
start https://!GH_USER!.github.io/omniwall-3d/

pause
