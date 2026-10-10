param(
    [string]$RepoUrl
)

$destDir = "C:\Users\ABHI\AppData\Local\Programs\MinGit\cmd"
if (Test-Path $destDir) {
    $env:Path = "$destDir;$env:Path"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SmartAmbulance GitHub Push Automation Script" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub Repository URL (e.g. https://github.com/YOUR_USER/smart-ambulance.git)"
}

if (-not $RepoUrl) {
    Write-Host "No repository URL provided. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "`nConfiguring Git Remote Origin to: $RepoUrl" -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Successfully pushed SmartAmbulance project to GitHub!" -ForegroundColor Green
    Write-Host "View your repository at: $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host "`n[NOTICE] If push failed due to authentication, please authenticate using GitHub Personal Access Token (PAT) or GitHub CLI (gh auth login)." -ForegroundColor Yellow
}
