// Hearth Budget — SVG charts, drawn from numbers alone.
//
// Both builders are pure functions of their inputs: the same figures always
// draw the same picture, and nothing here reads a clock, a network or a
// random number. Charts are inline SVG, so the site needs no chart library
// and no font or image file.

// A donut of spending by category. `slices` is [{ label, value, color }],
// already sorted largest first; `total` is the month's spending.
export function donutChart(slices, total) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 96;
  const rInner = 62;
  const rMid = (rOuter + rInner) / 2;
  let angle = -Math.PI / 2;
  let paths = '';
  for (const slice of slices) {
    if (slice.value <= 0) continue;
    const frac = slice.value / total;
    const sweep = frac * Math.PI * 2;
    const a0 = angle;
    const a1 = angle + sweep;
    angle = a1;
    const large = sweep > Math.PI ? 1 : 0;
    const x0 = cx + rOuter * Math.cos(a0);
    const y0 = cy + rOuter * Math.sin(a0);
    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const x2 = cx + rInner * Math.cos(a1);
    const y2 = cy + rInner * Math.sin(a1);
    const x3 = cx + rInner * Math.cos(a0);
    const y3 = cy + rInner * Math.sin(a0);
    // A slice that takes the whole circle is drawn as two halves.
    if (frac >= 0.999) {
      paths += `<path d="M ${cx} ${cy - rOuter} A ${rOuter} ${rOuter} 0 1 1 ${cx} ${cy + rOuter} A ${rOuter} ${rOuter} 0 1 1 ${cx} ${cy - rOuter} L ${cx} ${cy - rInner} A ${rInner} ${rInner} 0 1 0 ${cx} ${cy + rInner} A ${rInner} ${rInner} 0 1 0 ${cx} ${cy - rInner} Z" fill="${slice.color}"/>`;
    } else {
      paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z" fill="${slice.color}"><title>${slice.label}: $${slice.value.toFixed(2)}</title></path>`;
    }
    // Label only slices big enough to hold their number on the ring; the
    // legend beside the chart carries every slice's figure, so small slices
    // are never crowded into one another.
    if (frac < 0.05) continue;
    const mid = a0 + sweep / 2;
    const lx = cx + rMid * Math.cos(mid);
    const ly = cy + rMid * Math.sin(mid);
    const pct = Math.round(frac * 100);
    paths += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" class="chart-label">${pct}%</text>`;
  }
  const midLabel = `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-total">$${total.toFixed(0)}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-sub">spent</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, ${total.toFixed(2)} dollars in total">${paths}${midLabel}</svg>`;
}

// Grouped bars: income beside spending for each month.
// `rows` is [{ label, income, spending }].
export function monthBars(rows) {
  const width = 560;
  const height = 260;
  const padLeft = 56;
  const padBottom = 30;
  const padTop = 14;
  const plotW = width - padLeft - 8;
  const plotH = height - padTop - padBottom;
  const max = Math.max(...rows.flatMap((row) => [row.income, row.spending]), 100);
  const nice = Math.ceil(max / 1000) * 1000;
  const y = (value) => padTop + plotH - (value / nice) * plotH;
  const groupW = plotW / rows.length;
  const barW = Math.min(44, (groupW - 24) / 2);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending by month">`;
  for (let grid = 0; grid <= 4; grid++) {
    const value = (nice / 4) * grid;
    const gy = y(value);
    out += `<line x1="${padLeft}" y1="${gy}" x2="${width - 8}" y2="${gy}" class="grid-line"/><text x="${padLeft - 8}" y="${gy + 4}" text-anchor="end" class="chart-label">$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}</text>`;
  }
  rows.forEach((row, i) => {
    const gx = padLeft + i * groupW + groupW / 2;
    out += `<rect x="${(gx - barW - 3).toFixed(1)}" y="${y(row.income).toFixed(1)}" width="${barW}" height="${(padTop + plotH - y(row.income)).toFixed(1)}" rx="3" fill="#2e7d4f"><title>${row.label} income: $${row.income.toFixed(2)}</title></rect>`;
    out += `<rect x="${(gx + 3).toFixed(1)}" y="${y(row.spending).toFixed(1)}" width="${barW}" height="${(padTop + plotH - y(row.spending)).toFixed(1)}" rx="3" fill="#c2527a"><title>${row.label} spending: $${row.spending.toFixed(2)}</title></rect>`;
    out += `<text x="${gx}" y="${height - 8}" text-anchor="middle" class="chart-label">${row.label}</text>`;
  });
  out += '</svg>';
  return out;
}
