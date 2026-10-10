# 1daily AG – Website

Statische, zweisprachige Website (Deutsch / Englisch) ohne Build-Schritt. Läuft direkt auf **GitHub Pages**.

## Struktur

```
/                         Deutsch (Standard)
  index.html              Startseite mit 3D-Globus
  vision.html             Vision & Philosophie
  ueber-uns.html          Über uns
  investor-relations.html Investor Relations + Formular
  kontakt.html            Kontakt + Formular + Impressum
  datenschutz.html        Datenschutzerklärung
/en/                      Englisch (index, vision, about, investor-relations, contact, privacy)
/assets/css/style.css     Gesamtes Design
/assets/js/config.js      ← HIER Formspree-IDs und E-Mail-Adressen eintragen
/assets/js/main.js        Menü, Sprachwahl, Formulare
/assets/js/globe.js       3D-Globus (Gold-Futures-Börsen)
/assets/fonts/            Plus Jakarta Sans, lokal gehostet (kein Google Fonts)
404.html, robots.txt, .nojekyll
```

## Veröffentlichen auf GitHub Pages

1. Neues Repository erstellen (z. B. `1daily-website`) und **den Inhalt dieses Ordners** ins Hauptverzeichnis hochladen (nicht den Ordner selbst).
2. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, Ordner `/ (root)` → Save.
3. Eigene Domain: unter *Settings → Pages → Custom domain* eintragen (GitHub legt die Datei `CNAME` an) und beim Domain-Anbieter die DNS-Einträge gemäss GitHub-Anleitung setzen. **Enforce HTTPS** aktivieren.

Hinweis: Die Seite `404.html` verwendet absolute Pfade (`/assets/…`) und funktioniert korrekt mit eigener Domain. Alle anderen Seiten nutzen relative Pfade und laufen auch unter `benutzer.github.io/repo/`.

## Formulare aktivieren (Formspree)

1. Konto auf https://formspree.io erstellen (Gratis-Plan: 50 Einsendungen/Monat).
2. Zwei Formulare anlegen: «Investoren» und «Kontakt». Empfänger-E-Mail festlegen.
3. Die Formular-ID (der Teil nach `/f/` in der Formspree-URL) in `assets/js/config.js` eintragen:
   ```js
   formspreeInvestor: "abcdwxyz",
   formspreeContact:  "efghijkl",
   ```
4. In Formspree unter *Settings* die eigene Domain als erlaubte Domain eintragen.

Eingebaut: Pflichtfelder, Spam-Schutz (Honeypot `_gotcha`), Erfolgsmeldung ohne Seitenwechsel, Sprache der Einsendung (`_language`).

## E-Mail-Adressen

In `assets/js/config.js` `emailInfo` und `emailInvestors` eintragen. Solange leer, werden die Felder auf der Kontaktseite ausgeblendet.

## Sprache

- Deutsch ist Standard. Browser ohne Deutsch in den Spracheinstellungen werden beim ersten Besuch automatisch auf `/en/` geleitet.
- Umschalter DE/EN im Footer und im mobilen Menü; die Wahl wird im Browser gespeichert und hat Vorrang.
- Suchmaschinen werden nicht umgeleitet; `hreflang`-Angaben verknüpfen die Sprachversionen.

## Vor dem Livegang (Checkliste)

- [ ] Formspree-IDs und E-Mail-Adressen in `config.js`
- [ ] Porträt Ivan Schmid einsetzen (`ueber-uns.html` / `en/about.html`, Element `.portrait`)
- [ ] Titel im Handelsregister prüfen (Impressum: derzeit «Verwaltungsrat»)
- [ ] Texte, Risikohinweis und Datenschutzerklärung anwaltlich prüfen lassen
- [ ] Nach Domain-Festlegung: `sitemap.xml` ergänzen und in `robots.txt` verlinken
