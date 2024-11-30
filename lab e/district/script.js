/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.changeStyle = changeStyle;
exports.generateLinks = generateLinks;
// Słownik dostępnych stylów
var styles = {
  style1: "style/style1.css",
  style2: "style/style2.css",
  style3: "style/style3.css"
};
// Funkcja do zmiany stylu
function changeStyle(styleName) {
  var themeLink = document.getElementById("theme-style");
  if (themeLink && styles[styleName]) {
    themeLink.href = styles[styleName];
  } else {
    console.error("Styl ".concat(styleName, " nie istnieje."));
  }
}
// Funkcja do dynamicznego generowania linków
function generateLinks() {
  var container = document.getElementById("style-links");
  if (container) {
    container.innerHTML = ""; // Wyczyść poprzednie przyciski
    var _loop_1 = function _loop_1(styleName) {
      var button = document.createElement("button");
      button.textContent = "Zmie\u0144 na ".concat(styleName);
      button.className = "button";
      button.onclick = function () {
        return changeStyle(styleName);
      };
      container.appendChild(button);
    };
    for (var styleName in styles) {
      _loop_1(styleName);
    }
  } else {
    console.error("Nie znaleziono elementu z id 'style-links'");
  }
}
// Wygenerowanie linków po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  generateLinks();
});
})();

/******/ })()
;