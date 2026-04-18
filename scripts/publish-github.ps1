$ErrorActionPreference = "Stop"
$gh = Join-Path ${env:ProgramFiles} "GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Error "GitHub CLI not found at $gh. Install with: winget install GitHub.cli"
  exit 1
}

$authOk = $false
try {
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = "SilentlyContinue"
  & $gh auth status 2>&1 | Out-Null
  $ErrorActionPreference = $prevEap
  if ($LASTEXITCODE -eq 0) { $authOk = $true }
} catch {
  $authOk = $false
}

if (-not $authOk) {
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

# Do not use `git remote get-url origin` when origin may be missing: stderr can
# surface as a terminating error in PowerShell and skip `gh repo create`.
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$remotes = @(git remote)
$ErrorActionPreference = $prevEap
$hasOrigin = $remotes -contains "origin"

if ($hasOrigin) {
  Write-Host "Remote 'origin' already set. Pushing branch..."
  git push -u origin HEAD
  exit $LASTEXITCODE
}

$repoName = "multiagent-system-hello-world-cursor"
Write-Host "Creating GitHub repo '$repoName' and pushing..."
& $gh repo create $repoName --public --source . --remote origin --push --description "Hello world multi-agent demo (web + Expo)"
