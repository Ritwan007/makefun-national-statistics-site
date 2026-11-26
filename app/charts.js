/* charts.js — one job: turn number series into inline SVG charts.
   No libraries, no network. Charts are drawn from the data in data.js. */
"use strict";

function fmtId(v, dec) {
  var s = dec === undefined ? String(v) : Number(v).toFixed(dec);
  var parts = s.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

function niceMax(values) {
  var m = Math.max.apply(null, values);
  var p = Math.pow(10, Math.floor(Math.log10(m)));
  var n = m / p;
  var c = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return c * p;
}

/* Line chart with labelled points. opts: {title, unit, highlight (year)} */
function lineChart(years, values, opts) {
  opts = opts || {};
  var W = 640, H = 300, L = 56, R = 18, T = 34, B = 34;
  var max = niceMax(values);
  var min = Math.min.apply(null, values);
  var dataMax = Math.max.apply(null, values);
  var range = dataMax - min;
  /* A series that moves in a narrow band (e.g. population 270-282) would
     look flat on a zero-based axis, so start the axis just below the
     lowest point when the band is small relative to the level. */
  var floor = min < 0 ? Math.min(0, min * 1.15) : (range < dataMax * 0.25 ? Math.max(0, min - range) : 0);
  /* When the floor is raised, cap the top just above the data too, so the
     line uses the chart's height instead of sitting at its bottom. */
  var top = floor > 0 ? dataMax + range : max * 1.08;
  var iw = W - L - R, ih = H - T - B;
  function x(i) { return L + (iw * i) / (years.length - 1); }
  function y(v) { return T + ih - ((v - floor) / (top - floor)) * ih; }
  var pts = values.map(function (v, i) { return x(i).toFixed(1) + "," + y(v).toFixed(1); }).join(" ");
  var dots = values.map(function (v, i) {
    var hot = opts.highlight === years[i];
    return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="' + (hot ? 6 : 4) + '" fill="' + (hot ? "#E8A33D" : "#14665F") + '" stroke="#fff" stroke-width="2"/>'
      + '<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 12).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#1C2B2A">' + fmtId(v) + '</text>';
  }).join("");
  var labels = years.map(function (yr, i) {
    return '<text x="' + x(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" fill="#5A6B69">' + yr + '</text>';
  }).join("");
  var grid = [0, 0.5, 1].map(function (f) {
    var gy = T + ih * (1 - f);
    var gv = floor + (top - floor) * f;
    return '<line x1="' + L + '" y1="' + gy.toFixed(1) + '" x2="' + (W - R) + '" y2="' + gy.toFixed(1) + '" stroke="#E3DED2" stroke-width="1"/>'
      + '<text x="' + (L - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5A6B69">' + fmtId(Math.round(gv * 100) / 100) + '</text>';
  }).join("");
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.title || "Grafik garis") + '">'
    + '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>'
    + (opts.title ? '<text x="' + L + '" y="20" font-size="14" font-weight="700" fill="#0B3B3E">' + opts.title + '</text>' : '')
    + grid
    + '<polyline points="' + pts + '" fill="none" stroke="#14665F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
    + dots + labels + '</svg>';
}

/* Horizontal bar chart. items: [{name, value, note}]. */
function barChart(items, opts) {
  opts = opts || {};
  var rowH = 34, W = 640, L = 150, R = 64, T = opts.title ? 36 : 12;
  var H = T + items.length * rowH + 14;
  var max = niceMax(items.map(function (d) { return d.value; }));
  var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.title || "Grafik batang") + '">'
    + '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>';
  if (opts.title) out += '<text x="12" y="22" font-size="14" font-weight="700" fill="#0B3B3E">' + opts.title + '</text>';
  items.forEach(function (d, i) {
    var y = T + i * rowH + 6;
    var bw = ((W - L - R) * d.value) / max;
    out += '<text x="' + (L - 10) + '" y="' + (y + 13) + '" text-anchor="end" font-size="12" fill="#1C2B2A">' + d.name + '</text>'
      + '<rect x="' + L + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="20" rx="4" fill="' + (i === 0 ? "#E8A33D" : "#14665F") + '"/>'
      + '<text x="' + (L + bw + 8).toFixed(1) + '" y="' + (y + 14) + '" font-size="12" font-weight="700" fill="#1C2B2A">' + fmtId(d.value) + (opts.unit ? " " + opts.unit : "") + '</text>';
  });
  return out + '</svg>';
}

/* Small sparkline-style bar chart for growth rates (handles negatives). */
function growthBars(years, values, opts) {
  opts = opts || {};
  var W = 640, H = 260, L = 56, R = 18, T = 36, B = 30;
  var lo = Math.min(0, Math.min.apply(null, values) * 1.2);
  var hi = Math.max.apply(null, values) * 1.15;
  var iw = W - L - R, ih = H - T - B;
  function y(v) { return T + ih - ((v - lo) / (hi - lo)) * ih; }
  var bw = iw / years.length * 0.55;
  var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.title || "Grafik batang") + '">'
    + '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>'
    + (opts.title ? '<text x="' + L + '" y="20" font-size="14" font-weight="700" fill="#0B3B3E">' + opts.title + '</text>' : '')
    + '<line x1="' + L + '" y1="' + y(0).toFixed(1) + '" x2="' + (W - R) + '" y2="' + y(0).toFixed(1) + '" stroke="#9AA8A6" stroke-width="1"/>';
  years.forEach(function (yr, i) {
    var cx = L + (iw * (i + 0.5)) / years.length;
    var v = values[i];
    var neg = v < 0;
    var yTop = neg ? y(0) : y(v);
    var h = Math.abs(y(v) - y(0));
    out += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + yTop.toFixed(1) + '" width="' + bw.toFixed(0) + '" height="' + Math.max(h, 2).toFixed(1) + '" rx="4" fill="' + (neg ? "#B4452F" : (opts.highlight === yr ? "#E8A33D" : "#14665F")) + '"/>'
      + '<text x="' + cx.toFixed(1) + '" y="' + (neg ? y(v) + 18 : y(v) - 8).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#1C2B2A">' + fmtId(v, 2) + '%</text>'
      + '<text x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" fill="#5A6B69">' + yr + '</text>';
  });
  return out + '</svg>';
}
