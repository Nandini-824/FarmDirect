import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import localPrices from '../data/marketPrices.json';

const QUINTAL_TO_KG = 100;

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findCropMatch(cropName) {
  if (!cropName?.trim()) return null;
  const normalized = normalizeName(cropName);

  let match = localPrices.find((p) => normalizeName(p.commodity) === normalized);
  if (match) return match;

  match = localPrices.find((p) => {
    const commodity = normalizeName(p.commodity);
    return commodity.includes(normalized) || normalized.includes(commodity.split('(')[0]);
  });
  if (match) return match;

  const aliases = {
    tomato: 'Tomato',
    onion: 'Onion',
    potato: 'Potato',
    wheat: 'Wheat',
    rice: 'Paddy(Common)',
    paddy: 'Paddy(Common)',
    maize: 'Maize',
    corn: 'Maize',
    gram: 'Bengal Gram(Gram)(Whole)',
    moong: 'Green Gram(Moong)(Whole)',
    urad: 'Black Gram(Urd Beans)(Whole)',
    mustard: 'Mustard',
    groundnut: 'Groundnut',
    peanut: 'Groundnut',
    soybean: 'Soyabean',
    soyabean: 'Soyabean',
    cotton: 'Cotton',
    barley: 'Barley(Jau)',
    bajra: 'Bajra(Pearl Millet/Cumbu)',
    jowar: 'Jowar(Sorghum)',
    ragi: 'Ragi(Finger Millet)',
    tur: 'Red gram/Arhar/Tur(whole)',
    arhar: 'Red gram/Arhar/Tur(whole)',
    masur: 'Lentil(Masur)(Whole)',
    lentil: 'Lentil(Masur)(Whole)',
  };

  const aliasKey = Object.keys(aliases).find((k) => normalized.includes(k));
  if (aliasKey) {
    return localPrices.find((p) => p.commodity === aliases[aliasKey]);
  }

  return null;
}

export function getPricePerKg(quintalPrice) {
  if (!quintalPrice && quintalPrice !== 0) return null;
  return quintalPrice / QUINTAL_TO_KG;
}

export function getMarketPriceComparison(cropName, farmerPricePerKg) {
  const match = findCropMatch(cropName);

  if (!match) {
    return {
      found: false,
      message: 'Market Price Not Available',
    };
  }

  const marketPricePerKg = getPricePerKg(match.priceToday);
  const mspPerKg = match.msp ? getPricePerKg(match.msp) : null;
  const farmerPrice = parseFloat(farmerPricePerKg) || 0;
  const difference = farmerPrice - marketPricePerKg;
  const percentOfMarket = marketPricePerKg > 0 ? (farmerPrice / marketPricePerKg) * 100 : 0;

  let status, recommendation, emoji;
  if (percentOfMarket >= 95) {
    status = 'good';
    recommendation = 'Good Price – Recommended to Sell';
    emoji = '🟢';
  } else if (percentOfMarket >= 80) {
    status = 'fair';
    recommendation = 'Slightly Below Market Price';
    emoji = '🟡';
  } else {
    status = 'low';
    recommendation = 'Price Too Low – Increase selling price';
    emoji = '🔴';
  }

  const suggestedPrice = marketPricePerKg * 0.98;

  return {
    found: true,
    cropName: match.commodity,
    category: match.commodityGroup,
    marketPricePerKg: marketPricePerKg.toFixed(2),
    mspPerKg: mspPerKg ? mspPerKg.toFixed(2) : 'N/A',
    farmerPrice: farmerPrice.toFixed(2),
    difference: difference.toFixed(2),
    suggestedPrice: suggestedPrice.toFixed(2),
    status,
    recommendation,
    emoji,
    date: match.date,
    arrivalToday: match.arrivalToday,
  };
}

export async function seedMarketPricesToFirestore() {
  const snap = await getDocs(collection(db, 'marketPrices'));
  if (!snap.empty) return { seeded: false, count: snap.size };

  const batch = localPrices.map((p) =>
    setDoc(doc(collection(db, 'marketPrices')), {
      cropName: p.commodity,
      category: p.commodityGroup,
      msp: p.msp,
      marketPriceToday: p.priceToday,
      previousPrices: p.pricePrevious,
      arrivalQuantity: p.arrivalToday,
      date: p.date,
      createdAt: new Date().toISOString(),
    }),
  );

  await Promise.all(batch);
  return { seeded: true, count: localPrices.length };
}

export async function getMarketPriceFromFirestore(cropName) {
  const snap = await getDocs(collection(db, 'marketPrices'));
  const prices = snap.docs.map((d) => d.data());
  const normalized = normalizeName(cropName);

  const match = prices.find((p) => {
    const name = normalizeName(p.cropName || '');
    return name === normalized || name.includes(normalized) || normalized.includes(name);
  });

  if (!match) return getMarketPriceComparison(cropName, 0);

  const marketPricePerKg = getPricePerKg(match.marketPriceToday);
  return {
    found: true,
    cropName: match.cropName,
    category: match.category,
    marketPricePerKg: marketPricePerKg.toFixed(2),
    mspPerKg: match.msp ? getPricePerKg(match.msp).toFixed(2) : 'N/A',
  };
}

export function getAllMarketPrices() {
  return localPrices;
}
