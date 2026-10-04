# PreToolUse hook (Bash): hard-blocks (deny, no override) two team-guaranteed rules,
# then requires explicit confirmation (ask) for every other shell command.
$json = [Console]::In.ReadToEnd()
try { $data = $json | ConvertFrom-Json } catch { exit 0 }

$cmd = $data.tool_input.command
if (-not $cmd) { exit 0 }

function Emit($decision, $reason) {
    $out = @{
        hookSpecificOutput = @{
            hookEventName            = 'PreToolUse'
            permissionDecision       = $decision
            permissionDecisionReason = $reason
        }
    }
    $out | ConvertTo-Json -Depth 5 -Compress
    exit 0
}

# --- Hard block 1: rm with both recursive and force flags (rm -rf, rm -fr, --recursive --force, ...) ---
$hasR = ($cmd -match '\brm\b') -and ($cmd -match '\s-[a-zA-Z]*r[a-zA-Z]*(\s|$)' -or $cmd -match '--recursive\b')
$hasF = ($cmd -match '\brm\b') -and ($cmd -match '\s-[a-zA-Z]*f[a-zA-Z]*(\s|$)' -or $cmd -match '--force\b')
if ($hasR -and $hasF) {
    Emit 'deny' 'Team policy hook: rm with recursive+force flags is hard-blocked, no exceptions via Claude.'
}

# --- Hard block 2: commits/pushes touching main or master ---
if ($cmd -match '\bgit\b') {
    $branch = $null
    try { $branch = (git rev-parse --abbrev-ref HEAD 2>$null) } catch {}
    if ($branch) { $branch = $branch.Trim() }

    $blocked = $false
    if ($cmd -match '\bgit\s+push\b' -and $cmd -match '(^|[\s:])(main|master)(\s|$)') { $blocked = $true }

    if ($cmd -match '\bgit\s+push\b' -and ($branch -eq 'main' -or $branch -eq 'master')) {
        # Bare "git push" / "git push origin" (no explicit branch/ref) pushes the current
        # (protected) branch. Only treat it as bare when no positional ref argument follows.
        $afterPush = $cmd -replace '^.*\bgit\s+push\b', ''
        $posArgs = ($afterPush -split '\s+') | Where-Object { $_ -ne '' -and $_ -notmatch '^-' }
        if ($posArgs.Count -le 1) { $blocked = $true }
    }

    if ($cmd -match '\bgit\s+commit\b' -and ($branch -eq 'main' -or $branch -eq 'master')) { $blocked = $true }
    if ($cmd -match '\bgit\s+branch\s+-[dD]\s+(main|master)\b') { $blocked = $true }

    if ($blocked) {
        Emit 'deny' 'Team policy hook: direct commits/pushes to main/master are hard-blocked. Use a feature branch and open a PR.'
    }
}

# --- Otherwise: require explicit confirmation for every shell command ---
Emit 'ask' 'Confirm before running this shell command (team policy hook).'
