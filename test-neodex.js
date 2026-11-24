// lancé par le test « local » de NeoDex : une nouvelle partie, le plein écran et la place prise par le jeu (avec NEO_SHOTS : garde une image du jeu)
module.exports = async ({ pj, sleep }) => {
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, '.-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await pj(`document.getElementById('gNew').click(), 0`); await sleep(1500);
  for (const k of ['ArrowUp', 'ArrowDown']) { await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`); await sleep(300); await pj(`document.dispatchEvent(new KeyboardEvent('keyup', {key: '${k}', bubbles: true})), 0`); }
  await shot('1-partie');
  await pj(`document.getElementById('rsFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await shot('2-plein-ecran');
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l’écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  // les trois réussites : la vérification interne, FreeCell (un clic envoie la carte à sa place), Spider (le talon donne une carte à chaque colonne)
  if (await pj(`document.getElementById('gc').dataset.selfcheck`) !== 'ok') throw new Error('vérification : ' + await pj(`document.getElementById('gc').dataset.selfcheck`));
  const R = code => pj(`(() => { const T = document.getElementById('gc').__rs, rs = T.st(); ${code} })()`);
  const pickV = v => pj(`(() => { const s = document.getElementById('rsVar'); s.value = '${v}'; s.dispatchEvent(new Event('change')); return 0; })()`);
  const clickAt = (x, y) => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(), o = {bubbles: true, pointerId: 1, clientX: r.left + ${x} / 320 * r.width, clientY: r.top + ${y} / 256 * r.height}; c.dispatchEvent(new PointerEvent('pointerdown', o)); c.dispatchEvent(new PointerEvent('pointerup', o)); return 0; })()`);
  const keepV = await R('return T.rss().v;');
  await pickV('fc'); await sleep(200); await shot('3-freecell');
  if (await R('return rs.tab.length + "|" + rs.tab.flat().length + "|" + rs.cells.length;') !== '8|52|4') throw new Error('donne de FreeCell');
  const top = await R('const col = rs.tab[0]; return [T.X(0) + 15, T.colY(col, col.length - 1) + 20];'); await clickAt(top[0], top[1]); await sleep(200);
  if (await R('return rs.moves;') !== 1) throw new Error('FreeCell : le clic devait déplacer la carte');
  await pickV('s2'); await sleep(200); await shot('4-spider');
  if (await R('return rs.tab.length + "|" + rs.stock.length;') !== '10|50') throw new Error('donne de Spider');
  await clickAt(20, 28); await sleep(200);
  if (await R('return rs.stock.length + "|" + rs.tab.flat().length;') !== '40|64') throw new Error('Spider : le talon');
  await shot('5-spider-talon');
  // la victoire : la dernière suite rangée d'un clic, puis les cartes qui rebondissent
  await R('rs.done = [0, 0, 0, 0, 2, 2, 2]; rs.tab[0] = Array.from({length: 12}, (_, k) => ({s: 2, r: 12 - k, up: true})); rs.tab[1] = [{s: 2, r: 0, up: true}]; return 0;'); await sleep(100);
  const ace = await R('return [T.X(1) + 15, T.colY(rs.tab[1], 0) + 20];'); await clickAt(ace[0], ace[1]); await sleep(1600);
  if (await R('return rs.mode + rs.bounce.length;') < 'won1') throw new Error('victoire et rebonds : ' + await R('return rs.mode;'));
  await shot('6-rebonds');
  await pickV(keepV); await sleep(100);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'nouvelle partie · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
