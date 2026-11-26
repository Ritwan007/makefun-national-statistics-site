/* NusaStatistik data: every figure below is a published Badan Pusat Statistik
   (BPS) figure. Each series carries its source and the year it refers to, and
   every view prints the source next to the figure. No figure here is a guess. */
"use strict";

var NUSA = {
  meta: {
    country: "Indonesia",
    sourceName: "Badan Pusat Statistik (BPS)",
    sourceShort: "BPS",
    note: "Angka-angka di situs ini adalah angka resmi yang dipublikasikan BPS. Tahun yang tertulis adalah tahun rujukan data, bukan tahun publikasi."
  },

  /* Mid-year population, million people. BPS, Proyeksi Penduduk. */
  population: {
    label: "Jumlah penduduk (pertengahan tahun)",
    unit: "juta jiwa",
    source: "BPS, Proyeksi Penduduk 2020\u20132024",
    years: [2020, 2021, 2022, 2023, 2024],
    values: [270.20, 272.68, 275.77, 278.70, 281.60],
    growth2024: 1.04,
    growthSource: "BPS, 2024",
    density2024: 149,
    densityNote: "Dihitung dari penduduk 281,60 juta jiwa dibagi luas daratan 1.890.179,78 km\u00b2 (BPS, 2024).",
    landKm2: "1.890.179,78",
    islands: "17.380"
  },

  /* Largest provinces, Population Census 2020 (Sensus Penduduk 2020, BPS). */
  provinces: {
    label: "Penduduk menurut provinsi (10 terbesar)",
    source: "BPS, Sensus Penduduk 2020",
    rows: [
      { name: "Jawa Barat", pop: 48.27, share: 17.88 },
      { name: "Jawa Timur", pop: 40.67, share: 15.06 },
      { name: "Jawa Tengah", pop: 36.52, share: 13.52 },
      { name: "Sumatera Utara", pop: 14.80, share: 5.48 },
      { name: "Banten", pop: 11.90, share: 4.41 },
      { name: "DKI Jakarta", pop: 10.56, share: 3.91 },
      { name: "Sulawesi Selatan", pop: 9.07, share: 3.36 },
      { name: "Lampung", pop: 9.01, share: 3.34 },
      { name: "Sumatera Selatan", pop: 8.47, share: 3.14 },
      { name: "Riau", pop: 6.39, share: 2.37 }
    ]
  },

  /* GDP at current prices, trillion rupiah. BPS, Berita Resmi Statistik. */
  gdp: {
    label: "Produk Domestik Bruto (harga berlaku)",
    unit: "triliun rupiah",
    source: "BPS, Berita Resmi Statistik PDB 2024",
    years: [2020, 2021, 2022, 2023, 2024],
    nominal: [15434.2, 16970.8, 19588.5, 20892.3, 22139.0],
    growth: [-2.07, 3.70, 5.31, 5.05, 5.03],
    perCapitaIdr: { 2024: "78,6 juta" },
    perCapitaUsd: { 2024: "4.960,3" },
    perCapitaSource: "BPS, 2024"
  },

  /* Trade, 2024. BPS. */
  trade: {
    label: "Perdagangan luar negeri 2024",
    source: "BPS, 2024",
    exportsUsdBn: 264.70,
    importsUsdBn: 233.66,
    surplusUsdBn: 31.04,
    exchangeRate2024: "15.847",
    exchangeNote: "Rata-rata kurs rupiah terhadap dolar AS, 2024 (BPS)."
  },

  /* Consumer-price inflation, year-on-year in December. BPS. */
  inflation: {
    label: "Inflasi tahunan (year-on-year, Desember)",
    unit: "persen",
    source: "BPS, Berita Resmi Statistik Inflasi",
    years: [2020, 2021, 2022, 2023, 2024],
    values: [1.68, 1.87, 5.51, 2.61, 1.57]
  },

  /* Open unemployment rate, August. BPS, Sakernas. */
  unemployment: {
    label: "Tingkat Pengangguran Terbuka (TPT), Agustus",
    unit: "persen",
    source: "BPS, Sakernas Agustus 2024",
    years: [2020, 2021, 2022, 2023, 2024],
    values: [7.07, 6.49, 5.86, 5.32, 4.91],
    unemployedM: 7.47,
    workingAgeM: 215.37,
    informalShare: 57.95,
    informalSource: "BPS, 2024",
    byProvince: {
      label: "TPT menurut provinsi, Agustus 2024",
      source: "BPS, Sakernas Agustus 2024",
      highest: [
        { name: "Jawa Barat", value: 6.75 },
        { name: "Banten", value: 6.68 },
        { name: "Papua Pegunungan", value: 6.48 }
      ],
      lowest: [
        { name: "Bali", value: 1.32 },
        { name: "Sulawesi Barat", value: 1.79 },
        { name: "Papua Barat Daya", value: 2.68 }
      ]
    }
  },

  /* Poverty, March series plus September 2024. BPS. */
  poverty: {
    label: "Persentase penduduk miskin (Maret)",
    unit: "persen",
    source: "BPS, Berita Resmi Statistik Kemiskinan",
    years: [2020, 2021, 2022, 2023, 2024],
    march: [9.78, 10.14, 9.54, 9.36, 9.03],
    september2024: 8.57,
    septemberNote: "September 2024: 8,57%, terendah sepanjang sejarah pencatatan (BPS).",
    giniMarch2024: 0.379,
    giniSource: "BPS, Maret 2024"
  },

  /* Human Development Index and components. BPS, Berita Resmi Statistik IPM. */
  hdi: {
    label: "Indeks Pembangunan Manusia (IPM)",
    source: "BPS, Berita Resmi Statistik IPM 2024",
    years: [2022, 2023, 2024],
    values: [73.77, 74.39, 75.02],
    components2024: [
      { name: "Umur Harapan Hidup (UHH) saat lahir", value: "74,15 tahun" },
      { name: "Harapan Lama Sekolah (HLS)", value: "13,21 tahun" },
      { name: "Rata-rata Lama Sekolah (RLS)", value: "8,85 tahun" },
      { name: "Pengeluaran riil per kapita per tahun (disesuaikan)", value: "Rp12,34 juta" }
    ]
  },

  /* Latest releases shown on the home page. */
  releases: [
    { date: "5 Nov 2026", title: "IPM Indonesia 2026 mencapai 76,59", source: "BPS" },
    { date: "5 Feb 2026", title: "Ekonomi Indonesia 2025 tumbuh 5,11%; PDB Rp23.821,1 triliun", source: "BPS" },
    { date: "15 Jan 2025", title: "Persentase penduduk miskin September 2024: 8,57%", source: "BPS" },
    { date: "5 Feb 2025", title: "Ekonomi Indonesia 2024 tumbuh 5,03%; PDB Rp22.139,0 triliun", source: "BPS" },
    { date: "15 Nov 2024", title: "IPM Indonesia 2024 mencapai 75,02", source: "BPS" }
  ]
};
