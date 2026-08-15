# Teslime.de

Website des Studios für Kosmetik und medizinische Fachfußpflege Teslime Schuster. Die Seite ist eine statisch erzeugte Astro-Anwendung ohne clientseitiges UI-Framework.

## Voraussetzungen

- Node.js 24 LTS (einschließlich npm)

Die verwendete Node-Version steht zusätzlich in `.nvmrc`. Mit nvm genügt im Projektordner:

```sh
nvm use
```

## Installation

Für eine reproduzierbare Installation aus dem Lockfile:

```sh
npm ci
```

## Lokal im Browser ausführen

```sh
npm run dev
```

Anschließend ist die Website standardmäßig unter [http://localhost:4321](http://localhost:4321) erreichbar. `npm start` ist ein Alias für denselben Entwicklungsserver.

## Google Maps

Die eingebettete Karte verwendet optional `PUBLIC_GOOGLE_MAPS_API_KEY`. Lokal kann der Wert in einer nicht versionierten `.env`-Datei hinterlegt werden:

```dotenv
PUBLIC_GOOGLE_MAPS_API_KEY=example-key
```

Ohne Schlüssel zeigt die Kontaktsektion stattdessen einen normalen Link zu Google Maps. Da der Schlüssel in das statische HTML eingebettet wird, muss er in Google Cloud auf die verwendete Domain eingeschränkt werden.

## Befehle

```sh
npm run check    # Astro- und TypeScript-Diagnosen
npm run build    # statische Produktionsdateien in dist/ erzeugen
npm test         # bauen und die generierte Seite prüfen
npm run verify   # vollständige lokale/CI-Prüfung
npm run preview  # den letzten Produktions-Build lokal anzeigen
```

## Projektstruktur

- `src/pages/` enthält den Einstiegspunkt der Website.
- `src/layouts/` enthält die HTML-Dokumenthülle.
- `src/components/` enthält Layout-, Inhalts- und wiederverwendbare Komponenten.
- `src/data/` enthält gemeinsame Kontakt- und Navigationsdaten.
- `src/images/` enthält alle von Astro optimierten Bilder.
- `src/styles/` enthält die wenigen globalen Grundlagen.
- `tests/` prüft das generierte HTML ohne zusätzliche Testbibliothek.

## Produktion und Deployment

`npm run build` erzeugt die vollständige statische Website in `dist/`. Pushes auf `main` werden durch `.github/workflows/main.yml` mit Node.js 24 geprüft, gebaut und anschließend per FTP zu Netcup übertragen. Die Zugangsdaten und der optionale Maps-Schlüssel werden als GitHub-Secrets verwaltet.
