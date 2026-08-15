import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

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
  assert.match(html, /150,00&nbsp;€/);
  assert.match(html, /Medizinische Fachfußpflege/);
  assert.match(html, /52,00&nbsp;€/);
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
  assert.match(html, /href="\/nisv-verordnung\.jpeg"/);

  const newTabLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(newTabLinks.length > 0);

  for (const link of newTabLinks) {
    assert.match(link, /rel="[^"]*noopener[^"]*"/);
    assert.match(link, /rel="[^"]*noreferrer[^"]*"/);
  }
});

test("renders review images with their source dimensions", () => {
  const expectedImages = [
    ["4,9 Sterne Bewertung bei Google", 403, 370],
    ["Google-Rezension 1", 415, 508],
    ["Google-Rezension 2", 417, 581],
    ["Google-Rezension 3", 426, 582],
    ["Google-Rezension 4", 418, 550],
    ["Google-Rezension 5", 421, 699],
    ["Google-Rezension 6", 425, 697],
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
