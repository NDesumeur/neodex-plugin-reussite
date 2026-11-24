// Réussite : Le solitaire classique : monter les quatre familles de l'As au Roi, avec des colonnes en ordre décroissant et des couleurs alternées.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Réussite</span><span class="hint">Glisser les cartes · un clic les envoie à la meilleure place · clic sur le talon : piocher</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="256"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="rsFs">PLEIN ÉCRAN</button><button class="btn" id="rsUndo">ANNULER</button></div>
      <label class="row">Réussite <select id="rsVar" class="f"><option value="k">Klondike</option><option value="fc">FreeCell</option><option value="s1">Spider (une couleur)</option><option value="s2">Spider (deux couleurs)</option></select></label>
      <label class="row" id="rsDraw3Row"><input type="checkbox" id="rsDraw3"> Piocher 3 cartes à la fois</label>
      <div class="hint" id="rsRules"></div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 480px;min-width:min(100%,320px);position:relative}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 320 / 256));max-width:none}
.gameBox canvas{image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(280px,calc((100vh - 170px) * 320 / 256)));height:auto;aspect-ratio:320/256}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "RÉUSSITE", T: {"k": "#030c08", "k2": "#082014", "fill": "#0e3020", "fillOn": "#14402a", "hl": "#1a4a32", "line": "#2e7050", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#1a4a32", "btnHi": "#4a9a6a", "btnLo": "#082014", "btnHov": "#1e5a3a", "btnHovHi": "#6aba8a", "text": "#f0fff4", "muted": "#a8d8b8", "acc2": "#ff4a5a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#05140c", "bgDot": "#0e3020", "bgDot2": "#082014", "spark": "#2e7050", "spark2": "#ff4a5a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["..kkkkkkk...", "..kwwwwwk...", "kkkkkkkwk...", "kwwwwwkwk...", "kwrwrwkwk...", "kwrrrwkwk...", "kwrrrwkwk...", "kwwrwwkwk...", "kwwwwwkkk...", "kwwwwwk.....", "kkkkkkk.....", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"], [/^PLEIN/, "full"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 256, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
/* ---------- Réussite : le solitaire classique (Klondike). Monter les quatre familles de l'As au Roi ; colonnes en ordre décroissant, couleurs alternées. ---------- */
const RS = {CW: 30, CH: 40, X0: 8, DX: 44, TOP: 8, TAB: 56};
const RS_FONT = {A: ['.#.', '#.#', '###', '#.#', '#.#'], 2: ['##.', '..#', '.#.', '#..', '###'], 3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'], 9: ['###', '#.#', '###', '..#', '##.'], 1: ['.#', '##', '.#', '.#', '.#'], 0: ['###', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'], D: ['##.', '#.#', '#.#', '#.#', '##.'], R: ['##.', '#.#', '##.', '#.#', '#.#']};
const RS_RANK = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R'];
const RS_SUIT5 = [['.#.#.', '#####', '#####', '.###.', '..#..'], ['..#..', '.###.', '#####', '.###.', '..#..'], ['..#..', '.###.', '#####', '#####', '.#.#.'], ['.###.', '.###.', '#####', '#.#.#', '.###.']];  // cœur, carreau, pique, trèfle
const RS_SUIT9 = [['.##...##.', '####.####', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'], ['....#....', '...###...', '..#####..', '.#######.', '#########', '.#######.', '..#####..', '...###...', '....#....'],
  ['....#....', '...###...', '..#####..', '.#######.', '#########', '#########', '.##.#.##.', '....#....', '...###...'], ['...###...', '..#####..', '...###...', '.##.#.##.', '#########', '.##.#.##.', '....#....', '...###...']];
const rsRed = s => s < 2;
function rsFace(s, r) {  // une carte de 30 × 40 dessinée pixel par pixel
  return cnv(RS.CW, RS.CH, b => {
    px(b, '#05010b', 1, 0, RS.CW - 2, RS.CH); px(b, '#05010b', 0, 1, RS.CW, RS.CH - 2); px(b, '#fbf6ec', 1, 1, RS.CW - 2, RS.CH - 2); px(b, '#e8dcc8', 1, RS.CH - 2, RS.CW - 2, 1); px(b, '#e8dcc8', RS.CW - 2, 1, 1, RS.CH - 2);
    const col = rsRed(s) ? '#d8304a' : '#1a1428', text = (t, x, y, k = 1) => { let cx = x; for (const ch of t) { const gl = RS_FONT[ch]; gl.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') px(b, col, cx + i * k, y + j * k, k, k); })); cx += (gl[0].length + 1) * k; } };
    const pat = (rows, x, y, c = col) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') px(b, c, x + i, y + j); }));
    text(RS_RANK[r], 3, 3); pat(RS_SUIT5[s], 3, 10);
    if (r >= 10) {  // les figures : un cadre doré, la lettre en grand, une petite couronne pour le Roi et la Dame
      px(b, '#e8b040', 7, 9, 18, 26); px(b, '#fbf6ec', 8, 10, 16, 24); px(b, rsRed(s) ? '#ffe0e4' : '#e4e0f0', 9, 11, 14, 22);
      if (r > 10) pat(['#.#.#', '#####', '#####'], 13, 13, '#e8b040'); else pat(['.###.', '#####', '.#.#.'], 13, 13, '#3f6aff');
      text(RS_RANK[r], 13, 19, 2); pat(RS_SUIT5[s], 14, 30 - 2);
    } else pat(RS_SUIT9[s], 11, 18);
  });
}
const RS_FACES = [0, 1, 2, 3].map(s => RS_RANK.map((_, r) => rsFace(s, r)));
const RS_BACK = cnv(RS.CW, RS.CH, b => {
  px(b, '#05010b', 1, 0, RS.CW - 2, RS.CH); px(b, '#05010b', 0, 1, RS.CW, RS.CH - 2); px(b, '#fbf6ec', 1, 1, RS.CW - 2, RS.CH - 2); px(b, '#5a2a8a', 3, 3, RS.CW - 6, RS.CH - 6);
  for (let y = 3; y < RS.CH - 3; y++) for (let x = 3; x < RS.CW - 3; x++) if ((x + y) % 6 === 0 || (x - y + 60) % 6 === 0) px(b, '#8a5ac0', x, y);
  px(b, '#ffd84a', 13, 18, 4, 4); px(b, '#05010b', 14, 19, 2, 2);
});
const RS_SLOT = cnv(RS.CW, RS.CH, b => { for (let x = 1; x < RS.CW - 1; x += 2) { px(b, '#0e4a2c', x, 0); px(b, '#0e4a2c', x, RS.CH - 1); } for (let y = 1; y < RS.CH - 1; y += 2) { px(b, '#0e4a2c', 0, y); px(b, '#0e4a2c', RS.CW - 1, y); } });
const rss = gstore('reussite', {games: 0, wins: 0, bestTime: 0, draw3: false}); rss.v ??= 'k'; rss.sv ??= {};
// trois réussites : le Klondike (k), FreeCell (fc : 8 colonnes, 4 cases libres, tout est visible) et Spider (s1 / s2 : 10 colonnes, deux jeux, une ou deux couleurs)
const RS_V = {k: {cols: 7, dx: 44, x0: 8, name: 'Klondike'}, fc: {cols: 8, dx: 38, x0: 8, name: 'FreeCell'}, s1: {cols: 10, dx: 31, x0: 5, name: 'Spider (une couleur)'}, s2: {cols: 10, dx: 31, x0: 5, name: 'Spider (deux couleurs)'}};
const rsSpider = () => rss.v === 's1' || rss.v === 's2';
const rsG = () => RS_V[rss.v] || RS_V.k, rsX = i => rsG().x0 + i * rsG().dx;
const rsStat = () => rss.v === 'k' ? rss : (rss.sv[rss.v] ??= {games: 0, wins: 0, bestTime: 0});
let rs = null;
function rsShuffle(deck) { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } return deck; }
function rsNew() {
  const v = rss.v, base = {mode: 'play', stock: [], waste: [], found: [[], [], [], []], cells: [null, null, null, null], done: [], hist: [], moves: 0, t0: Date.now(), time: 0, drag: null, wonAt: 0, auto: 0, bounce: null, trail: null};
  let tab;
  if (v === 'fc') { const deck = rsShuffle([0, 1, 2, 3].flatMap(s => RS_RANK.map((_, r) => ({s, r, up: true})))); tab = [...Array(8)].map(() => []); deck.forEach((c, i) => tab[i % 8].push(c)); }
  else if (v === 's1' || v === 's2') {
    const suits = v === 's1' ? [2] : [2, 0], deck = rsShuffle([...Array(8)].flatMap((_, k) => RS_RANK.map((_, r) => ({s: suits[k % suits.length], r, up: false}))));
    tab = [...Array(10)].map((_, i) => deck.splice(0, i < 4 ? 6 : 5)); tab.forEach(c => c[c.length - 1].up = true); base.stock = deck;
  } else {
    const deck = rsShuffle([0, 1, 2, 3].flatMap(s => RS_RANK.map((_, r) => ({s, r, up: false}))));
    tab = [...Array(7)].map((_, i) => deck.splice(0, i + 1)); tab.forEach(c => c[c.length - 1].up = true); base.stock = deck;
  }
  rs = Object.assign(rs || {tick: 0, raf: 0}, base, {tab}); rsInfo();
}
const rsSnap = () => JSON.stringify({stock: rs.stock, waste: rs.waste, found: rs.found, cells: rs.cells, done: rs.done, tab: rs.tab, moves: rs.moves});
function rsUndo() { const h = rs.hist.pop(); if (!h || rs.mode !== 'play') return; Object.assign(rs, JSON.parse(h)); beep(330, .04); }
const rsCanFound = (c, f) => f.length ? f[f.length - 1].s === c.s && f[f.length - 1].r === c.r - 1 : c.r === 0;
const rsCanTab = (c, col) => col.length ? col[col.length - 1].up && rsRed(col[col.length - 1].s) !== rsRed(c.s) && col[col.length - 1].r === c.r + 1 : c.r === 12;
// une pile qu'on peut déplacer d'un bloc : au Klondike toutes les cartes visibles, à FreeCell en couleurs alternées, à Spider dans la même couleur
const rsRun = cards => cards.every((c, k) => c.up && (k === 0 || (rsSpider() ? c.s === cards[k - 1].s : rsRed(c.s) !== rsRed(cards[k - 1].s)) && c.r === cards[k - 1].r - 1)) || rss.v === 'k' && cards.every(c => c.up);
const rsFcMax = toEmpty => (rs.cells.filter(c => !c).length + 1) * 2 ** Math.max(0, rs.tab.filter(c => !c.length).length - (toEmpty ? 1 : 0));  // FreeCell : combien de cartes d'un coup, avec les cases et colonnes libres
function rsFits(cards, to) {  // la pile peut-elle aller là ?
  const c = cards[0];
  if (to.kind === 'found') return rss.v !== 's1' && rss.v !== 's2' && cards.length === 1 && rsCanFound(c, rs.found[to.i]);
  if (to.kind === 'cell') return rss.v === 'fc' && cards.length === 1 && !rs.cells[to.i];
  const col = rs.tab[to.i], top = col[col.length - 1];
  if (rss.v === 'k') return rsCanTab(c, col);
  if (rss.v === 'fc') return cards.length <= rsFcMax(!col.length) && (!top || rsRed(top.s) !== rsRed(c.s) && top.r === c.r + 1);
  return !top || top.up && top.r === c.r + 1;
}
function rsAfter() {
  if (rss.v !== 'fc') for (const col of rs.tab) if (col.length && !col[col.length - 1].up) col[col.length - 1].up = true;
  if (rsSpider()) for (const col of rs.tab) {  // Spider : une suite complète du Roi à l'As, dans la même couleur, s'en va
    const run = col.slice(-13); if (run.length === 13 && run[0].r === 12 && rsRun(run)) { col.splice(-13); rs.done.push(run[0].s); if (col.length) col[col.length - 1].up = true; [660, 880, 1100].forEach((f, k) => setTimeout(() => beep(f, .08, 'triangle'), k * 70)); }
  }
  if (rsSpider() ? rs.done.length === 8 : rs.found.every(f => f.length === 13)) {
    const S = rsStat(); rs.mode = 'won'; rs.wonAt = rs.tick; rs.time = Math.round((Date.now() - rs.t0) / 1000); S.wins++; if (!S.bestTime || rs.time < S.bestTime) S.bestTime = rs.time; saveGames(); rsInfo(); [523, 659, 784, 1047, 1319].forEach((f, k) => setTimeout(() => beep(f, .16, 'triangle'), k * 100));
    rs.bounce = [];  // les cartes qui rebondissent, l'une après l'autre
  }
}
function rsStock() {
  if (rsSpider()) {  // une carte sur chaque colonne ; toutes doivent être occupées
    if (!rs.stock.length) return beep(140, .05);
    if (rs.tab.some(c => !c.length)) { toast('Remplis d’abord les colonnes vides'); return beep(140, .05); }
    rs.hist.push(rsSnap()); rs.moves++; for (const col of rs.tab) { const c = rs.stock.pop(); c.up = true; col.push(c); } beep(500, .05, 'square', 0, .04); rsAfter(); return;
  }
  rs.hist.push(rsSnap()); rs.moves++;
  if (rs.stock.length) { for (let k = 0; k < (rss.draw3 ? 3 : 1) && rs.stock.length; k++) { const c = rs.stock.pop(); c.up = true; rs.waste.push(c); } beep(500, .03, 'square', 0, .04); }
  else { rs.stock = rs.waste.reverse().map(c => ({...c, up: false})); rs.waste = []; beep(250, .06, 'square', 0, .04); }
}
function rsPlace(cards, from, to) {  // pose une pile ; rend vrai si le coup est permis
  if (!rsFits(cards, to)) return false;
  rs.hist.push(rsSnap()); rs.moves++;
  if (from.kind === 'cell') rs.cells[from.i] = null; else { const src = from.kind === 'waste' ? rs.waste : from.kind === 'found' ? rs.found[from.i] : rs.tab[from.i]; src.splice(src.length - cards.length, cards.length); }
  if (to.kind === 'cell') rs.cells[to.i] = cards[0]; else (to.kind === 'found' ? rs.found[to.i] : rs.tab[to.i]).push(...cards);
  beep(to.kind === 'found' ? 880 : 620, .04, 'triangle', 0, .05); rsAfter(); return true;
}
function rsAutoMove(cards, from) {  // un simple clic : la meilleure place
  if (cards.length === 1 && !rsSpider()) for (let i = 0; i < 4; i++) if (rsCanFound(cards[0], rs.found[i]) && rsPlace(cards, from, {kind: 'found', i})) return true;
  const n = rs.tab.length, others = [...Array(n).keys()].filter(i => !(from.kind === 'tab' && from.i === i));
  if (rsSpider()) for (const i of others) { const t = rs.tab[i].at(-1); if (t && t.s === cards[0].s && rsPlace(cards, from, {kind: 'tab', i})) return true; }  // Spider : de préférence sur la même couleur
  for (const i of others) if (rs.tab[i].length && rsPlace(cards, from, {kind: 'tab', i})) return true;
  for (const i of others) if (!rs.tab[i].length && rsPlace(cards, from, {kind: 'tab', i})) return true;
  if (rss.v === 'fc' && from.kind !== 'cell' && cards.length === 1) for (let i = 0; i < 4; i++) if (rsPlace(cards, from, {kind: 'cell', i})) return true;
  return false;
}
const rsOff = col => { const down = col.filter(c => !c.up).length, up = col.length - down, room = H - RS.TAB - RS.CH - 10 - down * 5; return [5, up > 1 ? Math.max(4, Math.min(12, Math.floor(room / (up - 1)))) : 12]; };
const rsColY = (col, k) => { const [d, u] = rsOff(col); let y = RS.TAB; for (let i = 0; i < k; i++) y += col[i].up ? u : d; return y; };
function rsPick(x, y) {  // la carte (ou la pile) sous le pointeur
  const W1 = RS.CW, v = rss.v;
  if (y >= RS.TOP && y < RS.TOP + RS.CH) {
    const hit = i => x >= rsX(i) && x < rsX(i) + W1;
    if (v === 'fc') { for (let i = 0; i < 4; i++) if (hit(i) && rs.cells[i]) return {kind: 'cell', i, cards: [rs.cells[i]]}; for (let i = 0; i < 4; i++) if (hit(4 + i) && rs.found[i].length) return {kind: 'found', i, cards: rs.found[i].slice(-1)}; return null; }
    if (hit(0)) return {kind: 'stock'};
    if (rsSpider()) return null;
    const wx = rsX(1) + Math.max(0, Math.min(2, rs.waste.length - 1)) * (rss.draw3 ? 6 : 0); if (x >= rsX(1) && x < wx + W1 && rs.waste.length) return {kind: 'waste', cards: rs.waste.slice(-1)};
    for (let i = 0; i < 4; i++) if (hit(3 + i) && rs.found[i].length) return {kind: 'found', i, cards: rs.found[i].slice(-1)};
  }
  for (let i = 0; i < rs.tab.length; i++) { const cx = rsX(i); if (x < cx || x >= cx + W1) continue; const col = rs.tab[i];
    for (let k = col.length - 1; k >= 0; k--) { const cy = rsColY(col, k); if (y >= cy && y < cy + RS.CH) { const cards = col.slice(k); return col[k].up && rsRun(cards) ? {kind: 'tab', i, cards} : null; } } }
  return null;
}
function rsDrop(x, y) {
  const near = i => x >= rsX(i) - 6 && x < rsX(i) + RS.CW + 6;
  if (y < RS.TOP + RS.CH + 8) {
    if (rss.v === 'fc') { for (let i = 0; i < 4; i++) if (near(i)) return {kind: 'cell', i}; for (let i = 0; i < 4; i++) if (near(4 + i)) return {kind: 'found', i}; }
    else if (rss.v === 'k') for (let i = 0; i < 4; i++) if (near(3 + i)) return {kind: 'found', i};
  }
  for (let i = 0; i < rs.tab.length; i++) if (near(i) && y >= RS.TAB - 8) return {kind: 'tab', i};
  return null;
}
const RS_BG = cnv(W, H, b => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(b, (x * 5 + y * 3) % 11 === 0 ? '#1c7a4a' : (x + y) % 2 ? '#14643c' : '#156a3e', x, y); });
const rsSorted = col => col.every((c, k) => k === 0 || c.r < col[k - 1].r);  // FreeCell : une colonne déjà rangée en descendant
function rsDraw() {
  const v = rss.v;
  if (rs.mode === 'play' && !rs.drag && rs.tick % 6 === 0 && (v === 'k' ? !rs.stock.length && !rs.waste.length && rs.tab.every(c => c.every(k => k.up)) : v === 'fc' && rs.tab.every(rsSorted))) {  // la fin est jouée d'avance : on finit tout seul
    let moved = false;
    if (v === 'fc') for (let i = 0; i < 4 && !moved; i++) if (rs.cells[i]) for (let f = 0; f < 4 && !moved; f++) if (rsCanFound(rs.cells[i], rs.found[f])) moved = rsPlace([rs.cells[i]], {kind: 'cell', i}, {kind: 'found', i: f});
    for (let i = 0; i < rs.tab.length && !moved && rs.mode === 'play'; i++) { const col = rs.tab[i]; if (col.length) for (let f = 0; f < 4 && !moved; f++) if (rsCanFound(col.at(-1), rs.found[f])) moved = rsPlace(col.slice(-1), {kind: 'tab', i}, {kind: 'found', i: f}); }
  }
  g.drawImage(RS_BG, 0, 0);
  const dragging = rs.drag && rs.drag.moved ? rs.drag : null, hidden = c => dragging && dragging.cards.includes(c);
  const suitMark = (i, x) => RS_SUIT9[i].forEach((row, j) => [...row].forEach((ch, q) => { if (ch === '#') px(g, '#0e4a2c', x + 11 + q, RS.TOP + 16 + j); }));
  const foundAt = (i, x) => { const f = rs.found[i]; g.drawImage(RS_SLOT, x, RS.TOP); const top = f.length && hidden(f[f.length - 1]) ? f[f.length - 2] : f[f.length - 1]; if (top) g.drawImage(RS_FACES[top.s][top.r], x, RS.TOP); else suitMark(i, x); };
  if (v === 'fc') {
    for (let i = 0; i < 4; i++) { g.drawImage(RS_SLOT, rsX(i), RS.TOP); const c = rs.cells[i]; if (c && !hidden(c)) g.drawImage(RS_FACES[c.s][c.r], rsX(i), RS.TOP); }
    for (let i = 0; i < 4; i++) foundAt(i, rsX(4 + i));
  } else if (rsSpider()) {
    g.drawImage(rs.stock.length ? RS_BACK : RS_SLOT, rsX(0), RS.TOP); if (rs.stock.length) pxFont(g, String(rs.stock.length / 10), rsX(0) + 15, RS.TOP + 24, '#ffd84a', 7, 'center');
    for (let i = 0; i < 8; i++) { const x = rsX(2 + i), s = rs.done[i]; if (s == null) g.drawImage(RS_SLOT, x, RS.TOP); else g.drawImage(RS_FACES[s][12], x, RS.TOP); }
  } else {
    g.drawImage(rs.stock.length ? RS_BACK : RS_SLOT, rsX(0), RS.TOP); if (!rs.stock.length) { px(g, '#0e4a2c', rsX(0) + 11, RS.TOP + 16, 8, 8); px(g, '#156a3e', rsX(0) + 13, RS.TOP + 18, 4, 4); }
    const ws = rs.waste.slice(rss.draw3 ? -3 : -1); ws.forEach((c, k) => { if (!hidden(c)) g.drawImage(RS_FACES[c.s][c.r], rsX(1) + k * (rss.draw3 ? 6 : 0), RS.TOP); });
    for (let i = 0; i < 4; i++) foundAt(i, rsX(3 + i));
  }
  for (let i = 0; i < rs.tab.length; i++) { const col = rs.tab[i], x = rsX(i); if (!col.length) g.drawImage(RS_SLOT, x, RS.TAB); col.forEach((c, k) => { if (!hidden(c)) g.drawImage(c.up ? RS_FACES[c.s][c.r] : RS_BACK, x, rsColY(col, k)); }); }
  if (dragging) dragging.cards.forEach((c, k) => { px(g, 'rgba(0,0,0,.3)', dragging.x - dragging.ox + 3, dragging.y - dragging.oy + k * 12 + 3, RS.CW, RS.CH); g.drawImage(RS_FACES[c.s][c.r], Math.round(dragging.x - dragging.ox), Math.round(dragging.y - dragging.oy + k * 12)); });
  if (rs.bounce) rsBounce();
  pxFont(g, rsG().name + ' · ' + clock(rs.mode === 'won' ? rs.time : (Date.now() - rs.t0) / 1000) + ' · ' + rs.moves + (rs.moves > 1 ? ' coups' : ' coup'), W - 6, H - 4, '#a8e0b8', 6, 'right');
  if (rs.mode === 'won' && rs.tick - rs.wonAt > 150) gameText(g, W, [['RÉUSSIE !', '#ffd84a', 14], [clock(rs.time) + ' · ' + rs.moves + (rs.moves > 1 ? ' coups' : ' coup'), '#ffffff'], ['Clic pour une nouvelle donne', '#a8e0b8']], 110);
}
// la victoire : les cartes partent une à une et rebondissent sur le bas de l'écran, en laissant leur trace
function rsBounce() {
  const B = rs.bounce, age = rs.tick - rs.wonAt;
  if (age % 7 === 0 && age < 140 && B.length < 18) { const s = B.length % 4, r = 12 - Math.floor(B.length / 4) % 13; B.push({x: rsX(rss.v === 'fc' ? 4 + s : rsSpider() ? 2 + (B.length % 8) : 3 + s), y: RS.TOP, vx: (Math.random() < .5 ? -1 : 1) * (1.2 + Math.random() * 1.6), vy: -Math.random() * 2, s: rsSpider() ? (rs.done[B.length % 8] ?? 2) : s, r}); }
  for (const c of B) { if (c.x < -RS.CW || c.x > W) continue; c.vy += .35; c.x += c.vx; c.y += c.vy; if (c.y > H - RS.CH) { c.y = H - RS.CH; c.vy *= -.72; } }
  if (!rs.trail) rs.trail = cnv(W, H, () => {}); const tg = rs.trail.getContext('2d'); if (age % 2 === 0) for (const c of B) if (c.x > -RS.CW && c.x < W) tg.drawImage(RS_FACES[c.s][c.r], Math.round(c.x), Math.round(c.y));
  g.drawImage(rs.trail, 0, 0); for (const c of B) if (c.x > -RS.CW && c.x < W) g.drawImage(RS_FACES[c.s][c.r], Math.round(c.x), Math.round(c.y));
}
cv.onpointerdown = e => {
  e.preventDefault(); if (!rs) return; if (rs.mode === 'won') { if (rs.tick - rs.wonAt > 30) { rsStat().games++; rsNew(); } return; }
  const [x, y] = cpos(e), p = rsPick(x, y); if (!p) return;
  if (p.kind === 'stock') return rsStock();
  const cy = p.kind === 'tab' ? rsColY(rs.tab[p.i], rs.tab[p.i].length - p.cards.length) : RS.TOP, cx = p.kind === 'tab' ? rsX(p.i) : p.kind === 'waste' ? rsX(1) + (rss.draw3 ? Math.max(0, Math.min(2, rs.waste.length - 1)) * 6 : 0) : p.kind === 'cell' ? rsX(p.i) : rsX((rss.v === 'fc' ? 4 : 3) + p.i);
  rs.drag = {...p, from: {kind: p.kind, i: p.i}, x, y, ox: x - cx, oy: y - cy, sx: x, sy: y, moved: false}; cv.setPointerCapture(e.pointerId);
};
cv.onpointermove = e => { if (!rs?.drag) return; const [x, y] = cpos(e); rs.drag.x = x; rs.drag.y = y; if (Math.hypot(x - rs.drag.sx, y - rs.drag.sy) > 3) rs.drag.moved = true; };
cv.onpointerup = e => {
  const d = rs?.drag; if (!d) return; rs.drag = null;
  if (!d.moved) { if (!rsAutoMove(d.cards, d.from)) beep(140, .05); return; }
  const to = rsDrop(d.x - d.ox + RS.CW / 2, d.y - d.oy + 6); if (!to || !rsPlace(d.cards, d.from, to)) beep(140, .05);
};
const RS_RULES = {
  k: 'Colonnes : une carte se pose sur une carte d’une unité plus forte et de l’autre couleur (un 7 rouge sur un 8 noir). Une colonne vide n’accepte qu’un Roi. Familles (en haut à droite) : de l’As au Roi, dans la même couleur. Quand tout est découvert, le jeu termine tout seul.',
  fc: 'Toutes les cartes sont visibles. En colonne : une unité plus faible, de l’autre couleur. Les 4 cases libres (en haut à gauche) gardent une carte chacune ; on déplace d’un bloc autant de cartes que les cases et colonnes vides le permettent. Familles en haut à droite, de l’As au Roi. Presque toutes les donnes se gagnent.',
  s1: 'Deux jeux, une seule couleur. Une carte se pose sur une carte d’une unité plus forte ; on déplace d’un bloc une suite de la même couleur. Une suite complète du Roi à l’As s’en va. Le talon (en haut à gauche) donne une carte à chaque colonne, quand aucune n’est vide.',
  s2: 'Deux jeux, deux couleurs (pique et cœur). Une carte se pose sur une carte d’une unité plus forte, de n’importe quelle couleur, mais on ne déplace d’un bloc qu’une suite de la même couleur. Une suite complète du Roi à l’As s’en va. Le talon donne une carte à chaque colonne, quand aucune n’est vide.'};
function rsInfo() { const S = rsStat(); showStats([['Réussites (' + rsG().name + ')', S.wins + ' / ' + Math.max(S.games, S.wins)], ['Meilleur temps', S.bestTime ? clock(S.bestTime) : '-']]); $('rsDraw3').checked = rss.draw3;
  $('rsVar').value = rss.v; $('rsDraw3Row').style.display = rss.v === 'k' ? '' : 'none'; $('rsRules').textContent = RS_RULES[rss.v]; }
$('rsVar').onchange = () => { rss.v = RS_V[$('rsVar').value] ? $('rsVar').value : 'k'; rsStat().games++; saveGames(); rsNew(); $('rsVar').blur(); };
$('rsDraw3').onchange = () => { rss.draw3 = $('rsDraw3').checked; saveGames(); rsStat().games++; rsNew(); };
$('rsUndo').onclick = () => { rsUndo(); $('rsUndo').blur(); };
$('gNew').onclick = () => { rsStat().games++; saveGames(); rsNew(); $('gNew').blur(); };
function rsCheck() {  // vérification : les donnes des trois réussites, les règles de chacune, la suite complète de Spider qui s'en va
  const keep = rs, kv = rss.v, ks = JSON.stringify(rss.sv), kw = [rss.games, rss.wins, rss.bestTime], bad = [], vol = actx; actx = {currentTime: 0, createOscillator: () => { throw 0; }};
  try {
    rss.v = 'k'; rs = null; rsNew(); const all = [...rs.stock, ...rs.tab.flat()], ids = new Set(all.map(c => c.s * 13 + c.r));
    if (!(all.length === 52 && ids.size === 52 && rs.tab.flat().length === 28 && rsCanFound({s: 2, r: 0}, []) && !rsCanFound({s: 2, r: 1}, []) && rsCanTab({s: 0, r: 5}, [{s: 2, r: 6, up: true}]) && !rsCanTab({s: 0, r: 5}, [{s: 1, r: 6, up: true}]) && rsCanTab({s: 3, r: 12}, []))) bad.push('klondike');
    rss.v = 'fc'; rsNew(); if (rs.tab.flat().length !== 52 || new Set(rs.tab.flat().map(c => c.s * 13 + c.r)).size !== 52 || rs.tab[0].length !== 7 || rs.tab[7].length !== 6 || !rs.tab.flat().every(c => c.up)) bad.push('donne freecell');
    if (rsFcMax(false) !== 5) bad.push('freecell : 5 cartes d’un coup');
    rs.tab = [[{s: 2, r: 7, up: true}], [{s: 0, r: 6, up: true}, {s: 3, r: 5, up: true}], [], [], [], [], [], []];  // 6 colonnes vides : beaucoup de cartes d'un coup
    if (!rsPlace(rs.tab[1].slice(), {kind: 'tab', i: 1}, {kind: 'tab', i: 0}) || rs.tab[0].length !== 3) bad.push('freecell : bloc');
    if (!rsPlace(rs.tab[0].slice(-1), {kind: 'tab', i: 0}, {kind: 'cell', i: 0}) || !rs.cells[0] || rsFits([{s: 1, r: 1, up: true}], {kind: 'cell', i: 0})) bad.push('freecell : case libre');
    rss.v = 's2'; rsNew(); if (rs.tab.flat().length !== 54 || rs.stock.length !== 50 || rs.tab[0].length !== 6 || rs.tab[9].length !== 5 || new Set([...rs.stock, ...rs.tab.flat()].map(c => c.s)).size !== 2) bad.push('donne spider');
    rsStock(); if (rs.stock.length !== 40 || !rs.tab.every(c => c.at(-1).up)) bad.push('spider : talon');
    const run = RS_RANK.map((_, r) => ({s: 0, r: 12 - r, up: true})); rs.tab[3] = [{s: 2, r: 4, up: false}, ...run.slice(0, 12)]; rs.tab[4].push(run[12]);
    if (!rsPlace([run[12]], {kind: 'tab', i: 4}, {kind: 'tab', i: 3}) || rs.done.length !== 1 || rs.tab[3].length !== 1 || !rs.tab[3][0].up) bad.push('spider : suite complète');
    if (rsRun([{s: 0, r: 5, up: true}, {s: 2, r: 4, up: true}])) bad.push('spider : deux couleurs d’un bloc');
    rs.done = [0, 0, 0, 0, 2, 2, 2]; rs.tab[5] = [...RS_RANK.map((_, r) => ({s: 2, r: 12 - r, up: true}))]; rsAfter(); if (rs.mode !== 'won' || !rs.bounce) bad.push('spider : victoire');
    for (let i = 0; i < 40; i++) { rs.tick++; rsBounce(); } if (!rs.bounce.length) bad.push('rebonds');
  } catch (e) { bad.push('erreur ' + e.message); }
  actx = vol; rs = keep; rss.v = kv; rss.sv = JSON.parse(ks); [rss.games, rss.wins, rss.bestTime] = kw;
  return bad.length ? bad.join(', ') : 'ok';
}
{ const c = rsCheck(); console.assert(c === 'ok', 'réussite', c); cv.dataset.selfcheck = c; }
cv.__rs = {st: () => rs, rss: () => rss, check: rsCheck, X: rsX, colY: rsColY, RS};
$('rsFs').onclick = () => { $('rsFs').blur(); try { document.fullscreenElement ? document.exitFullscreen() : cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
ctx.onOpen(() => { if (!rs) rsNew(); gameLoop(rs, 'reussite', () => {}, rsDraw); rsInfo(); });

}
