# Быстрый push в GitHub — запускайте из папки game
Set-Location $PSScriptRoot

Write-Host "=== Статус ===" -ForegroundColor Cyan
git status

$changes = git status --porcelain
if (-not $changes) {
    $last = git log -1 --format="%h %s (%cr)"
    $ver = (Select-String -Path "index.html" -Pattern '\?v=(\d+)' | Select-Object -First 1).Matches.Groups[1].Value
    Write-Host "Нет новых изменений — всё уже на GitHub." -ForegroundColor Yellow
    Write-Host "Последний коммит: $last" -ForegroundColor Gray
    if ($ver) {
        Write-Host "Откройте сайт с актуальной версией:" -ForegroundColor Cyan
        Write-Host "https://marinamon7770-cmyk.github.io/game1/?v=$ver" -ForegroundColor Green
    }
    exit 0
}

Write-Host "`n=== Добавляем все изменения ===" -ForegroundColor Cyan
git add -A

$msg = Read-Host "Сообщение коммита (Enter = 'Обновление игры')"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Обновление игры" }

git commit -m $msg
if ($LASTEXITCODE -ne 0) {
    Write-Host "Коммит не создан." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Push на GitHub ===" -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nГотово! Сайт обновится через 1-2 минуты:" -ForegroundColor Green
    Write-Host "https://marinamon7770-cmyk.github.io/game1/" -ForegroundColor Green
} else {
    Write-Host "Push не удался. Проверьте интернет и авторизацию GitHub." -ForegroundColor Red
}
