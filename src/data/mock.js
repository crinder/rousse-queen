// data/mock.js
export const menu = [
  { id: 1, name: "Burger Clásica", priceBs: 60, priceUsd: 8 },
  { id: 2, name: "Doble Queso", priceBs: 85, priceUsd: 11 },
];

export const orders = [
  {
    id: 101,
    items: ["Burger Clásica", "Papas"],
    totalBs: 75,
    totalUsd: 10,
    status: "pagada",
    operationalDate: "2026-02-22",
  },
];