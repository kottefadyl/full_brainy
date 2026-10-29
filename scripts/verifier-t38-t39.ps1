$projectRoot = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Invoke-Check {
  param([string]$Name, [string]$Directory, [string]$Program, [string[]]$Arguments)
  Write-Host "T38/T39: $Name"
  Push-Location $Directory
  try {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { $script:failures.Add($Name) }
  } catch {
    Write-Host $_
    $script:failures.Add($Name)
  } finally {
    Pop-Location
  }
}

Invoke-Check 'API build' (Join-Path $projectRoot 'api') 'npm' @('run', 'build')
if (-not $failures.Contains('API build')) {
  Invoke-Check 'Geography and classification smoke' (Join-Path $projectRoot 'api') 'node' @('scripts/geo-classification-smoke.mjs')
}
Invoke-Check 'Web lint' (Join-Path $projectRoot 'brainy_web_app') 'npm' @('run', 'lint')
Invoke-Check 'Web TypeScript' (Join-Path $projectRoot 'brainy_web_app') 'npx' @('tsc', '--noEmit')
Invoke-Check 'Web build' (Join-Path $projectRoot 'brainy_web_app') 'npm' @('run', 'build')
Invoke-Check 'Flutter analysis' (Join-Path $projectRoot 'brainy') 'dart' @('analyze', 'lib/collections_api.dart', 'lib/collection_transfer.dart', 'lib/entry_clipboard.dart', 'lib/insights_dialog.dart', 'lib/workspace_screen.dart', 'lib/classification_screen.dart', 'lib/geo_field_input.dart', 'lib/geo_map_view.dart', 'lib/app_strings.dart')
Invoke-Check 'Documentation' $projectRoot 'node' @('scripts/verifier-docs.mjs')
Invoke-Check 'Roadmap' $projectRoot 'node' @('scripts/verifier-contenu-roadmap.mjs')

if ($failures.Count -gt 0) {
  Write-Host "T38/T39 failed: $($failures -join ', ')"
  exit 1
}
Write-Host 'T38/T39 final verification passed'
