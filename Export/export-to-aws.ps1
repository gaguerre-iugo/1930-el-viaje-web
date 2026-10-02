<#
.SYNOPSIS
    Exporta el libro "1930 - El viaje" para publicacion en AWS S3 (Static Website Hosting).
.DESCRIPTION
    Copia solo los archivos imprescindibles desde el repositorio a Export/sitio/,
    excluyendo herramientas de desarrollo, entornos Python, documentacion interna,
    temporales y todo lo que no sea necesario para servir el libro estaticamente.
.EXAMPLE
    .\Export\export-to-aws.ps1
    Crea/actualiza Export/sitio/ con el contenido listo para subir a S3.
.NOTES
    Version: 1.0
    Fecha:   2026-09-23
#>

$ErrorActionPreference = "Stop"
$SourceRoot   = Resolve-Path "."
$TargetRoot   = Join-Path $SourceRoot "Export\sitio"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " 1930 - El viaje :: Export to AWS S3" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Origen:  $SourceRoot" -ForegroundColor Gray
Write-Host "Destino: $TargetRoot" -ForegroundColor Gray
Write-Host ""

# ──────────────────────────────────────────────
# 1. Crear/limpiar el directorio destino
# ──────────────────────────────────────────────
if (Test-Path $TargetRoot) {
    Write-Host "> Limpiando directorio destino existente..." -ForegroundColor Yellow
    Remove-Item -Path $TargetRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $TargetRoot -Force | Out-Null
Write-Host "[OK] Directorio destino creado" -ForegroundColor Green

# ──────────────────────────────────────────────
# 2. Archivos raiz (HTML + SCORM)
# ──────────────────────────────────────────────
Write-Host "> Copiando archivos raiz (HTML + XML)..." -ForegroundColor Yellow
$RootFiles = Get-ChildItem -Path $SourceRoot -Filter "*.html" -File
$RootFiles += Get-ChildItem -Path $SourceRoot -Filter "imsmanifest.xml" -File

foreach ($file in $RootFiles) {
    Copy-Item -Path $file.FullName -Destination $TargetRoot -Force
}
Write-Host "   -> $($RootFiles.Count) archivos copiados" -ForegroundColor Green

# ──────────────────────────────────────────────
# 3. assets/ (JS, CSS, config, fuentes, iconos, sonidos)
# ──────────────────────────────────────────────
Write-Host "> Copiando assets/..." -ForegroundColor Yellow
$TargetAssets = Join-Path $TargetRoot "assets"
New-Item -ItemType Directory -Path $TargetAssets -Force | Out-Null

# Archivos sueltos en assets/
$AssetsFiles = @(
    "auto-fit.js",
    "base.bundle.local.js",
    "base.bundle.min.js",
    "base.bundle.min.js.map",
    "config.json",
    "font-validation.js",
    "fonts.css",
    "offline-preloader.js",
    "quiz-sequence.js",
    "reflow-book.js",
    "reflow-redirect.js",
    "scorm.js",
    "tailwind_css.css"
)
foreach ($file in $AssetsFiles) {
    $src = Join-Path (Join-Path $SourceRoot "assets") $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $TargetAssets -Force
    }
}

# Subdirectorios de assets/
$AssetDirs = @(
    "fonts",
    "libs",
    "sounds",
    "symbols",
    "favicon_io",
    "interface_translations"
)
foreach ($dir in $AssetDirs) {
    $src = Join-Path (Join-Path $SourceRoot "assets") $dir
    $dst = Join-Path $TargetAssets $dir
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Recurse -Force
        $count = (Get-ChildItem -Path $dst -Recurse -File).Count
        Write-Host "   -> assets/$dir ($count archivos)" -ForegroundColor Gray
    }
}

$assetCount = (Get-ChildItem -Path $TargetAssets -Recurse -File).Count
Write-Host "   -> Total assets: $assetCount archivos" -ForegroundColor Green

# ──────────────────────────────────────────────
# 4. images/
# ──────────────────────────────────────────────
Write-Host "> Copiando images/..." -ForegroundColor Yellow
$TargetImages = Join-Path $TargetRoot "images"
if (Test-Path (Join-Path $SourceRoot "images")) {
    Copy-Item -Path (Join-Path $SourceRoot "images") -Destination $TargetRoot -Recurse -Force
    $imgCount = (Get-ChildItem -Path $TargetImages -Recurse -File).Count
    Write-Host "   -> $imgCount archivos" -ForegroundColor Green
}

# ──────────────────────────────────────────────
# 5. content/ (CSS, navegacion, i18n, TTS)
# ──────────────────────────────────────────────
Write-Host "> Copiando content/..." -ForegroundColor Yellow
$TargetContent = Join-Path $TargetRoot "content"
New-Item -ItemType Directory -Path $TargetContent -Force | Out-Null

# Archivos sueltos en content/
$ContentFiles = @(
    "reflow.css",
    "tailwind_output.css",
    "viewport-layout.css",
    "pages.json",
    "toc.json"
)
foreach ($file in $ContentFiles) {
    $src = Join-Path (Join-Path $SourceRoot "content") $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $TargetContent -Force
    }
    else {
        Write-Host "   [WARN] content/$file no encontrado" -ForegroundColor DarkYellow
    }
}

# content/navigation/
$navSrc = Join-Path $SourceRoot "content\navigation"
$navDst = Join-Path $TargetContent "navigation"
if (Test-Path $navSrc) {
    New-Item -ItemType Directory -Path $navDst -Force | Out-Null
    Copy-Item -Path "$navSrc\*" -Destination $navDst -Recurse -Force
}

# content/i18n/
$i18nSrc = Join-Path $SourceRoot "content\i18n"
$i18nDst = Join-Path $TargetContent "i18n"
if (Test-Path $i18nSrc) {
    New-Item -ItemType Directory -Path $i18nDst -Force | Out-Null
    Copy-Item -Path "$i18nSrc\*" -Destination $i18nDst -Recurse -Force
    $i18nCount = (Get-ChildItem -Path $i18nDst -Recurse -File).Count
    Write-Host "   -> content/i18n/ ($i18nCount archivos)" -ForegroundColor Green
}

$contentCount = (Get-ChildItem -Path $TargetContent -Recurse -File).Count
Write-Host "   -> Total content: $contentCount archivos" -ForegroundColor Green

# ──────────────────────────────────────────────
# 6. Resumen
# ──────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " RESUMEN DE EXPORTACION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$totalFiles = (Get-ChildItem -Path $TargetRoot -Recurse -File).Count
$totalSize  = (Get-ChildItem -Path $TargetRoot -Recurse -File | Measure-Object Length -Sum).Sum
$sizeMB     = [math]::Round($totalSize / 1MB, 1)
$sizeGB     = [math]::Round($totalSize / 1GB, 2)

Write-Host "  Destino:    $TargetRoot" -ForegroundColor White
Write-Host "  Archivos:   $totalFiles" -ForegroundColor White
Write-Host "  Tamano:     ${sizeMB} MB (${sizeGB} GB)" -ForegroundColor White
Write-Host ""
Write-Host "[OK] Exportacion completada exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "Proximo paso: publicar en AWS S3" -ForegroundColor Yellow
Write-Host "  aws s3 sync Export/sitio/ s3://1930-el-viaje/" -ForegroundColor Gray
Write-Host ""
Write-Host "Recordar: configurar Static Website Hosting y Bucket Policy en S3." -ForegroundColor Gray
Write-Host "Ver Export/export-instructions.md para instrucciones detalladas." -ForegroundColor Gray