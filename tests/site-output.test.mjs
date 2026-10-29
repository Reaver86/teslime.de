import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";
import { prices, treatments, removalFees } from "../src/data/prices.ts";

const basePath = (process.env.BASE_PATH ?? "/").replace(/\/$/, "");

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

const plainText = (value) => value
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

test("renders the German document metadata", () => {
  assert.match(html, /<html[^>]+lang="de"/);
  assert.match(html, /<title>Teslime Kosmetik und medizinische Fachfußpflege<\/title>/);

  const descriptions = html.match(/<meta[^>]+name="description"[^>]*>/g) ?? [];
  assert.equal(descriptions.length, 1);
  assert.doesNotMatch(descriptions[0], /Astro description/);
});

test("renders every major public section", () => {
  const expectedIds = [
    "scroll-hautanalyse",
    "scroll-gesicht",
    "scroll-facelifting",
    "scroll-microneedling",
    "scroll-manikuere",
    "scroll-shellac",
    "scroll-augen",
    "scroll-massagen",
    "scroll-haare-diode",
    "scroll-haare-wachs",
    "scroll-fuss",
    "scroll-fuss-nagelpilz",
    "scroll-fuss-eingewachsen",
    "scroll-gutscheine",
    "scroll-rezensionen",
    "scroll-kontakt",
  ];

  for (const id of expectedIds) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test("keeps the established navigation, treatments, and representative prices", () => {
  for (const label of ["Bereich Kosmetik", "Bereich Fußpflege", "Sonstiges"]) {
    assert.match(html, new RegExp(`>${label}<`));
  }

  assert.match(html, /Hydra-Face-Luxusbehandlung/);
  assert.match(html, /150,00(?:&nbsp;|\u00a0)€/);
  assert.match(html, /Medizinische Fachfußpflege/);
  assert.match(html, /52,00(?:&nbsp;|\u00a0)€/);
  assert.match(html, /0176-62157680/);
});

test("uses unique IDs and resolves every internal page link", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);

  const idSet = new Set(ids);
  const fragmentLinks = [...html.matchAll(/\bhref="#([^"]+)"/g)].map(
    (match) => match[1],
  );

  for (const fragment of fragmentLinks) {
    assert.ok(idSet.has(fragment), `Missing target for #${fragment}`);
  }
});

test("keeps important external links and protects new tabs", () => {
  assert.match(html, /href="https:\/\/wa\.me\/4917662157680"/);
  assert.match(html, /href="mailto:teslime\.schuster@gmail\.com"/);
  assert.ok(html.includes(`href="${basePath}/nisv-verordnung.jpeg"`));
  assert.ok(html.includes(`href="${basePath}/favicon.svg"`));

  const newTabLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(newTabLinks.length > 0);

  for (const link of newTabLinks) {
    assert.match(link, /rel="[^"]*noopener[^"]*"/);
    assert.match(link, /rel="[^"]*noreferrer[^"]*"/);
  }
});

test("renders review images with their source dimensions", () => {
  const expectedImages = [
    ["Google-Bewertung: 4,8 Sterne bei 46 Rezensionen und Rezension von Beyza Butun", 446, 719],
    ["Google-Rezensionen von Annette Flaig und Gabi S.", 446, 813],
    ["Google-Rezension von Anna „Annalina“", 446, 581],
    ["Google-Rezension von Claudia Kaiser", 446, 414],
  ];
  const imageTags = html.match(/<img\b[^>]*>/g) ?? [];

  for (const [alt, width, height] of expectedImages) {
    const imageTag = imageTags.find((tag) => tag.includes(`alt="${alt}"`));

    assert.ok(imageTag, `Missing review image with alt text: ${alt}`);
    assert.match(imageTag, new RegExp(`\\bwidth="${width}"`));
    assert.match(imageTag, new RegExp(`\\bheight="${height}"`));
  }
});

test("does not emit stale placeholders or approved typos", () => {
  assert.doesNotMatch(html, /key=undefined/);
  assert.doesNotMatch(
    html,
    /Klassiche|Genzkörper|Gangkörper|Reperaturkräfte|Schutzkreme|Ermässigung|Ergenbis|sien kann|start unterstützt|sicher zu stellen|darauf folgenden|Fachfusspflegerin|\bFuss\b|\bFusspflege\b|\bFachfusspflege\b|WhatsApp Nachricht|Empfohlen für:\s*für|ggfs\./,
  );
});

test("renders the complete price catalogue with descriptions and durations", () => {
  const rows = [...html.matchAll(/<div class="price-row"[^>]*>(.*?)<\/div><\/div>/gs)]
    .map((match) => plainText(match[1]));
  const entries = Object.values(prices).flat();
  assert.equal(rows.length, entries.length, "Every catalogue row must render once");

  for (const entry of entries) {
    assert.ok(entry.description.length && entry.description.every((line) => line.trim()));
    assert.ok(entry.price.trim());
    const expected = plainText([
      ...entry.description, entry.note, entry.duration, entry.price,
    ].filter(Boolean).join(" "));
    const index = rows.indexOf(expected);
    assert.notEqual(index, -1, `Missing or mismatched price row: ${expected}`);
    rows.splice(index, 1);
  }

  const text = plainText(html);
  for (const { price, duration } of Object.values(treatments)) {
    assert.ok(text.includes(plainText([duration, price].filter(Boolean).join(" "))));
  }
  for (const fee of Object.values(removalFees)) assert.ok(text.includes(plainText(fee)));
});

test("ships every local HTML and stylesheet asset", async () => {
  const dist = new URL("../dist/", import.meta.url);
  const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  const files = await readdir(dist, { recursive: true });
  for (const file of files.filter((file) => file.endsWith(".css"))) {
    const css = await readFile(new URL(file, dist), "utf8");
    for (const match of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
      const url = new URL(match[1], `https://build.test${basePath}/${file}`);
      if (url.origin === "https://build.test") references.push(url.pathname);
    }
  }
  for (const reference of new Set(references)) {
    if (reference.startsWith("#") || /^(?:[a-z]+:|\/\/)/i.test(reference)) continue;
    const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
    assert.ok(pathname.startsWith(`${basePath}/`), `Asset escapes site base: ${pathname}`);
    const path = pathname.slice(basePath.length + 1);
    assert.ok((await stat(new URL(path, dist))).isFile(), `Missing build asset: ${path}`);
  }
});

test("resolves accessible labels and menu controls", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/\baria-(?:labelledby|controls)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert.ok(ids.has(id), `Missing ARIA target: ${id}`);
  }
  assert.match(html, /aria-expanded="false"/);
});
