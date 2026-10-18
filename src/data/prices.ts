// Keep display strings explicit: ranges, per-item prices and discounts are intentional.
export interface PriceItem {
  description: readonly string[];
  price: string;
  duration?: string;
  note?: string;
}

export const prices = {
  footCareExtras: [
    {
      description: [
        "Fußreflexzonenmassage,",
        "nach Hanne Marquardt"
      ],
      price: "45,00 €",
      duration: "ca. 30 min"
    },
    { description: ["Relax-/Wellnessfußmassage"], price: "23,00 €", duration: "ca. 15 min" },
    {
      description: ["Hühneraugen entfernen"],
      price: "je 10,00 €",
      note: ", zwei und mehr"
    },
    { description: ["Nägel lackieren"], price: "10,00 €" }
  ],
  nailFungus: [
    { description: ["Mittlerer und schwerer Pilzbefall"], price: "10,00 €" }
  ],
  manicure: [
    {
      description: [
        "Beurteilung der Haut und Nägel",
        "Naturnägel formen",
        "Nagelbad",
        "Nagelhautpflege",
        "Abschlusscreme"
      ],
      price: "35,00 €"
    },
    { description: ["Nägel lackieren"], price: "10,00 €" }
  ],
  shellac: [
    { description: ["Maniküre + Shellac-Lackierung"], price: "50,00 €" },
    { description: ["Shellac-Lackierung"], price: "25,00 €" }
  ],
  lashExtras: [
    { description: ["Augenbrauen korrigieren"], price: "15,00 €" },
    { description: ["Augenbrauen färben"], price: "12,00 €" },
    { description: ["Wimpern färben"], price: "13,00 €" }
  ],
  massage: [
    { description: ["Klassische Körpermassage"], price: "76,00 €", duration: "ca. 60 min" },
    { description: ["Rückenmassage + Arme und Hände"], price: "45,00 €", duration: "ca. 30 min" },
    { description: ["Hot-Stone-Massage"], price: "80,00 €", duration: "ca. 60 min" },
    { description: ["Ayurvedische Ganzkörpermassage"], price: "76,00 €", duration: "ca. 60 min" }
  ],
  laserIndividual: [
    { description: ["Oberlippe oder Kinn oder Wangen"], price: "25,00 €" },
    { description: ["Hals oder Nacken"], price: "40,00 €" },
    { description: ["Achseln"], price: "35,00 €" },
    { description: ["Bikinizone oder Intimzone (nur Damen)"], price: "45,00 €" },
    { description: ["Unterarme oder Oberarme"], price: "50,00 €" },
    { description: ["Rücken, oberer oder unterer Bereich"], price: "50,00 €" },
    { description: ["Brust oder Bauch"], price: "50,00 €" },
    { description: ["Beine, Unterschenkel"], price: "85,00 €" },
    { description: ["Beine, Oberschenkel"], price: "100,00 €" }
  ],
  laserSmallPackages: [
    { description: ["Gesicht komplett"], price: "60,00 €" },
    { description: ["Arme komplett"], price: "90,00 €" },
    { description: ["Rücken komplett"], price: "90,00 €" },
    { description: ["Brust + Bauch komplett"], price: "90,00 €" },
    { description: ["Beine komplett"], price: "170,00 €" },
    { description: ["Bikinizone + Intimzone (nur Damen)"], price: "85,00 €" }
  ],
  laserLargePackages: [
    {
      description: [
        "Achseln,",
        "Bikinizone + Intimzone (nur Damen),",
        "Beine, Unterschenkel"
      ],
      price: "170,00 €"
    },
    {
      description: [
        "Achseln,",
        "Bikinizone + Intimzone (nur Damen),",
        "Beine komplett"
      ],
      price: "230,00 €"
    },
    {
      description: [
        "mindestens drei Einzelbehandlungen",
        "von jeweils 50\u00a0€ und mehr,",
        "nach eigener Wahl"
      ],
      price: "20 % Ermäßigung"
    }
  ],
  waxing: [
    { description: ["Oberlippe oder Kinn"], price: "je 10,00 €" },
    { description: ["Gesicht komplett"], price: "25,00 €" },
    { description: ["Beine bis zum Knie"], price: "35,00 €" },
    { description: ["Beine komplett"], price: "50,00 €" },
    { description: ["Achseln"], price: "15,00 €" },
    { description: ["Bikinizone (nur Damen)"], price: "20,00 €" },
    { description: ["Rücken oder Brust"], price: "35–45,00 €" }
  ]
} as const satisfies Record<string, readonly PriceItem[]>;

export const treatments = {
  skinAnalysis: { price: "50,00\u00a0€" },
  facelift: { price: "600,00\u00a0€" },
  lashLifting: { price: "60,00\u00a0€" },
  nailBrace: { price: "je Nagel 40,00\u00a0€" },
  footCare: {
    duration: "ca. 45 min",
    price: "52,00\u00a0€"
  },
  hydraFace: {
    duration: "ca. 90 min",
    price: "150,00\u00a0€"
  },
  classicFacial: {
    duration: "ca. 90 min",
    price: "105,00\u00a0€"
  },
  deepCleansing: {
    duration: "ca. 60 min",
    price: "75,00\u00a0€"
  },
  microneedling: {
    duration: "ca. 60 min",
    price: "140,00\u00a0€"
  },
  goldMicroneedling: {
    duration: "ca. 90 min",
    price: "230,00\u00a0€"
  }
} as const satisfies Record<string, { price: string; duration?: string }>;

export const removalFees = {
  polish: "5\u00a0€",
  shellac: "10\u00a0€",
} as const;
