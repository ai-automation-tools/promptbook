---
title: "📌 Windows Disk Cleanup Automation"
tags: ["powershell", "windows", "disk-cleanup", "storage", "maintenance"]
category: "IT"
subcategory: "Scripts"
---

# Windows Disk Cleanup Automation

## Purpose
Create a comprehensive PowerShell script to automate Windows disk cleanup, freeing up storage space by safely removing temporary files, system caches, and unnecessary data.

## Instructions

Generate a PowerShell script that performs automated disk cleanup with the following capabilities:

### Temporary Files Cleanup
1. **Windows Temp folders**:
   - `C:\Windows\Temp`
   - `%TEMP%` (User temp folder)
   - `%TMP%`

2. **Browser caches**:
   - Chrome cache
   - Firefox cache
   - Edge cache
   - Internet Explorer cache

3. **Application temp data**:
   - Microsoft Office temp files
   - Adobe temp files
   - Windows Store cache

### System Cleanup
1. **Windows Update cleanup**:
   - Windows Update cache (`C:\Windows\SoftwareDistribution`)
   - Windows Update downloads folder
   - Superseded Windows components

2. **Windows System files**:
   - Recycle Bin (all users)
   - Delivery Optimization cache
   - Downloaded Program Files
   - Offline web pages cache
   - Error reports and feedback

3. **Thumbnail and icon caches**:
   - `thumbs.db` files
   - Icon cache
   - Windows thumbnail cache

### Log Files Cleanup
1. **Windows logs**:
   - CBS logs (`C:\Windows\Logs\CBS`)
   - DISM logs
   - Windows Update logs (older than 30 days)
   - Setup logs (older than 90 days)

2. **Application logs**:
   - IIS logs (if applicable)
   - Event Viewer logs (archived)
   - Third-party application logs

### Advanced Cleanup
1. **Windows.old folder** (from upgrades)
2. **Previous Windows installations**
3. **Windows Defender definitions** (old versions)
4. **Windows Error Reporting files**
5. **Prefetch files** (older than 30 days)

### Disk Optimization
1. **Analyze disk fragmentation** (HDD only)
2. **Run TRIM** (SSD only)
3. **Check disk health** and report
4. **Optimize storage** based on drive type

## Output Format

```powershell
# ============================================
# Windows Disk Cleanup Automation Script
# Created: [Date]
# Version: 1.0
# Requires: Administrator privileges
# ============================================

#Requires -RunAsAdministrator

# Configuration
$minFileAge = 30  # Days - Don't delete files newer than this
$logPath = "$env:USERPROFILE\Desktop\disk-cleanup-log.txt"

# Initialize log
function Write-CleanupLog {
    param($message, $color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp - $message"
    Write-Host $logMessage -ForegroundColor $color
    $logMessage | Out-File -FilePath $logPath -Append
}

# Get disk space before cleanup
$driveLetter = "C:"
$diskBefore = Get-PSDrive $driveLetter[0]
$freeSpaceBefore = [math]::Round($diskBefore.Free / 1GB, 2)

Write-CleanupLog "=== Starting Disk Cleanup ===" "Green"
Write-CleanupLog "Free space before cleanup: $freeSpaceBefore GB" "Cyan"

# Cleanup function with safety checks
function Remove-SafelyWithAge {
    param(
        [string]$Path,
        [int]$MinDays = 30,
        [switch]$Recurse,
        [string]$Filter = "*"
    )
    
    if (Test-Path $Path) {
        $cutoffDate = (Get-Date).AddDays(-$MinDays)
        Get-ChildItem -Path $Path -Filter $Filter -Recurse:$Recurse -ErrorAction SilentlyContinue |
            Where-Object { $_.LastWriteTime -lt $cutoffDate -and -not $_.PSIsContainer } |
            ForEach-Object {
                try {
                    Remove-Item $_.FullName -Force -ErrorAction Stop
                    Write-CleanupLog "Deleted: $($_.FullName)" "Gray"
                    $script:deletedSize += $_.Length
                    $script:deletedCount++
                }
                catch {
                    Write-CleanupLog "Failed to delete: $($_.FullName) - $($_.Exception.Message)" "Yellow"
                }
            }
    }
}

# Initialize counters
$deletedSize = 0
$deletedCount = 0

# 1. Clean Windows Temp
Write-CleanupLog "`n[1/10] Cleaning Windows Temp folders..." "Yellow"
Remove-SafelyWithAge -Path "$env:WINDIR\Temp" -MinDays $minFileAge -Recurse
Remove-SafelyWithAge -Path "$env:TEMP" -MinDays $minFileAge -Recurse

# 2. Clean Recycle Bin
Write-CleanupLog "`n[2/10] Emptying Recycle Bin..." "Yellow"
try {
    Clear-RecycleBin -Force -ErrorAction Stop
    Write-CleanupLog "Recycle Bin emptied successfully" "Green"
}
catch {
    Write-CleanupLog "Failed to empty Recycle Bin: $($_.Exception.Message)" "Red"
}

# 3. Clean Windows Update cache
Write-CleanupLog "`n[3/10] Cleaning Windows Update cache..." "Yellow"
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Remove-SafelyWithAge -Path "C:\Windows\SoftwareDistribution\Download" -MinDays $minFileAge -Recurse
Start-Service -Name wuauserv -ErrorAction SilentlyContinue

# 4. Clean browser caches
Write-CleanupLog "`n[4/10] Cleaning browser caches..." "Yellow"
# Chrome
Remove-SafelyWithAge -Path "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache" -MinDays 7 -Recurse
# Edge
Remove-SafelyWithAge -Path "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache" -MinDays 7 -Recurse
# Firefox
Remove-SafelyWithAge -Path "$env:LOCALAPPDATA\Mozilla\Firefox\Profiles\*\cache2" -MinDays 7 -Recurse

# 5. Clean thumbnail cache
Write-CleanupLog "`n[5/10] Cleaning thumbnail caches..." "Yellow"
Remove-SafelyWithAge -Path "$env:LOCALAPPDATA\Microsoft\Windows\Explorer" -MinDays 30 -Recurse -Filter "thumbcache*.db"

# 6. Clean Windows logs
Write-CleanupLog "`n[6/10] Cleaning old Windows logs..." "Yellow"
Remove-SafelyWithAge -Path "C:\Windows\Logs\CBS" -MinDays 30 -Recurse -Filter "*.log"
Remove-SafelyWithAge -Path "C:\Windows\Logs\DISM" -MinDays 30 -Recurse -Filter "*.log"

# 7. Clean Delivery Optimization cache
Write-CleanupLog "`n[7/10] Cleaning Delivery Optimization cache..." "Yellow"
try {
    Delete-DeliveryOptimizationCache -Force -ErrorAction Stop
    Write-CleanupLog "Delivery Optimization cache cleared" "Green"
}
catch {
    Write-CleanupLog "Failed to clear Delivery Optimization cache: $($_.Exception.Message)" "Yellow"
}

# 8. Clean Windows.old (if exists)
Write-CleanupLog "`n[8/10] Checking for Windows.old folder..." "Yellow"
if (Test-Path "C:\Windows.old") {
    $size = (Get-ChildItem "C:\Windows.old" -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
    Write-CleanupLog "Found Windows.old folder ($([math]::Round($size, 2)) GB)" "Cyan"
    Write-CleanupLog "Manual cleanup recommended: cleanmgr /d c:" "Yellow"
}

# 9. Optimize disk based on type
Write-CleanupLog "`n[9/10] Checking disk type and optimizing..." "Yellow"
$drive = Get-PhysicalDisk | Where-Object { $_.DeviceId -eq 0 }
if ($drive.MediaType -eq "SSD") {
    Write-CleanupLog "SSD detected - Running TRIM optimization..." "Cyan"
    Optimize-Volume -DriveLetter $driveLetter[0] -ReTrim -Verbose
}
else {
    Write-CleanupLog "HDD detected - Analyzing fragmentation..." "Cyan"
    Optimize-Volume -DriveLetter $driveLetter[0] -Analyze -Verbose
}

# 10. Generate summary report
Write-CleanupLog "`n[10/10] Generating cleanup summary..." "Yellow"

$diskAfter = Get-PSDrive $driveLetter[0]
$freeSpaceAfter = [math]::Round($diskAfter.Free / 1GB, 2)
$spaceReclaimed = [math]::Round($freeSpaceAfter - $freeSpaceBefore, 2)
$deletedSizeGB = [math]::Round($deletedSize / 1GB, 2)

Write-CleanupLog "`n=== Cleanup Summary ===" "Green"
Write-CleanupLog "Files deleted: $deletedCount" "White"
Write-CleanupLog "Space reclaimed: $spaceReclaimed GB" "White"
Write-CleanupLog "Free space before: $freeSpaceBefore GB" "White"
Write-CleanupLog "Free space after: $freeSpaceAfter GB" "White"
Write-CleanupLog "Log saved to: $logPath" "Cyan"
Write-CleanupLog "`n=== Cleanup Complete ===" "Green"

# Optional: Schedule regular cleanup
$scheduleCleanup = Read-Host "`nWould you like to schedule this cleanup to run monthly? (Y/N)"
if ($scheduleCleanup -eq "Y") {
    # [Task scheduler implementation...]
}
```

## Example Use Case

**Scenario**: Windows 10 PC with 256GB SSD has only 15GB free space remaining.

**Script Execution**:
```
=== Starting Disk Cleanup ===
Free space before cleanup: 15.23 GB

[1/10] Cleaning Windows Temp folders...
  Deleted: C:\Windows\Temp\tmpABC123.tmp
  Deleted: C:\Users\Mike\AppData\Local\Temp\~DF456.tmp
  [247 files deleted]

[2/10] Emptying Recycle Bin...
  Recycle Bin emptied successfully

[3/10] Cleaning Windows Update cache...
  [1.8 GB cleaned]

[4/10] Cleaning browser caches...
  Chrome cache: 523 MB
  Edge cache: 312 MB
  [835 MB cleaned]

[5/10] Cleaning thumbnail caches...
  [156 MB cleaned]

[6/10] Cleaning old Windows logs...
  [89 files deleted - 234 MB]

[7/10] Cleaning Delivery Optimization cache...
  Delivery Optimization cache cleared

[8/10] Checking for Windows.old folder...
  Found Windows.old folder (12.5 GB)
  Manual cleanup recommended: cleanmgr /d c:

[9/10] Checking disk type and optimizing...
  SSD detected - Running TRIM optimization...
  TRIM completed successfully

[10/10] Generating cleanup summary...

=== Cleanup Summary ===
Files deleted: 1,847
Space reclaimed: 4.2 GB
Free space before: 15.23 GB
Free space after: 19.43 GB

=== Cleanup Complete ===
```

**Expected Outcome**:
- 4-5GB space reclaimed immediately
- Additional 12GB can be reclaimed by running Windows Disk Cleanup for Windows.old
- System responds faster due to cache cleanup
- SSD optimization completed

## Important Notes

- **Always run as Administrator** - Required for system file access
- **Age-based deletion** prevents accidental removal of active files
- **Logs all actions** for audit trail and troubleshooting
- **Safe mode** deletes only files older than 30 days by default
- **Handles errors gracefully** and continues with cleanup
- **Can be scheduled** using Task Scheduler for regular maintenance

## Advanced Features

1. **Customizable age thresholds** for different file types
2. **Whitelist/blacklist** for specific folders or applications
3. **Dry-run mode** to preview what would be deleted
4. **Email report** of cleanup results
5. **Network drive cleanup** (if mapped)
6. **Cloud storage optimization** (OneDrive, Dropbox)
7. **Duplicate file detection** and removal
8. **Large file finder** (files > 1GB)
9. **Unused programs detection** (not opened in 6+ months)
10. **Storage Sense integration** for automatic cleanup scheduling

## Safety Features

- **Never delete files newer than X days** (configurable)
- **Skip system-critical folders** (Windows, Program Files)
- **Test-Path checks** before attempting deletion
- **Try-Catch blocks** around all potentially risky operations
- **Detailed logging** of successes and failures
- **Space calculation** before and after for verification
- **Warning prompts** for aggressive cleanup options
- **Backup suggestion** before running on production systems

## Scheduled Maintenance

The script can create a scheduled task to run automatically:
- **Weekly**: Quick cleanup (temp files, browser cache)
- **Monthly**: Full cleanup (logs, update cache, optimization)
- **Quarterly**: Deep cleanup (old installations, large file review)

Users can customize the schedule during script execution or set it up manually via Task Scheduler.
