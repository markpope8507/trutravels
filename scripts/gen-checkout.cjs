const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('converted/checkout.html', 'utf8');
const css = fs.readFileSync('converted/styles.css', 'utf8');
const outDir = 'src/app/checkout';
fs.mkdirSync(outDir, { recursive: true });

// ---- Split body inner + script ----
const bodyOpen = html.indexOf('<body');
const bodyInnerStart = html.indexOf('>', bodyOpen) + 1;
const bodyEnd = html.indexOf('</body>');
let body = html.slice(bodyInnerStart, bodyEnd);
// pull out the <script>...</script>
const sTagStart = body.indexOf('<script>');
const sTagEnd = body.indexOf('</script>');
let script = body.slice(sTagStart + '<script>'.length, sTagEnd);
let markup = (body.slice(0, sTagStart) + body.slice(sTagEnd + '</script>'.length)).trim();

// strip the IIFE wrapper so we can run it as a function body
script = script.trim();
script = script.replace(/^\/\*[\s\S]*?\*\/\s*/, ''); // leading comment
script = script.replace(/^\(function\s*\(\)\s*\{/, '').replace(/\}\)\(\);?\s*$/, '');

function transformLinks(s) {
  return s
    .replace(/assets\//g, '/checkout-assets/')
    .replace(/thailand-island-hopper\.html\?cart=1/g, '/')
    .replace(/thailand-island-hopper\.html/g, '/')
    .replace(/terms\.html/g, '/terms-conditions');
}
markup = transformLinks(markup);
script = transformLinks(script);

// escape for template literals
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'); }

fs.writeFileSync(path.join(outDir, 'checkout-markup.ts'),
  '// AUTO-GENERATED from converted/checkout.html — do not edit by hand.\n' +
  '/* eslint-disable */\nexport const CHECKOUT_HTML = `' + esc(markup) + '`;\n');

fs.writeFileSync(path.join(outDir, 'checkout-script.ts'),
  '// AUTO-GENERATED from converted/checkout.html — do not edit by hand.\n' +
  '/* eslint-disable */\n// @ts-nocheck\nexport function runCheckout() {\n' + script + '\n}\n');

// ---- CSS: drop the reset block, add font vars ----
const resetStart = css.indexOf('*, *::before');
const ulRule = 'ul { margin: 0; padding: 0; list-style: none; }';
const resetEnd = css.indexOf(ulRule) + ulRule.length;
let outCss = css.slice(0, resetStart) + css.slice(resetEnd);
outCss = outCss
  .replace(/'Montserrat'/g, "var(--font-montserrat), 'Montserrat'")
  .replace(/'Source Sans 3'/g, "var(--font-source-sans), 'Source Sans 3'")
  .replace(/'Caveat'/g, "var(--font-caveat), 'Caveat'")
  .replace(/assets\//g, '/checkout-assets/');
fs.writeFileSync(path.join(outDir, 'checkout.css'), outCss);

console.log('markup', markup.length, 'chars | script', script.length, 'chars | css', outCss.length, 'chars');
console.log('reset removed span:', resetStart, '->', resetEnd);
