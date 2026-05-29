$ErrorActionPreference = "Stop"
$GithubUser = "TylorDev"
$ReposUrl = "https://api.github.com/users/$GithubUser/repos?per_page=100"
$WikiRawBase = "https://raw.githubusercontent.com/wiki/$GithubUser"
$TestDir = Join-Path $PWD "public\Test"

if (!(Test-Path -Path $TestDir)) {
    New-Item -ItemType Directory -Force -Path $TestDir | Out-Null
}

Write-Host "Fetching repos..."
$repos = Invoke-RestMethod -Uri $ReposUrl -Method Get -Headers @{"User-Agent"="PowerShell"}

$reposJson = $repos | ConvertTo-Json -Depth 10
Set-Content -Path (Join-Path $TestDir "repos.json") -Value $reposJson

foreach ($repo in $repos) {
    if (-not $repo.name) { continue }
    $name = $repo.name
    $encodedName = [uri]::EscapeDataString($name)

    # Base
    $mdUrl = "$WikiRawBase/$encodedName/$encodedName.md"
    try {
        $md = Invoke-RestMethod -Uri $mdUrl -Method Get -ErrorAction Stop
        Set-Content -Path (Join-Path $TestDir "$name.md") -Value $md
        Write-Host "Saved $name.md"
    } catch { }

    # Es
    $esUrl = "$WikiRawBase/$encodedName/${encodedName}%E2%80%90Es.md"
    try {
        $esMd = Invoke-RestMethod -Uri $esUrl -Method Get -ErrorAction Stop
        Set-Content -Path (Join-Path $TestDir "$name-Es.md") -Value $esMd
        Write-Host "Saved $name-Es.md"
    } catch { }

    # Pt
    $ptUrl = "$WikiRawBase/$encodedName/${encodedName}%E2%80%90Pt.md"
    try {
        $ptMd = Invoke-RestMethod -Uri $ptUrl -Method Get -ErrorAction Stop
        Set-Content -Path (Join-Path $TestDir "$name-Pt.md") -Value $ptMd
        Write-Host "Saved $name-Pt.md"
    } catch { }
}

$staticBases = @(
    @{ url = "$WikiRawBase/Tylordev/Tylordev.md"; name = "Tylordev.md" },
    @{ url = "$WikiRawBase/Tylordev/Tylordev%E2%80%90es.md"; name = "Tylordev-es.md" },
    @{ url = "$WikiRawBase/Tylordev/Tylordev%E2%80%90pt.md"; name = "Tylordev-pt.md" }
)

foreach ($file in $staticBases) {
    try {
        $md = Invoke-RestMethod -Uri $file.url -Method Get -ErrorAction Stop
        Set-Content -Path (Join-Path $TestDir $file.name) -Value $md
        Write-Host "Saved $($file.name)"
    } catch { }
}

Write-Host "Done!"
