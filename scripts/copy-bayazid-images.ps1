$src = "C:\Users\Global Tech\.gemini\antigravity\brain\6e3a9caa-e070-4c2d-87d9-edf5f8b25014"
$dst = "d:\Si_antigravity\saha-event\public\images\bayazid"

$files = @(
  "media__1777579818092.jpg",
  "media__1777579822483.jpg",
  "media__1777579822540.jpg",
  "media__1777573630617.jpg",
  "media__1777573630629.jpg",
  "media__1777573634796.jpg"
)

foreach ($f in $files) {
  $from = Join-Path $src $f
  $to   = Join-Path $dst $f
  if (Test-Path $from) {
    Copy-Item $from $to -Force
    Write-Host "Copied: $f"
  } else {
    Write-Host "Not found: $f"
  }
}
Write-Host "Done."
