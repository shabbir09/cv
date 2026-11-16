import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrintApp, ScreenApp } from './App.jsx';
import { PrintAcademic, ScreenAcademic } from './Academic.jsx';
/* Fonts via Fontsource npm packages (variable fonts, bundled by Vite —
   no font binaries live in this repo). Family names registered:
   "Inter Variable" (100–900, normal + italic), "Space Grotesk Variable"
   (300–700), "Fraunces Variable" (100–900). print.mjs hard-fails if any
   of these faces is missing at render time. */
import '@fontsource-variable/inter';
import '@fontsource-variable/inter/wght-italic.css';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/fraunces';
import './styles.css';

/* Routes:
   ?print=1          → Founder print sheets (PDF source)
   ?print=academic   → Academic print sheets (PDF source)
   ?variant=academic → Academic screen page
   (default)         → Founder screen page
*/
const params = new URLSearchParams(window.location.search);
const printVal = params.get('print');
const isPrint = printVal !== null;
const isAcademic = printVal === 'academic' || params.get('variant') === 'academic';
if (isPrint) document.body.classList.add('print-body');

const tree = isPrint
  ? isAcademic
    ? <PrintAcademic />
    : <PrintApp />
  : isAcademic
    ? <ScreenAcademic />
    : <ScreenApp />;

createRoot(document.getElementById('root')).render(<React.StrictMode>{tree}</React.StrictMode>);
