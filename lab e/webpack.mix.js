let mix = require('laravel-mix');

mix.ts('script.ts', 'district') // Kompilacja TypeScript -> JS
   .setPublicPath('district'); // Ścieżka dla plików wynikowych
