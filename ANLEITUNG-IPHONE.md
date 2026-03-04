# 🏠 Brühl App auf dem iPhone installieren

## Schritt 1: Die App online stellen (einmalig)

Du brauchst einen kostenlosen GitHub-Account, damit die App eine Internetadresse bekommt.

### 1.1 GitHub-Account erstellen
1. Öffne **https://github.com** im Browser
2. Klicke auf **"Sign up"** (oben rechts)
3. Gib deine E-Mail, ein Passwort und einen Benutzernamen ein
4. Bestätige deine E-Mail

### 1.2 Die App hochladen
1. Gehe zu **https://github.com/new** (neues Projekt erstellen)
2. Name: **bruehl-app** eingeben
3. Hake an: **"Add a README file"**
4. Klicke **"Create repository"**
5. Klicke oben auf **"Add file"** → **"Upload files"**
6. Ziehe ALLE Dateien aus dem Ordner `bruehl-github-pages` in das Upload-Feld:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `apple-touch-icon.png`
   - `icon-192.png`
   - `icon-512.png`
7. Klicke **"Commit changes"**

### 1.3 GitHub Pages aktivieren
1. Gehe in deinem Projekt zu **Settings** (Zahnrad-Symbol)
2. Scrolle links runter zu **"Pages"**
3. Unter "Source" wähle: **"Deploy from a branch"**
4. Branch: **main**, Ordner: **/ (root)**
5. Klicke **"Save"**
6. Nach 1-2 Minuten erscheint oben ein grüner Link:
   **https://DEIN-USERNAME.github.io/bruehl-app/**

Das ist die Adresse deiner App! 🎉


## Schritt 2: App auf dem iPhone installieren

### 2.1 Webseite öffnen
1. Öffne **Safari** auf deinem iPhone (muss Safari sein!)
2. Tippe die Adresse ein:
   **https://DEIN-USERNAME.github.io/bruehl-app/**
3. Warte bis die App vollständig geladen ist

### 2.2 Zum Home-Bildschirm hinzufügen
1. Tippe unten auf das **Teilen-Symbol** (das Quadrat mit dem Pfeil nach oben ⬆️)
2. Scrolle in der Liste nach unten
3. Tippe auf **"Zum Home-Bildschirm"**
4. Der Name "Brühl App" wird vorgeschlagen – so lassen oder ändern
5. Tippe oben rechts auf **"Hinzufügen"**

### 2.3 Fertig! 🎉
- Auf deinem Home-Bildschirm ist jetzt ein **blaues App-Icon mit goldenem "B"**
- Tippe darauf → Die App öffnet sich **im Vollbild**, wie eine echte App
- Kein Safari-Rahmen, keine Adressleiste – sieht aus wie eine richtige App!


## Gut zu wissen

- Die App braucht beim ersten Öffnen Internet (um React zu laden)
- Danach funktioniert sie auch **offline** mit den zuletzt geladenen Daten
- Die eingebauten Daten (Nachrichten, Vereine, Karte...) sind immer verfügbar
- Der KI-Assistent funktioniert nur, wenn er über Claude.ai aufgerufen wird
- Um die App zu aktualisieren: Einfach neue Dateien auf GitHub hochladen


## Probleme?

**"Die Seite wird nicht gefunden"**
→ Warte 2-3 Minuten nach dem Aktivieren von GitHub Pages
→ Prüfe die URL: https://DEIN-USERNAME.github.io/bruehl-app/

**"Zum Home-Bildschirm" fehlt**
→ Du musst Safari benutzen (nicht Chrome oder Firefox!)
→ Das Teilen-Symbol ist unten in der Mitte (⬆️)

**"Die App zeigt nur Lade..."**
→ Du brauchst Internetverbindung beim ersten Öffnen
→ Lade die Seite neu (nach unten wischen)
