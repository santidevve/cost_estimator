interface UnitMap {
  [key: string]: { type: 'weight' | 'volume' | 'count'; value: number };
}

export const UNIT_CONVERSIONS: UnitMap = {
  // Peso (base: gramo)
  g: { type: 'weight', value: 1 },
  gr: { type: 'weight', value: 1 },
  gramo: { type: 'weight', value: 1 },
  gramos: { type: 'weight', value: 1 },
  kg: { type: 'weight', value: 1000 },
  kilo: { type: 'weight', value: 1000 },
  kilos: { type: 'weight', value: 1000 },
  kilogramo: { type: 'weight', value: 1000 },
  kilogramos: { type: 'weight', value: 1000 },
  lb: { type: 'weight', value: 453.59237 },
  libra: { type: 'weight', value: 453.59237 },
  libras: { type: 'weight', value: 453.59237 },
  oz: { type: 'weight', value: 28.3495231 },
  onza: { type: 'weight', value: 28.3495231 },
  onzas: { type: 'weight', value: 28.3495231 },

  // Volumen (base: mililitro)
  ml: { type: 'volume', value: 1 },
  mililitro: { type: 'volume', value: 1 },
  mililitros: { type: 'volume', value: 1 },
  l: { type: 'volume', value: 1000 },
  lt: { type: 'volume', value: 1000 },
  litro: { type: 'volume', value: 1000 },
  litros: { type: 'volume', value: 1000 },
  gal: { type: 'volume', value: 3785.41178 },
  galon: { type: 'volume', value: 3785.41178 },
  galones: { type: 'volume', value: 3785.41178 },
  oz_fl: { type: 'volume', value: 29.5735296 },
  onza_fluida: { type: 'volume', value: 29.5735296 },
  onzas_fluidas: { type: 'volume', value: 29.5735296 },

  // Conteo (base: unidad)
  unidad: { type: 'count', value: 1 },
  unidades: { type: 'count', value: 1 },
  item: { type: 'count', value: 1 },
  items: { type: 'count', value: 1 },
  ud: { type: 'count', value: 1 },
  uds: { type: 'count', value: 1 },
  pack: { type: 'count', value: 1 },
  packs: { type: 'count', value: 1 },
  caja: { type: 'count', value: 1 },
  cajas: { type: 'count', value: 1 },
  pieza: { type: 'count', value: 1 },
  piezas: { type: 'count', value: 1 },
  pz: { type: 'count', value: 1 },
};

export function calculateIngredientCost(
  qtyUsed: number,
  unitUsed: string,
  purchaseQty: number,
  purchasePrice: number,
  purchaseUnit: string
): number {
  const normUsedUnit = unitUsed.trim().toLowerCase();
  const normPurchaseUnit = purchaseUnit.trim().toLowerCase();

  const convUsed = UNIT_CONVERSIONS[normUsedUnit];
  const convPurchase = UNIT_CONVERSIONS[normPurchaseUnit];

  // Si ambos son unidades físicas de la misma categoría (peso o volumen)
  if (convUsed && convPurchase && convUsed.type === convPurchase.type) {
    const purchaseQtyBase = purchaseQty * convPurchase.value;
    const qtyUsedBase = qtyUsed * convUsed.value;
    if (purchaseQtyBase <= 0) return 0;
    const costPerBase = purchasePrice / purchaseQtyBase;
    return qtyUsedBase * costPerBase;
  }

  // Proporción directa de respaldo (fallback)
  if (purchaseQty <= 0) return 0;
  return qtyUsed * (purchasePrice / purchaseQty);
}
