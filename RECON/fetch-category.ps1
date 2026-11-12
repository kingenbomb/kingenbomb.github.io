param([Parameter(Mandatory=$true)][string]$Category)
$ErrorActionPreference = 'Continue'
$root = 'D:\mm\reactbits-splittext-clone'
$h = @{ 'User-Agent' = 'opencode-clone' }
$t = Invoke-RestMethod 'https://api.github.com/repos/DavidHDev/react-bits/git/trees/main?recursive=1' -Headers $h
$files = $t.tree | Where-Object { $_.type -eq 'blob' -and ($_.path -match "^src/(content|demo|constants/code|tailwind|ts-default|ts-tailwind)/$Category/") }
"files in repo: $($files.Count)"
$base = Join-Path $root 'vendor'
$failed = @()
foreach ($f in $files) {
  $dest = Join-Path $base ($f.path -replace '/', '\')
  $dir = Split-Path $dest
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $url = "https://raw.githubusercontent.com/DavidHDev/react-bits/main/$($f.path -replace ' ', '%20')"
  $success = $false
  for ($i = 1; $i -le 4; $i++) {
    try {
      $c = (Invoke-WebRequest -Uri $url -Headers $h -UseBasicParsing -TimeoutSec 40).Content
      [System.IO.File]::WriteAllText($dest, $c, (New-Object System.Text.UTF8Encoding($false)))
      $success = $true
      break
    } catch { Start-Sleep -Milliseconds 700 }
  }
  if (-not $success) { $failed += $f.path }
}
"download failed: $($failed.Count)"
$failed | ForEach-Object { "  FAILED: $_" }
$missing = @()
foreach ($f in $files) {
  $dest = Join-Path $base ($f.path -replace '/', '\')
  if (-not ((Test-Path $dest) -and ((Get-Item $dest).Length -gt 0))) { $missing += $f.path }
}
"missing/empty: $($missing.Count)"
$missing | ForEach-Object { "  MISSING: $_" }

$S = Join-Path $root 'src'
foreach ($sub in 'content', 'demo', 'constants\code', 'tailwind', 'ts-default', 'ts-tailwind') {
  $srcDir = Join-Path $root "vendor\src\$sub\$Category"
  if (Test-Path $srcDir) { Copy-Item -Recurse -Force $srcDir (Join-Path $S "$sub\$Category"); "copied $sub\$Category" }
}

'--- component dirs ---'
(Get-ChildItem (Join-Path $S "content\$Category") -Directory | Select-Object -ExpandProperty Name) -join ', '
'--- external imports (components) ---'
Get-ChildItem (Join-Path $S "content\$Category") -Recurse -Filter *.jsx | Select-String -Pattern "from ['""]([^.'\""@][^'\""]*)['""]" | ForEach-Object { $_.Matches[0].Groups[1].Value } | Sort-Object -Unique
'--- suspicious demo imports (nuqs/next-themes/react-icons/lenis/@ alias) ---'
Get-ChildItem (Join-Path $S "demo\$Category") -Filter *.jsx | Select-String -Pattern "nuqs|next-themes|react-icons|lenis|from '@/" | ForEach-Object { "$($_.Filename): $($_.Line.Trim())" }
'--- non-standard kit imports in demos ---'
Get-ChildItem (Join-Path $S "demo\$Category") -Filter *.jsx | Select-String -Pattern "from '(\.\./\.\./[^']+)'" -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique | Where-Object { $_ -notmatch '^\.\./\.\./(components/(common/(Preview/(Customize|PreviewColorPickerCustom|PreviewColorList|PreviewInput|PreviewSelect|PreviewSlider|PreviewSwitch|PropTable|RefreshButton)|TabsLayout)|code/(CodeExample|Dependencies)|context/ComponentPropsContext|setup/color-mode)|constants/code/|content/|hooks/useComponentProps)' }
'--- seo category meta ---'
$SEO = Get-Content (Join-Path $root 'vendor\src\utils\seo.js') -Raw
foreach ($k in 'text', 'animations', 'components', 'backgrounds', 'micro') {
  $i = $SEO.IndexOf("$k" + ': {')
  if ($i -ge 0) {
    $snippet = $SEO.Substring($i, 400)
    $heading = if ($snippet -match "heading: '([^']+)'") { $Matches[1] } else { '?' }
    $path = if ($snippet -match "path: '([^']+)'") { $Matches[1] } else { '?' }
    "$k => heading: $heading | path: $path"
  }
}
