# PowerShell script to clean up BoardingBook-Mobile folder
# Keeps only 'backend' and 'RoommateFinderApp', deletes everything else

$keep = @('backend', 'RoommateFinderApp')
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

Get-ChildItem -Path $root | ForEach-Object {
    if ($keep -notcontains $_.Name) {
        if ($_.PSIsContainer) {
            Remove-Item -Recurse -Force $_.FullName
        } else {
            Remove-Item -Force $_.FullName
        }
    }
}
Write-Host "Cleanup complete. Only 'backend' and 'RoommateFinderApp' remain."
