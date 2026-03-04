@echo off
title Bruehl App - GitHub
cd /d "%~dp0"

echo.
echo --------------------------------------------------------
echo   Bruehl (Baden) Heimat-App auf GitHub veroeffentlichen
echo --------------------------------------------------------
echo.
echo   Druecke eine Taste um zu starten...
pause >nul

echo.
echo [Schritt 1/6] Pruefe ob Git installiert ist...
echo.
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   FEHLER: Git ist nicht installiert!
    echo.
    echo   Bitte installiere Git:
    echo   1. Oeffne: https://git-scm.com/download/win
    echo   2. Klicke auf "Click here to download"
    echo   3. Installiere mit Standard-Einstellungen
    echo   4. Computer NEU starten
    echo   5. Dieses Skript NOCHMAL ausfuehren
    echo.
    start https://git-scm.com/download/win
    pause
    exit /b 1
)
echo   OK - Git gefunden!

echo.
echo [Schritt 2/6] Pruefe Dateien...
echo.
if exist "bruehl-github-pages\index.html" (
    cd bruehl-github-pages
)
if not exist "index.html" (
    echo   FEHLER: index.html nicht gefunden!
    echo   Bitte entpacke die ZIP-Datei komplett.
    echo   Aktueller Ordner: %CD%
    pause
    exit /b 1
)
echo   OK - Dateien gefunden!

echo.
echo [Schritt 3/6] GitHub-Benutzername
echo.
set /p GITHUB_USER="   Dein GitHub-Benutzername: "
if "%GITHUB_USER%"=="" (
    echo   FEHLER: Kein Name eingegeben!
    pause
    exit /b 1
)
echo.
echo   OK - Benutzername: %GITHUB_USER%

echo.
echo [Schritt 4/6] Bereite Dateien vor...
echo.
if exist ".git" rmdir /s /q .git >nul 2>&1
git init -b main >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    git init >nul 2>&1
    git checkout -b main >nul 2>&1
)
git config user.email "%GITHUB_USER%@users.noreply.github.com" >nul 2>&1
git config user.name "%GITHUB_USER%" >nul 2>&1
git add -A >nul 2>&1
git commit -m "Bruehl Heimat-App" >nul 2>&1
echo   OK - Dateien vorbereitet!

echo.
echo [Schritt 5/6] Projekt auf GitHub erstellen
echo.
echo --------------------------------------------------------
echo   JETZT BIST DU DRAN:
echo.
echo   1. Es oeffnet sich gleich github.com/new
echo   2. Repository name: bruehl-app
echo   3. KEIN Haekchen bei "Add a README file"
echo   4. Klicke "Create repository"
echo   5. Komm hierher zurueck
echo --------------------------------------------------------
echo.
echo   Taste druecken um github.com zu oeffnen...
pause >nul
start https://github.com/new
echo.
echo   Wenn du fertig bist, druecke eine Taste...
pause >nul

echo.
echo [Schritt 6/6] Lade hoch auf GitHub...
echo.
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GITHUB_USER%/bruehl-app.git
echo   GitHub fragt evtl. nach Benutzername und Passwort.
echo   Als Passwort: Dein Personal Access Token verwenden.
echo.
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo --------------------------------------------------------
    echo   Upload fehlgeschlagen!
    echo.
    echo   Du brauchst ein Personal Access Token:
    echo   1. Gleich oeffnet sich die Token-Seite
    echo   2. Klicke "Generate new token" - "classic"
    echo   3. Name: bruehl-app
    echo   4. Haekchen bei "repo"
    echo   5. "Generate token" klicken
    echo   6. Token KOPIEREN
    echo   7. Dieses Skript NOCHMAL starten
    echo   8. Token als Passwort eingeben
    echo --------------------------------------------------------
    echo.
    start https://github.com/settings/tokens
    pause
    exit /b 1
)

echo.
echo --------------------------------------------------------
echo   Upload erfolgreich!
echo.
echo   LETZTER SCHRITT - GitHub Pages aktivieren:
echo   1. Gleich oeffnet sich die Settings-Seite
echo   2. Source: "Deploy from a branch"
echo   3. Branch: main / Ordner: / (root)
echo   4. "Save" klicken
echo --------------------------------------------------------
echo.
echo   Taste druecken um die Einstellungen zu oeffnen...
pause >nul
start https://github.com/%GITHUB_USER%/bruehl-app/settings/pages

echo.
echo --------------------------------------------------------
echo.
echo   FERTIG! Deine App ist in 1-2 Minuten online:
echo.
echo   https://%GITHUB_USER%.github.io/bruehl-app/
echo.
echo   Auf dem iPhone:
echo   1. Safari oeffnen
echo   2. Adresse oben eingeben
echo   3. Teilen-Symbol antippen (Quadrat mit Pfeil)
echo   4. "Zum Home-Bildschirm"
echo   5. App-Icon ist da!
echo.
echo --------------------------------------------------------
echo.
pause
