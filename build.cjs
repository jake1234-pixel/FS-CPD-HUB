// node build.cjs : builds public/index.html from src/app.html and copies the libraries and fonts it needs.
// Needs the bootstrap-icons, Manrope and Funnel Display packages: npm i -D bootstrap-icons @expo-google-fonts/manrope @expo-google-fonts/funnel-display pdfjs-dist@3.11.174 jszip pdf-lib @pdf-lib/fontkit
const fs = require("fs"), path = require("path");
const NM = process.env.NODE_MODULES || path.join(__dirname, "node_modules");
const ICON_NAMES = ["cloud-arrow-up","download","file-earmark-pdf","person","people","search","box-arrow-right","trash3","check-circle","exclamation-triangle","question-circle","arrow-right","envelope","file-earmark-spreadsheet","x-lg","award","calendar3","clock","eye","arrow-left","chevron-down","plus-lg","info-circle","x-circle","check2","check-circle-fill","exclamation-circle","file-earmark-arrow-up","inbox","person-check"];
const icons = {};
for (const n of ICON_NAMES) icons[n] = fs.readFileSync(path.join(NM, "bootstrap-icons/icons", n + ".svg"), "utf8").replace(/<svg[^>]*>|<\/svg>/g, "").replace(/\s*\n\s*/g, "");
const src = fs.readFileSync(path.join(__dirname, "src/app.html"), "utf8").replace("__HUB_MODE__", "server").replace("/*__ICONS__*/{}", JSON.stringify(icons));
const out = path.join(__dirname, "public");
fs.mkdirSync(path.join(out, "vendor/fonts"), { recursive: true }); fs.mkdirSync(path.join(out, "brand"), { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex"></head><body>\n${src}\n</body></html>`);
const copy = (from, to) => fs.copyFileSync(path.join(NM, from), path.join(out, to));
copy("pdfjs-dist/build/pdf.min.js", "vendor/pdf.min.js"); copy("pdfjs-dist/build/pdf.worker.min.js", "vendor/pdf.worker.min.js");
copy("jszip/dist/jszip.min.js", "vendor/jszip.min.js"); copy("pdf-lib/dist/pdf-lib.min.js", "vendor/pdf-lib.min.js"); copy("@pdf-lib/fontkit/dist/fontkit.umd.min.js", "vendor/fontkit.umd.min.js");
for (const w of ["400Regular", "500Medium", "600SemiBold"]) copy(`@expo-google-fonts/manrope/Manrope_${w}.ttf`, `vendor/fonts/Manrope_${w}.ttf`);
copy("@expo-google-fonts/funnel-display/500Medium/FunnelDisplay_500Medium.ttf", "vendor/fonts/FunnelDisplay_500Medium.ttf");
console.log("Built public/");
