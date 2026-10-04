# PostToolUse hook (Write|Edit): auto-format the file Claude just wrote.
# front has no Prettier config — eslint --fix is the project's own formatter/lint tool.
$ErrorActionPreference = 'SilentlyContinue'
$json = [Console]::In.ReadToEnd()
try { $data = $json | ConvertFrom-Json } catch { exit 0 }

$f = $data.tool_input.file_path
if (-not $f) { $f = $data.tool_response.filePath }

if ($f -and (Test-Path $f) -and ($f -match '\.(js|jsx|mjs|cjs|ts|tsx)$')) {
    & npx.cmd eslint --fix "$f" *> $null
}
exit 0
