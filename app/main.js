/* main.js — one job: routing and the page controls (year picker, province
   search/sort, GDP chart mode). All state lives here; views stay pure. */
"use strict";

var state = { year: 2024, route: "/" };

function currentRoute() {
  var h = window.location.hash || "#/";
  var path = h.slice(1).split("?")[0];
  return VIEWS[path] ? path : "/";
}

function render() {
  state.route = currentRoute();
  var app = document.getElementById("app");
  var fn = VIEWS[state.route];
  app.innerHTML = fn(state.year);
  document.querySelectorAll("nav a").forEach(function (a) {
    var r = a.getAttribute("href").slice(1);
    if (r === state.route) { a.setAttribute("aria-current", "page"); }
    else { a.removeAttribute("aria-current"); }
  });
  wireControls();
  window.scrollTo(0, 0);
}

function wireControls() {
  var yearSel = document.getElementById("yearSel");
  if (yearSel) {
    yearSel.addEventListener("change", function () {
      state.year = parseInt(yearSel.value, 10);
      render();
    });
  }
  var search = document.getElementById("provSearch");
  var sort = document.getElementById("provSort");
  if (search && sort) {
    var paint = function () { paintProvinces(search.value, sort.value); };
    search.addEventListener("input", paint);
    sort.addEventListener("change", paint);
    paintProvinces("", "pop-desc");
  }
  var gdpMode = document.getElementById("gdpMode");
  if (gdpMode) {
    gdpMode.addEventListener("change", function () {
      var box = document.getElementById("gdpChart");
      var title = document.getElementById("chartTitle");
      if (gdpMode.value === "growth") {
        title.textContent = "Pertumbuhan ekonomi 2020\u20132024";
        box.innerHTML = growthBars(NUSA.gdp.years, NUSA.gdp.growth, { title: "Pertumbuhan PDB, % per tahun", highlight: state.year });
      } else {
        title.textContent = "PDB harga berlaku 2020\u20132024";
        box.innerHTML = lineChart(NUSA.gdp.years, NUSA.gdp.nominal, { title: NUSA.gdp.label + " (Rp triliun)", highlight: state.year });
      }
    });
  }
}

function paintProvinces(q, mode) {
  var body = document.getElementById("provBody");
  if (!body) return;
  var rows = NUSA.provinces.rows.slice();
  if (q) {
    var needle = q.trim().toLowerCase();
    rows = rows.filter(function (r) { return r.name.toLowerCase().indexOf(needle) !== -1; });
  }
  if (mode === "pop-asc") rows.sort(function (a, b) { return a.pop - b.pop; });
  else if (mode === "name") rows.sort(function (a, b) { return a.name.localeCompare(b.name, "id"); });
  else if (mode === "share-desc") rows.sort(function (a, b) { return b.share - a.share; });
  else rows.sort(function (a, b) { return b.pop - a.pop; });
  body.innerHTML = rows.length ? rows.map(function (r) {
    return '<tr><td>' + esc(r.name) + '</td><td>' + fmtId(r.pop, 2) + '</td><td>' + fmtId(r.share, 2) + '</td></tr>';
  }).join("") : '<tr><td colspan="3">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
}

window.addEventListener("hashchange", render);
document.addEventListener("DOMContentLoaded", render);
