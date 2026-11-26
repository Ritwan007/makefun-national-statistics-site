/* views.js — one job: build the HTML of each page from the data in data.js.
   Every figure is printed with its source and year. */
"use strict";

function fmtId(v, dec) {
  var s = dec === undefined ? String(v) : Number(v).toFixed(dec);
  var parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function srcLine(source) {
  return '<p class="src">Sumber: ' + esc(source) + '</p>';
}

function kpi(value, label, source) {
  return '<div class="kpi"><div class="kpi-v">' + value + '</div><div class="kpi-l">' + label + '</div><div class="kpi-s">' + esc(source) + '</div></div>';
}

function yearOptions(selected) {
  return [2020, 2021, 2022, 2023, 2024].map(function (y) {
    return '<option value="' + y + '"' + (y === selected ? ' selected' : '') + '>' + y + '</option>';
  }).join("");
}

function yearPicker(year) {
  return '<label class="yearpick">Tahun data <select id="yearSel" aria-label="Pilih tahun data">' + yearOptions(year) + '</select></label>';
}

function idxOf(arr, y) { return arr.indexOf(y); }

/* ---------- Beranda ---------- */
function viewHome(year) {
  var p = NUSA.population, g = NUSA.gdp, inf = NUSA.inflation,
      u = NUSA.unemployment, pov = NUSA.poverty;
  var i = idxOf(p.years, year);
  var povVal = year === 2024 ? fmtId(pov.march[4], 2) + "%" : fmtId(pov.march[i], 2) + "%";
  var html = '<section class="hero"><h1>Angka Indonesia,<br>satu tempat.</h1>'
    + '<p class="lede">NusaStatistik merangkum angka-angka resmi Indonesia &mdash; penduduk, ekonomi, harga, pekerjaan, dan kesejahteraan &mdash; dari publikasi Badan Pusat Statistik (BPS), lengkap dengan sumber dan tahunnya.</p>'
    + '<div class="hero-row">' + yearPicker(year)
    + '<a class="btn" href="#/penduduk">Jelajahi data penduduk &rarr;</a></div></section>'
    + '<section><h2>Indonesia pada ' + year + '</h2><div class="kpis">'
    + kpi(fmtId(p.values[i], 2), "Jumlah penduduk (juta jiwa)", p.source)
    + kpi(fmtId(g.nominal[i], 1), "PDB harga berlaku (Rp triliun)", g.source)
    + kpi(fmtId(g.growth[i], 2) + "%", "Pertumbuhan ekonomi", g.source)
    + kpi(fmtId(inf.values[i], 2) + "%", "Inflasi (Des, yoy)", inf.source)
    + kpi(fmtId(u.values[i], 2) + "%", "Pengangguran terbuka (Agu)", u.source)
    + kpi(povVal, "Penduduk miskin (Maret)", pov.source)
    + '</div>'
    + '<p class="note">Pilih tahun di atas: keenam kartu ikut berubah. Seri lengkap tiap indikator ada di halamannya masing-masing.</p></section>'
    + '<section class="grid2"><div class="card"><h3>Jumlah penduduk 2020&ndash;2024</h3>'
    + lineChart(p.years, p.values, { title: "Jumlah penduduk, juta jiwa", highlight: year })
    + srcLine(p.source) + '</div>'
    + '<div class="card"><h3>Pertumbuhan ekonomi 2020&ndash;2024</h3>'
    + growthBars(g.years, g.growth, { title: "Pertumbuhan PDB, % per tahun", highlight: year })
    + srcLine(g.source) + '</div></section>'
    + '<section><h2>Rilis terbaru</h2><ul class="releases">'
    + NUSA.releases.map(function (r) {
      return '<li><span class="rel-date">' + esc(r.date) + '</span><span class="rel-title">' + esc(r.title) + '</span><span class="rel-src">' + esc(r.source) + '</span></li>';
    }).join("")
    + '</ul></section>'
    + '<section><h2>Provinsi terpadat</h2><p>Lima provinsi dengan penduduk terbanyak menurut Sensus Penduduk 2020:</p><ol class="toplist">'
    + NUSA.provinces.rows.slice(0, 5).map(function (r) {
      return '<li><span>' + esc(r.name) + '</span><b>' + fmtId(r.pop, 2) + ' jt jiwa</b></li>';
    }).join("")
    + '</ol><p><a href="#/penduduk">Lihat semua provinsi &rarr;</a></p>' + srcLine(NUSA.provinces.source) + '</section>';
  return html;
}

/* ---------- Penduduk ---------- */
function viewPenduduk(year) {
  var p = NUSA.population, prov = NUSA.provinces;
  var i = idxOf(p.years, year);
  var html = '<section class="hero slim"><h1>Penduduk</h1>'
    + '<p class="lede">Berapa banyak penduduk Indonesia, di mana mereka tinggal, dan seberapa cepat jumlahnya bertambah.</p>'
    + '<div class="hero-row">' + yearPicker(year) + '</div></section>'
    + '<section><div class="kpis">'
    + kpi(fmtId(p.values[i], 2), "Penduduk " + year + " (juta jiwa)", p.source)
    + kpi(fmtId(p.growth2024, 2) + "%", "Laju pertumbuhan 2024", p.growthSource)
    + kpi(String(p.density2024), "Kepadatan penduduk 2024 (jiwa/km&sup2;)", "BPS, 2024 (dihitung)")
    + kpi(p.islands, "Jumlah pulau", "BPS, 2024")
    + '</div><p class="note">' + esc(p.densityNote) + ' Luas daratan ' + esc(p.landKm2) + ' km&sup2;.</p></section>'
    + '<section class="card"><h2>Pertumbuhan penduduk 2020&ndash;2024</h2>'
    + lineChart(p.years, p.values, { title: "Jumlah penduduk, juta jiwa", highlight: year })
    + srcLine(p.source) + '</section>'
    + '<section class="card"><h2>Provinsi terpadat</h2>'
    + barChart(prov.rows.map(function (r) { return { name: r.name, value: r.pop }; }), { title: prov.label + " (juta jiwa)", unit: "jt" })
    + srcLine(prov.source) + '</section>'
    + '<section><h2>Cari dan urutkan provinsi</h2>'
    + '<div class="controls"><label>Cari provinsi <input id="provSearch" type="search" placeholder="mis. Jawa Barat" aria-label="Cari provinsi"></label>'
    + '<label>Urutkan <select id="provSort" aria-label="Urutkan provinsi"><option value="pop-desc">Penduduk terbanyak</option><option value="pop-asc">Penduduk tersedikit</option><option value="name">Nama A&ndash;Z</option><option value="share-desc">Pangsa terbesar</option></select></label></div>'
    + '<table class="tbl"><thead><tr><th>Provinsi</th><th>Penduduk (juta jiwa)</th><th>Pangsa (%)</th></tr></thead><tbody id="provBody"></tbody></table>'
    + srcLine(prov.source)
    + '<p class="note">Tabel ini memuat 10 provinsi terpadat. Pangsa dihitung terhadap total penduduk Sensus Penduduk 2020 (270,20 juta jiwa).</p></section>';
  return html;
}

/* ---------- Ekonomi ---------- */
function viewEkonomi(year) {
  var g = NUSA.gdp, t = NUSA.trade;
  var i = idxOf(g.years, year);
  var html = '<section class="hero slim"><h1>Ekonomi</h1>'
    + '<p class="lede">Besarnya ekonomi Indonesia, seberapa cepat ia tumbuh, dan bagaimana perdagangannya dengan dunia.</p>'
    + '<div class="hero-row">' + yearPicker(year) + '</div></section>'
    + '<section><div class="kpis">'
    + kpi(fmtId(g.nominal[i], 1), "PDB " + year + " (Rp triliun)", g.source)
    + kpi(fmtId(g.growth[i], 2) + "%", "Pertumbuhan " + year, g.source)
    + (year === 2024 ? kpi("78,6", "PDB per kapita 2024 (Rp juta)", g.perCapitaSource) : kpi("&mdash;", "PDB per kapita", "BPS"))
    + kpi(fmtId(t.exportsUsdBn, 2), "Ekspor 2024 (US$ miliar)", t.source)
    + '</div></section>'
    + '<section class="card"><h2 id="chartTitle">PDB harga berlaku 2020&ndash;2024</h2>'
    + '<div class="controls"><label>Tampilkan <select id="gdpMode" aria-label="Mode grafik PDB"><option value="nominal">Nilai PDB (Rp triliun)</option><option value="growth">Pertumbuhan (% per tahun)</option></select></label></div>'
    + '<div id="gdpChart">' + lineChart(g.years, g.nominal, { title: "PDB harga berlaku, Rp triliun", highlight: year }) + '</div>'
    + srcLine(g.source) + '</section>'
    + '<section><h2>PDB dan pertumbuhan, 2020&ndash;2024</h2>'
    + '<table class="tbl"><thead><tr><th>Tahun</th><th>PDB (Rp triliun)</th><th>Pertumbuhan (%)</th></tr></thead><tbody>'
    + g.years.map(function (y, k) {
      return '<tr' + (y === year ? ' class="hot"' : '') + '><td>' + y + '</td><td>' + fmtId(g.nominal[k], 1) + '</td><td>' + fmtId(g.growth[k], 2) + '</td></tr>';
    }).join("")
    + '</tbody></table>' + srcLine(g.source) + '</section>'
    + '<section><h2>Perdagangan luar negeri 2024</h2><div class="kpis">'
    + kpi(fmtId(t.exportsUsdBn, 2), "Nilai ekspor (US$ miliar)", t.source)
    + kpi(fmtId(t.importsUsdBn, 2), "Nilai impor (US$ miliar)", t.source)
    + kpi(fmtId(t.surplusUsdBn, 2), "Surplus neraca dagang (US$ miliar)", t.source)
    + kpi(t.exchangeRate2024, "Rata-rata kurs rupiah/US$ 2024", t.source)
    + '</div><p class="note">' + esc(t.exchangeNote) + '</p></section>'
    + '<section><h2>Membaca angka ini</h2><p>PDB per kapita 2024 sebesar Rp78,6 juta &mdash; sekitar US$4.960,3 &mdash; menempatkan Indonesia sebagai ekonomi terbesar di Asia Tenggara. Pertumbuhan 5,03% pada 2024 sedikit melambat dari 5,05% pada 2023, tetapi tetap di atas 5% untuk tahun ketiga berturut-turut.</p>' + srcLine(g.source) + '</section>';
  return html;
}

/* ---------- Harga ---------- */
function viewHarga(year) {
  var inf = NUSA.inflation;
  var i = idxOf(inf.years, year);
  var html = '<section class="hero slim"><h1>Harga</h1>'
    + '<p class="lede">Seberapa cepat harga-harga naik &mdash; inflasi tahunan yang diukur dari Indeks Harga Konsumen (IHK).</p>'
    + '<div class="hero-row">' + yearPicker(year) + '</div></section>'
    + '<section><div class="kpis">'
    + kpi(fmtId(inf.values[i], 2) + "%", "Inflasi Desember " + year + " (yoy)", inf.source)
    + kpi(fmtId(inf.values[4], 2) + "%", "Inflasi Desember 2024 (yoy)", inf.source)
    + kpi(fmtId(inf.values[2], 2) + "%", "Inflasi tertinggi 2020&ndash;2024 (2022)", inf.source)
    + '</div></section>'
    + '<section class="card"><h2>Inflasi tahunan 2020&ndash;2024</h2>'
    + lineChart(inf.years, inf.values, { title: "Inflasi tahunan, %", highlight: year })
    + srcLine(inf.source) + '</section>'
    + '<section><h2>Inflasi per tahun</h2>'
    + '<table class="tbl"><thead><tr><th>Tahun</th><th>Inflasi Desember (yoy, %)</th><th>Catatan</th></tr></thead><tbody>'
    + inf.years.map(function (y, k) {
      var note = y === 2022 ? "Kenaikan harga BBM bersubsidi" : y === 2020 ? "Tahun pertama pandemi" : y === 2024 ? "Terendah dalam lima tahun" : "";
      return '<tr' + (y === year ? ' class="hot"' : '') + '><td>' + y + '</td><td>' + fmtId(inf.values[k], 2) + '</td><td>' + note + '</td></tr>';
    }).join("")
    + '</tbody></table>' + srcLine(inf.source) + '</section>'
    + '<section><h2>Apa itu inflasi?</h2><p>Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus-menerus. BPS mengukurnya dari Indeks Harga Konsumen (IHK) di 90 kota. Angka di atas adalah inflasi year-on-year bulan Desember &mdash; perbandingan harga Desember tahun itu dengan Desember tahun sebelumnya.</p>' + srcLine(inf.source) + '</section>';
  return html;
}

/* ---------- Ketenagakerjaan ---------- */
function viewKerja(year) {
  var u = NUSA.unemployment;
  var i = idxOf(u.years, year);
  var bp = u.byProvince;
  var html = '<section class="hero slim"><h1>Ketenagakerjaan</h1>'
    + '<p class="lede">Siapa yang bekerja, siapa yang mencari kerja, dan di mana pengangguran paling tinggi dan paling rendah.</p>'
    + '<div class="hero-row">' + yearPicker(year) + '</div></section>'
    + '<section><div class="kpis">'
    + kpi(fmtId(u.values[i], 2) + "%", "TPT Agustus " + year, u.source)
    + kpi(fmtId(u.unemployedM, 2), "Jumlah penganggur, Agu 2024 (juta orang)", u.source)
    + kpi(fmtId(u.workingAgeM, 2), "Penduduk usia kerja, Agu 2024 (juta orang)", u.source)
    + kpi(fmtId(u.informalShare, 2) + "%", "Pekerja informal (2024)", u.informalSource)
    + '</div></section>'
    + '<section class="card"><h2>Tingkat pengangguran terbuka 2020&ndash;2024</h2>'
    + lineChart(u.years, u.values, { title: "Tingkat Pengangguran Terbuka, %", highlight: year })
    + srcLine(u.source)
    + '<p class="note">TPT adalah persentase penganggur terhadap angkatan kerja. Puncaknya pada Agustus 2020 (7,07%) terjadi di masa pandemi; sejak itu turun setiap tahun hingga 4,91% pada Agustus 2024 &mdash; di bawah level sebelum pandemi (5,23% pada 2019).</p></section>'
    + '<section class="grid2"><div class="card"><h3>TPT tertinggi, Agustus 2024</h3><ol class="toplist">'
    + bp.highest.map(function (r) { return '<li><span>' + esc(r.name) + '</span><b>' + fmtId(r.value, 2) + '%</b></li>'; }).join("")
    + '</ol>' + srcLine(bp.source) + '</div>'
    + '<div class="card"><h3>TPT terendah, Agustus 2024</h3><ol class="toplist">'
    + bp.lowest.map(function (r) { return '<li><span>' + esc(r.name) + '</span><b>' + fmtId(r.value, 2) + '%</b></li>'; }).join("")
    + '</ol>' + srcLine(bp.source) + '</div></section>';
  return html;
}

/* ---------- Sosial ---------- */
function viewSosial() {
  var pov = NUSA.poverty, h = NUSA.hdi;
  var html = '<section class="hero slim"><h1>Kesejahteraan</h1>'
    + '<p class="lede">Kemiskinan, ketimpangan, dan pembangunan manusia &mdash; apakah hidup orang Indonesia makin baik?</p></section>'
    + '<section><div class="kpis">'
    + kpi(fmtId(pov.september2024, 2) + "%", "Penduduk miskin (Sep 2024)", pov.source)
    + kpi(fmtId(pov.giniMarch2024, 3), "Rasio gini (Mar 2024)", pov.giniSource)
    + kpi(fmtId(h.values[2], 2), "IPM 2024", h.source)
    + kpi("74,15 thn", "Umur harapan hidup 2024", h.source)
    + '</div><p class="note">' + esc(pov.septemberNote) + '</p></section>'
    + '<section class="card"><h2>Persentase penduduk miskin, Maret 2020&ndash;2024</h2>'
    + lineChart(pov.years, pov.march, { title: "Penduduk miskin, %" })
    + srcLine(pov.source)
    + '<p class="note">Kemiskinan naik pada 2021 (10,14%) di masa pandemi, lalu turun empat tahun beruntun. Pada September 2024 angkanya 8,57% &mdash; pertama kalinya masuk kisaran 8 persen.</p></section>'
    + '<section><h2>IPM dan komponennya</h2>'
    + '<table class="tbl"><thead><tr><th>Tahun</th><th>IPM</th></tr></thead><tbody>'
    + h.years.map(function (y, k) { return '<tr' + (y === 2024 ? ' class="hot"' : '') + '><td>' + y + '</td><td>' + fmtId(h.values[k], 2) + '</td></tr>'; }).join("")
    + '</tbody></table>' + srcLine(h.source)
    + '<h3>Komponen IPM 2024</h3><table class="tbl"><thead><tr><th>Komponen</th><th>Nilai 2024</th></tr></thead><tbody>'
    + h.components2024.map(function (c) { return '<tr><td>' + esc(c.name) + '</td><td>' + esc(c.value) + '</td></tr>'; }).join("")
    + '</tbody></table>' + srcLine(h.source)
    + '<p class="note">Rata-rata lama sekolah 8,85 tahun berarti rata-rata orang Indonesia usia 25 tahun ke atas bersekolah setara kelas 3 SMP.</p></section>';
  return html;
}

/* ---------- Tentang ---------- */
function viewTentang() {
  return '<section class="hero slim"><h1>Tentang situs ini</h1>'
    + '<p class="lede">NusaStatistik adalah situs statistik nasional Indonesia yang dibuat untuk dibaca manusia, bukan untuk meniru situs resmi mana pun.</p></section>'
    + '<section><h2>Dari mana angkanya?</h2><p>Semua angka di situs ini berasal dari publikasi Badan Pusat Statistik (BPS): Berita Resmi Statistik, Sensus Penduduk 2020, Survei Angkatan Kerja Nasional (Sakernas), dan Proyeksi Penduduk. Setiap angka menampilkan sumber dan tahun rujukannya di samping angka itu sendiri.</p>'
    + '<h2>Apa yang tidak ada di sini?</h2><p>Tidak ada prakiraan, tidak ada angka tebakan, dan tidak ada data yang diambil dari internet saat halaman dibuka &mdash; situs ini bekerja sepenuhnya dari berkasnya sendiri.</p>'
    + '<h2>Cara memakai</h2><p>Pilih tahun pada halaman mana pun untuk melihat angka tahun itu. Pada halaman Penduduk, ketik nama provinsi untuk mencari dan pilih urutan tabel. Pada halaman Ekonomi, ganti mode grafik antara nilai PDB dan pertumbuhannya.</p></section>';
}

var VIEWS = {
  "/": viewHome,
  "/penduduk": viewPenduduk,
  "/ekonomi": viewEkonomi,
  "/harga": viewHarga,
  "/kerja": viewKerja,
  "/sosial": viewSosial,
  "/tentang": viewTentang
};
