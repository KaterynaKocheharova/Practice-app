# Stop hook: pop a Windows toast/balloon notification when Claude finishes a turn.
try {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $n = New-Object System.Windows.Forms.NotifyIcon
    $n.Icon = [System.Drawing.SystemIcons]::Information
    $n.BalloonTipTitle = 'Claude Code'
    $n.BalloonTipText = 'Finished a task in front/'
    $n.Visible = $true
    $n.ShowBalloonTip(5000)
    Start-Sleep -Seconds 5
    $n.Dispose()
} catch {}
exit 0
