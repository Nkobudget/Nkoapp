export const DEFAULT_PHASES = [
  { name: 'Pre-production', depts: ['A - Above the line', 'B - Story & Rights', 'C - Producer & Direction', 'D - Cast & Talent'] },
  { name: 'Production', depts: ['E - Camera Department', 'F - Sound Department', 'G - Lighting & Grip', 'H - Production Design & Art', 'I - Wardrobe & Makeup', 'J - Locations & Travel', 'K - Production Operations'] },
  { name: 'Post-production', depts: ['L - Editorial & Picture', 'M - Sound Post-production', 'N - Music & Score', 'O - Visual Effects (VFX)', 'P - Titles & Finishing'] },
  { name: 'Other', depts: ['Q - Marketing & Publicity', 'R - Legal & Insurance', 'S - General & Administrative', 'T - Contingency', 'U - Deferred & Financing', 'V - Production Support'] }
];

const CURRENCY_SYMBOLS = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
  EUR: '€',
  GHS: 'GH₵',
  KES: 'KSh',
  ZAR: 'R',
  XOF: 'CFA',
  CAD: 'CA$',
  AUD: 'AU$',
};

export const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const fmtNumber = (n) => Number(n || 0).toLocaleString('en', { maximumFractionDigits: 0 });

export const getCurrencySymbol = (code) => CURRENCY_SYMBOLS[code] || '$';

export const calcLineTotal = (i) => (Number(i.qty) || 0) * (Number(i.rate) || 0);

/**
 * Generates an editable Microsoft Word / Google Docs compatible HTML document (.doc)
 */
export function generateBudgetDocsHtml(items = [], project = {}, phases = DEFAULT_PHASES) {
  const brand = (typeof localStorage !== 'undefined' && project?.id)
    ? JSON.parse(localStorage.getItem(`nko_brand_${project.id}`) || '{}')
    : {};
  const info = (typeof localStorage !== 'undefined' && project?.id)
    ? JSON.parse(localStorage.getItem(`nko_info_${project.id}`) || '{}')
    : {};
  const baseCur = project?.base_currency || 'NGN';
  const sym = getCurrencySymbol(baseCur);

  const grand = {};
  items.forEach(i => {
    const cur = i.currency || baseCur;
    grand[cur] = (grand[cur] || 0) + calcLineTotal(i);
  });
  const grandLine = Object.entries(grand).map(([cc, a]) => `${getCurrencySymbol(cc)}${fmtNumber(a)}`).join(' · ') || `${sym}0`;

  const infoRows = [
    ['Company', brand.companyName || 'NKÒ Production'],
    ['Production Title', brand.productionTitle || project?.name || 'Untitled Production'],
    ['Project Type', project?.type || 'Film / Media'],
    ['Base Currency', baseCur],
    ['Producer', info.producer],
    ['Line Producer', info.lineProducer],
    ['Executive Producer', info.execProducer],
    ['Prepared By', info.preparedBy],
    ['Pre-production', info.prepStart && `${info.prepStart} → ${info.prepEnd || ''}`],
    ['Shoot', info.shootStart && `${info.shootStart} → ${info.shootEnd || ''}`],
    ['Post-production', info.postStart && `${info.postStart} → ${info.postEnd || ''}`],
  ].filter(([, v]) => v);

  const infoTable = infoRows.length ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:16pt;border:1pt solid #D0D0D0;">
      ${infoRows.map(([k, v]) => `
        <tr>
          <td style="padding:6pt 10pt;font-size:10pt;color:#555555;font-weight:600;width:160pt;background-color:#F5F5F7;border:1pt solid #D0D0D0;">${escapeHtml(k)}</td>
          <td style="padding:6pt 10pt;font-size:10pt;color:#111111;font-weight:600;border:1pt solid #D0D0D0;">${escapeHtml(v)}</td>
        </tr>
      `).join('')}
    </table>
  ` : '';

  const phaseCards = (phases || DEFAULT_PHASES).map(ph => {
    const pi = items.filter(i => (ph.depts || []).some(d => d.toLowerCase() === (i.dept || '').toLowerCase() || (i.dept || '').startsWith(d.slice(0, 2))));
    const t = {};
    pi.forEach(i => {
      const cur = i.currency || baseCur;
      t[cur] = (t[cur] || 0) + calcLineTotal(i);
    });
    const line = Object.entries(t).map(([cc, a]) => `${getCurrencySymbol(cc)}${fmtNumber(a)}`).join(' · ') || '—';
    return `
      <td style="padding:8pt 10pt;background-color:#F8F9FA;border:1pt solid #D0D0D0;text-align:center;">
        <div style="font-size:8pt;text-transform:uppercase;color:#777777;letter-spacing:1pt;margin-bottom:3pt;">${escapeHtml(ph.name)}</div>
        <div style="font-size:11pt;font-weight:700;color:#111111;font-family:'Consolas',monospace;">${line}</div>
      </td>
    `;
  }).join('');

  const phaseSummaryTable = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:18pt;">
      <tr>${phaseCards}</tr>
    </table>
  `;

  // Group items by department
  const deptsPresent = Array.from(new Set(items.map(i => i.dept || 'General')));
  if (!deptsPresent.length && items.length === 0) {
    deptsPresent.push('Production Overview');
  }

  const deptTables = deptsPresent.map(deptName => {
    const di = items.filter(i => (i.dept || 'General') === deptName);
    const sub = {};
    di.forEach(i => {
      const cur = i.currency || baseCur;
      sub[cur] = (sub[cur] || 0) + calcLineTotal(i);
    });
    const subLine = Object.entries(sub).map(([cc, a]) => `${getCurrencySymbol(cc)}${fmtNumber(a)}`).join(' · ') || `${sym}0`;

    const rows = di.length > 0 ? di.map(i => `
      <tr>
        <td style="padding:5pt 8pt;font-size:9.5pt;color:#222222;border:1pt solid #E0E0E0;">${escapeHtml(i.description || '—')}</td>
        <td style="padding:5pt 8pt;font-size:9.5pt;color:#222222;text-align:center;border:1pt solid #E0E0E0;">${escapeHtml(String(i.qty ?? 1))}</td>
        <td style="padding:5pt 8pt;font-size:9.5pt;color:#222222;text-align:center;border:1pt solid #E0E0E0;">${escapeHtml(i.unit || 'flat')}</td>
        <td style="padding:5pt 8pt;font-size:9.5pt;color:#222222;text-align:right;font-family:'Consolas',monospace;border:1pt solid #E0E0E0;">${getCurrencySymbol(i.currency || baseCur)}${fmtNumber(i.rate || 0)}</td>
        <td style="padding:5pt 8pt;font-size:9.5pt;color:#111111;font-weight:700;text-align:right;font-family:'Consolas',monospace;border:1pt solid #E0E0E0;">${getCurrencySymbol(i.currency || baseCur)}${fmtNumber(calcLineTotal(i))}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="5" style="padding:8pt;font-size:9.5pt;color:#777777;text-align:center;border:1pt solid #E0E0E0;">No lines recorded for this section yet.</td>
      </tr>
    `;

    return `
      <div style="margin-bottom:14pt;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
          <tr style="background-color:#EFEFF2;">
            <td style="padding:6pt 8pt;font-size:10pt;font-weight:700;color:#111111;border:1pt solid #C8C8CC;">
              ${escapeHtml(deptName)}
            </td>
            <td style="padding:6pt 8pt;font-size:10pt;font-weight:700;text-align:right;color:#111111;font-family:'Consolas',monospace;border:1pt solid #C8C8CC;">
              ${subLine}
            </td>
          </tr>
        </table>
        <table style="width:100%;border-collapse:collapse;border:1pt solid #D0D0D0;border-top:none;margin-bottom:10pt;">
          <thead>
            <tr style="background-color:#F8F8FA;">
              <th style="padding:5pt 8pt;font-size:8.5pt;color:#555555;text-transform:uppercase;border:1pt solid #D0D0D0;text-align:left;">Description</th>
              <th style="padding:5pt 8pt;font-size:8.5pt;color:#555555;text-transform:uppercase;border:1pt solid #D0D0D0;text-align:center;width:40pt;">Qty</th>
              <th style="padding:5pt 8pt;font-size:8.5pt;color:#555555;text-transform:uppercase;border:1pt solid #D0D0D0;text-align:center;width:55pt;">Unit</th>
              <th style="padding:5pt 8pt;font-size:8.5pt;color:#555555;text-transform:uppercase;border:1pt solid #D0D0D0;text-align:right;width:75pt;">Rate</th>
              <th style="padding:5pt 8pt;font-size:8.5pt;color:#555555;text-transform:uppercase;border:1pt solid #D0D0D0;text-align:right;width:85pt;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }).join('');

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(project?.name || 'Production')} - Production Budget</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1A1A1A; line-height: 1.4; margin: 24pt; }
        h1 { font-size: 20pt; color: #111111; margin-bottom: 2pt; font-weight: 700; }
        .sub { font-size: 10.5pt; color: #666666; margin-bottom: 14pt; }
        table { border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div style="max-width:800px;margin:0 auto;">
        <h1>${escapeHtml(project?.name || 'Production')} — Production Budget</h1>
        <div class="sub">${escapeHtml(project?.type || 'Film Production')} · Generated by NKÒ · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>

        ${infoTable}

        <div style="background-color:#F5F5F7;border:1.5pt solid #E5A823;padding:12pt 16pt;text-align:center;margin-bottom:16pt;">
          <div style="font-size:8.5pt;text-transform:uppercase;color:#666666;letter-spacing:1.5pt;font-weight:600;">Grand Total</div>
          <div style="font-size:22pt;font-weight:700;color:#111111;font-family:'Consolas',monospace;margin-top:2pt;">${grandLine}</div>
        </div>

        ${phaseSummaryTable}
        ${deptTables}

        <div style="margin-top:24pt;text-align:center;font-size:8.5pt;color:#888888;border-top:1pt solid #D0D0D0;padding-top:8pt;">
          Generated by NKÒ — Budgets Tailored To Film · Compatible with Microsoft Word & Google Docs
        </div>
      </div>
    </body>
    </html>
  `;
}

export function budgetDocs(items = [], project = {}, advances = [], reconEntries = [], phases = DEFAULT_PHASES) {
  const docHtml = generateBudgetDocsHtml(items, project, phases);
  if (typeof window === 'undefined') return docHtml;
  const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (project?.name || 'Production').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `${safeName}_Budget.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return docHtml;
}
