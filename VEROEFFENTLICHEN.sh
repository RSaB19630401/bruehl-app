#!/bin/bash
# ╔══════════════════════════════════════════════════════╗
# ║  Brühl (Baden) Heimat-App → GitHub veröffentlichen  ║
# ╚══════════════════════════════════════════════════════╝

set -e
cd "$(dirname "$0")/bruehl-github-pages" 2>/dev/null || cd "$(dirname "$0")"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  Brühl Heimat-App → GitHub veröffentlichen          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Schritt 1: Git prüfen
echo "[Schritt 1/5] Prüfe Git..."
if ! command -v git &> /dev/null; then
    echo ""
    echo "  Git ist nicht installiert!"
    echo "  Installiere es mit: xcode-select --install"
    echo ""
    xcode-select --install 2>/dev/null
    exit 1
fi
echo "  ✓ Git gefunden!"

# Schritt 2: Benutzername
echo ""
echo "[Schritt 2/5] GitHub-Benutzername"
read -p "Gib deinen GitHub-Benutzernamen ein: " GITHUB_USER
if [ -z "$GITHUB_USER" ]; then
    echo "Fehler: Kein Benutzername!"; exit 1
fi
echo "  ✓ Benutzername: $GITHUB_USER"

# Schritt 3: Git-Projekt erstellen
echo ""
echo "[Schritt 3/5] Projekt vorbereiten..."
rm -rf .git
git init -b main > /dev/null 2>&1
git config user.email "${GITHUB_USER}@users.noreply.github.com"
git config user.name "$GITHUB_USER"
echo "  ✓ Git-Projekt erstellt"

# Schritt 4: Dateien commiten
echo ""
echo "[Schritt 4/5] Dateien vorbereiten..."
git add -A > /dev/null 2>&1
git commit -m "Brühl Heimat-App veröffentlichen" > /dev/null 2>&1
echo "  ✓ Alle Dateien bereit"

# Schritt 5: Hochladen
echo ""
echo "[Schritt 5/5] Auf GitHub hochladen..."
echo ""
echo "══════════════════════════════════════════════════════"
echo "  WICHTIG - Erstelle ZUERST das Projekt auf GitHub:"
echo ""
echo "  1. Öffne: https://github.com/new"
echo "  2. Name: bruehl-app"
echo "  3. KEIN Häkchen bei README!"
echo "  4. Klicke 'Create repository'"
echo "══════════════════════════════════════════════════════"
echo ""
open "https://github.com/new" 2>/dev/null || xdg-open "https://github.com/new" 2>/dev/null || echo "Öffne https://github.com/new im Browser"
read -p "Drücke Enter nachdem du das Projekt erstellt hast..."

git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${GITHUB_USER}/bruehl-app.git"
git push -u origin main

echo ""
echo "  ✓ Dateien hochgeladen!"
echo ""
echo "══════════════════════════════════════════════════════"
echo "  LETZTER SCHRITT: GitHub Pages aktivieren"
echo "  1. Öffne: https://github.com/${GITHUB_USER}/bruehl-app/settings/pages"
echo "  2. Source: Deploy from a branch"
echo "  3. Branch: main / Ordner: / (root)"
echo "  4. Save klicken"
echo "══════════════════════════════════════════════════════"
echo ""
open "https://github.com/${GITHUB_USER}/bruehl-app/settings/pages" 2>/dev/null || true

echo "╔══════════════════════════════════════════════════════╗"
echo "║  🎉 FERTIG! Deine App ist bald online unter:        ║"
echo "║  https://${GITHUB_USER}.github.io/bruehl-app/       ║"
echo "║                                                      ║"
echo "║  iPhone: Safari → Adresse → ⬆ Teilen                ║"
echo "║  → 'Zum Home-Bildschirm' → Fertig!                  ║"
echo "╚══════════════════════════════════════════════════════╝"
