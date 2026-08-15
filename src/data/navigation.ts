export interface NavigationItem {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Bereich Kosmetik",
    items: [
      { label: "NiSV-VERORDNUNG", href: "/nisv-verordnung.jpeg", newTab: true },
      {
        label: "Bildbasierte Hautanalyse (ich liebe dieses Gerät)",
        href: "#scroll-hautanalyse",
      },
      {
        label: "Hydra-Face-Gesichtsbehandlung",
        href: "#scroll-gesicht",
      },
      {
        label: "Facelifting mit Spezialultraschall",
        href: "#scroll-facelifting",
      },
      {
        label: "Microneedling – mit und ohne Radiofrequenz",
        href: "#scroll-microneedling",
      },
      { label: "Maniküre", href: "#scroll-manikuere" },
      { label: "Shellac", href: "#scroll-shellac" },
      { label: "Wimpernlifting", href: "#scroll-augen" },
      { label: "Massagen", href: "#scroll-massagen" },
      {
        label: "Dauerhafte Haarentfernung mit Diodenlaser",
        href: "#scroll-haare-diode",
      },
      {
        label: "Haarentfernung mit Wachs",
        href: "#scroll-haare-wachs",
      },
    ],
  },
  {
    label: "Bereich Fußpflege",
    items: [
      { label: "Med. Fachfußpflege", href: "#scroll-fuss" },
      { label: "Nagelpilz", href: "#scroll-fuss-nagelpilz" },
      {
        label: "Eingewachsene Nägel – Nagelspangen",
        href: "#scroll-fuss-eingewachsen",
      },
    ],
  },
  {
    label: "Sonstiges",
    items: [
      {
        label: "Geschenkgutscheine für Ihre Liebsten",
        href: "#scroll-gutscheine",
      },
      { label: "Google-Rezensionen", href: "#scroll-rezensionen" },
      { label: "Kontakt", href: "#scroll-kontakt" },
    ],
  },
];
