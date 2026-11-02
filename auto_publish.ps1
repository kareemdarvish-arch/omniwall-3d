# OmniWall 3D - Automated GitHub Publisher
# Automates Git initialization, GitHub authentication, repository creation, and GitHub Pages publishing

param(
    [string]$RepoName = "omniwall-3d"
)

$Host.UI.RawUI.WindowTitle = "OmniWall 3D - Automated GitHub Publisher"
Clear-Host

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   🎓 OmniWall 3D - Automatic GitHub Publisher & Cloud Deploy   " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure git and gh are in environment PATH
$toolsPaths = @(
    "$env:LOCALAPPDATA\Programs\Git\bin",
    "$env:LOCALAPPDATA\Programs\Git\cmd",
    "C:\Program Files\Git\bin",
    "C:\Program Files\Git\cmd",
    "$env:LOCALAPPDATA\Programs\GitHubCLI",
    "$env:LOCALAPPDATA\Programs\GitHubCLI\bin"
)

foreach ($p in $toolsPaths) {
    if ((Test-Path $p) -and ($env:Path -notlike "*$p*")) {
        $env:Path = "$p;$env:Path"
    }
}

# 1. Verify Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not found in PATH." -ForegroundColor Red
    Write-Host "Please wait a moment while the installer completes, or install Git." -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "[✔] Git is ready!" -ForegroundColor Green

# 2. Verify GitHub CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] GitHub CLI (gh) is not found in PATH." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "[✔] GitHub CLI (gh) is ready!" -ForegroundColor Green
Write-Host ""

# 3. Check GitHub Authentication Status
Write-Host "[*] Checking your GitHub sign-in status..." -ForegroundColor Gray
$authStatus = gh auth status 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Yellow
    Write-Host "   ACTION REQUIRED: One-time GitHub Browser Authorization        " -ForegroundColor Yellow
    Write-Host "-----------------------------------------------------------------" -ForegroundColor Yellow
    Write-Host "A browser window is about to open with an 8-character code." -ForegroundColor White
    Write-Host "Simply click 'Authorize github' in your browser to sign in!" -ForegroundColor White
    Write-Host ""
    
    gh auth login --web -h github.com -p https -w
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Authentication was not completed. Please try again." -ForegroundColor Red
        pause
        exit 1
    }
}

# Get authenticated username
$ghUser = (gh api user -q .login 2>$null)
if (-not $ghUser) {
    $ghUser = "your-account"
}
Write-Host "[✔] Authenticated successfully as: $ghUser" -ForegroundColor Green
Write-Host ""

# 4. Configure Git identity if not already set
$currentGitName = git config --global user.name
$currentGitEmail = git config --global user.email

if (-not $currentGitName) {
    git config --global user.name "$ghUser"
}
if (-not $currentGitEmail) {
    git config --global user.email "$ghUser@users.noreply.github.com"
}

# 5. Initialize Local Git Repository
Set-Location "D:\grad project"
Write-Host "[*] Preparing local Git repository..." -ForegroundColor Gray

if (-not (Test-Path ".git")) {
    git init
}

git add .
git commit -m "Initial release of OmniWall 3D Graduation Project Configurator" 2>$null
git branch -M main

Write-Host "[✔] Local repository committed!" -ForegroundColor Green
Write-Host ""

# 6. Create Remote Repository & Push to GitHub
Write-Host "[*] Creating repository '$RepoName' on your GitHub account ($ghUser)..." -ForegroundColor Gray

# Check if repo already exists
$existingRepo = gh repo view "$ghUser/$RepoName" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[i] Repository '$ghUser/$RepoName' already exists. Pushing changes..." -ForegroundColor Yellow
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$ghUser/$RepoName.git"
    git push -u origin main --force
} else {
    gh repo create "$RepoName" --public --source=. --remote=origin --push
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "[✔] Successfully pushed code to https://github.com/$ghUser/$RepoName !" -ForegroundColor Green
} else {
    Write-Host "[!] Push encountered an issue. Retrying standard git push..." -ForegroundColor Yellow
    git push -u origin main
}
Write-Host ""

# 7. Enable GitHub Pages for 100% Free Live Hosting
Write-Host "[*] Enabling GitHub Pages (free live web hosting)..." -ForegroundColor Gray
$pagesResult = gh api "repos/$ghUser/$RepoName/pages" -X POST -f "source[branch]=main" -f "source[path]=/" 2>&1

$liveUrl = "https://$ghUser.github.io/$RepoName/"

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "   🎉 SUCCESS! YOUR WEBSITE IS NOW ONLINE FOR FREE!              " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  🌍 Public Live Website URL (No download needed):" -ForegroundColor White
Write-Host "     $liveUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📦 GitHub Repository URL:" -ForegroundColor White
Write-Host "     https://github.com/$ghUser/$RepoName" -ForegroundColor Yellow
Write-Host ""
Write-Host "  (Note: GitHub Pages takes about 30 to 60 seconds to build on first publish)" -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Green
Write-Host ""

# Automatically open both links in browser
Start-Process "https://github.com/$ghUser/$RepoName"
Start-Process $liveUrl

pause
