$ErrorActionPreference = "Stop"
$gh = Join-Path ${env:ProgramFiles} "GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Error "GitHub CLI not found at $gh. Install with: winget install GitHub.cli"
  exit 1
}

& $gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host @"
Not logged in to GitHub.

1) Log in (browser):
   & '$gh' auth login

2) Create the repo on GitHub and push:
   npm run publish:github
"@
  exit 1
}

Set-Location (Join-Path $PSScriptRoot "..")

if (git remote get-url origin 2>$null) {
  Write-Host "Remote 'origin' already set. Pushing branch..."
  git push -u origin HEAD
  exit $LASTEXITCODE
}

$repoName = "multiagent-system-hello-world-cursor"
Write-Host "Creating GitHub repo '$repoName' and pushing..."
& $gh repo create $repoName --public --source . --remote origin --push --description "Hello world multi-agent demo (web + Expo)"
