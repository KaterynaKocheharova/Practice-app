# PostToolUse hook (Write|Edit): auto-format the file Claude just wrote.
# back has Prettier configured (.prettierrc, npm run format) — use it directly.
$ErrorActionPreference = 'SilentlyContinue'
$json = [Console]::In.ReadToEnd()
try { $data = $json | ConvertFrom-Json } catch { exit 0 }

$f = $data.tool_input.file_path
if (-not $f) { $f = $data.tool_response.filePath }

if ($f -and (Test-Path $f) -and ($f -match '\.ts$')) {
    & npx.cmd prettier --write "$f" *> $null
}
exit 0
