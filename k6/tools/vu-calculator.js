#!/usr/bin/env node

/**
 * k6 VU & Capacity Calculator
 * Membantu QA/Dev mengonversi metrik bisnis atau estimasi kasar menjadi konfigurasi VUs, Stages, dan Thresholds k6.
 * Menggunakan prinsip Little's Law: VUs = RPS * (Response Time + Think Time)
 */

const PRESETS = {
  1: {
    name: 'Small / Internal Testing (Aplikasi Internal / Dev Lab)',
    hourlyVisits: 600,
    requestsPerVisit: 8,
    responseTimeSec: 1.0,
    thinkTimeSec: 2.0,
    description: 'Cocok untuk server lab/dev dengan spesifikasi terbatas.'
  },
  2: {
    name: 'Medium OTA (Standar Operasional Kos / Kamar Harian)',
    hourlyVisits: 3600,
    requestsPerVisit: 10,
    responseTimeSec: 0.6,
    thinkTimeSec: 2.0,
    description: 'Estimasi ~3.600 pengunjung jam sibuk (~1 pengunjung baru per detik).'
  },
  3: {
    name: 'High Peak / Promo Campaign (Flash Sale / Promo Awal Bulan)',
    hourlyVisits: 18000,
    requestsPerVisit: 15,
    responseTimeSec: 0.5,
    thinkTimeSec: 1.5,
    description: 'Estimasi lonjakan kampanye promo kos/kamar murah.'
  }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const val = args[i + 1];
    if (key === '--visits' || key === '-v') params.hourlyVisits = parseFloat(val);
    if (key === '--reqs' || key === '-r') params.requestsPerVisit = parseFloat(val);
    if (key === '--response' || key === '-t') params.responseTimeSec = parseFloat(val);
    if (key === '--think' || key === '-k') params.thinkTimeSec = parseFloat(val);
    if (key === '--preset' || key === '-p') params.preset = parseInt(val, 10);
  }
  return params;
}

function calculate(hourlyVisits, requestsPerVisit, responseTimeSec, thinkTimeSec) {
  const totalRequestsPerHour = hourlyVisits * requestsPerVisit;
  const targetRps = totalRequestsPerHour / 3600;
  const cycleTime = responseTimeSec + thinkTimeSec;
  const calculatedVus = Math.ceil(targetRps * cycleTime);

  // Safety buffer 15% untuk variasi jaringan
  const recommendedVus = Math.ceil(calculatedVus * 1.15);

  return {
    totalRequestsPerHour,
    targetRps: parseFloat(targetRps.toFixed(2)),
    cycleTime: parseFloat(cycleTime.toFixed(2)),
    calculatedVus,
    recommendedVus,
    stressVus: Math.ceil(recommendedVus * 2.5),
    spikeVus: Math.ceil(recommendedVus * 3.5),
  };
}

function generateK6Options(res) {
  return `
// ==========================================
// HASIL REKOMENDASI OPSI STAGES k6
// ==========================================

// 1. OPSI UNTUK LOAD TEST (Normal Peak Capacity)
export const loadTestOptions = {
  stages: [
    { duration: '1m', target: ${res.recommendedVus} }, // Ramp-up ke ${res.recommendedVus} VUs
    { duration: '3m', target: ${res.recommendedVus} }, // Steady-state kapasitas puncak
    { duration: '1m', target: 0 },                    // Ramp-down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'],                  // Error rate < 1%
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'], // 95% < 1s, 99% < 2s
  },
};

// 2. OPSI UNTUK STRESS TEST (Mencari Breaking Point)
export const stressTestOptions = {
  stages: [
    { duration: '1m', target: ${res.recommendedVus} }, // Beban normal
    { duration: '2m', target: ${Math.ceil(res.recommendedVus * 1.5)} }, // Beban di atas normal
    { duration: '2m', target: ${res.stressVus} },       // Beban kritis (2.5x normal)
    { duration: '1m', target: 0 },                     // Recovery
  ],
  thresholds: {
    'http_req_failed': ['rate<0.10'],                  // Toleransi error saat stress < 10%
  },
};

// 3. OPSI UNTUK SPIKE TEST (Lonjakan Mendadak Promo/Diskon)
export const spikeTestOptions = {
  stages: [
    { duration: '15s', target: ${Math.max(1, Math.floor(res.recommendedVus * 0.2))} }, // Normal santai
    { duration: '30s', target: ${res.spikeVus} },                                       // Lonjakan mendadak! (3.5x)
    { duration: '1m', target: ${res.spikeVus} },                                        // Bertahan di puncak lonjakan
    { duration: '30s', target: ${Math.max(1, Math.floor(res.recommendedVus * 0.2))} }, // Penurunan kembali
    { duration: '15s', target: 0 },
  ],
};
`;
}

function main() {
  const args = parseArgs();
  let config = null;

  if (args.preset && PRESETS[args.preset]) {
    config = PRESETS[args.preset];
  } else if (args.hourlyVisits) {
    config = {
      name: 'Custom Parameter Input',
      hourlyVisits: args.hourlyVisits,
      requestsPerVisit: args.requestsPerVisit || 10,
      responseTimeSec: args.responseTimeSec || 0.8,
      thinkTimeSec: args.thinkTimeSec || 2.0,
      description: 'Dihitung berdasarkan parameter kustom Anda.'
    };
  } else {
    // Default jika belum tahu trafik: Tampilkan ringkasan preset
    console.log('================================================================');
    console.log('💡 PANDUAN PRAKTIS: JIKA BELUM MENGETAHUI DATA TRAFIK PASTI');
    console.log('================================================================');
    console.log('Gunakan salah satu dari 3 preset acuan industri di bawah ini:\n');

    Object.entries(PRESETS).forEach(([key, p]) => {
      const res = calculate(p.hourlyVisits, p.requestsPerVisit, p.responseTimeSec, p.thinkTimeSec);
      console.log(`[Preset ${key}] ${p.name}`);
      console.log(`  - Deskripsi          : ${p.description}`);
      console.log(`  - Asumsi Jam Sibuk   : ${p.hourlyVisits.toLocaleString()} kunjungan/jam (~${res.targetRps} RPS)`);
      console.log(`  - Rekomendasi VUs    : ${res.recommendedVus} VUs (Load), ${res.stressVus} VUs (Stress), ${res.spikeVus} VUs (Spike)\n`);
    });

    console.log('----------------------------------------------------------------');
    console.log('Cara menjalankan preset:');
    console.log('  node k6/tools/vu-calculator.js --preset 1');
    console.log('  node k6/tools/vu-calculator.js --preset 2   (Rekomendasi Dparagon OTA)');
    console.log('  node k6/tools/vu-calculator.js --preset 3');
    console.log('\nAtau masukkan parameter kustom:');
    console.log('  node k6/tools/vu-calculator.js --visits 5000 --reqs 12 --response 0.5 --think 2');
    console.log('================================================================\n');
    return;
  }

  const res = calculate(config.hourlyVisits, config.requestsPerVisit, config.responseTimeSec, config.thinkTimeSec);

  console.log('================================================================');
  console.log(`📊 PERHITUNGAN CAPACITY & VU: ${config.name}`);
  console.log('================================================================');
  console.log(`- Estimasi Sesi Jam Sibuk : ${config.hourlyVisits.toLocaleString()} sesi / jam`);
  console.log(`- Request per Sesi        : ${config.requestsPerVisit} request`);
  console.log(`- Total Beban Request/Jam : ${res.totalRequestsPerHour.toLocaleString()} request`);
  console.log(`- Target Throughput       : ${res.targetRps} RPS (Requests Per Second)`);
  console.log(`- Response Time Target    : ${config.responseTimeSec} detik`);
  console.log(`- User Think Time         : ${config.thinkTimeSec} detik`);
  console.log(`- Pacing (Cycle Time)     : ${res.cycleTime} detik`);
  console.log('----------------------------------------------------------------');
  console.log(`🎯 REKOMENDASI VIRTUAL USERS (VUs):`);
  console.log(`  • Load Test Normal      : ${res.recommendedVus} VUs`);
  console.log(`  • Stress Test           : ${res.stressVus} VUs`);
  console.log(`  • Spike Test            : ${res.spikeVus} VUs`);
  console.log('----------------------------------------------------------------');
  console.log(generateK6Options(res));
}

main();
