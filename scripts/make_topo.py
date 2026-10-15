"""Genera public/topo.svg: curvas de nivel reales de un terreno sintético.

Terreno = suma de gaussianas (picos y una cresta). Las curvas se trazan con
marching squares y se encadenan en polilíneas. Cada quinta curva es "maestra"
(más gruesa), como en una carta topográfica. Uso: python scripts/make_topo.py
"""
import math
import random

W, H, STEP = 1600, 1000, 10
random.seed(69)

PEAKS = [(random.uniform(0, W), random.uniform(0, H), random.uniform(120, 340),
          random.uniform(0.5, 1.0)) for _ in range(14)]


def height(x, y):
    h = 0.0
    for px, py, r, a in PEAKS:
        h += a * math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * r * r))
    h += 0.35 * math.exp(-((y - 0.55 * H + 0.25 * (x - W / 2)) ** 2) / (2 * 150 ** 2))
    return h


cols, rows = W // STEP + 1, H // STEP + 1
grid = [[height(i * STEP, j * STEP) for i in range(cols)] for j in range(rows)]


def interp(p1, p2, v1, v2, level):
    t = (level - v1) / (v2 - v1) if v2 != v1 else 0.5
    return (round(p1[0] + t * (p2[0] - p1[0]), 1), round(p1[1] + t * (p2[1] - p1[1]), 1))


def segments(level):
    segs = []
    for j in range(rows - 1):
        for i in range(cols - 1):
            corners = [(i * STEP, j * STEP), ((i + 1) * STEP, j * STEP),
                       ((i + 1) * STEP, (j + 1) * STEP), (i * STEP, (j + 1) * STEP)]
            vals = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]]
            pts = []
            for k in range(4):
                a, b = k, (k + 1) % 4
                if (vals[a] >= level) != (vals[b] >= level):
                    pts.append(interp(corners[a], corners[b], vals[a], vals[b], level))
            if len(pts) == 2:
                segs.append((pts[0], pts[1]))
            elif len(pts) == 4:
                segs.append((pts[0], pts[1]))
                segs.append((pts[2], pts[3]))
    return segs


def chain(segs):
    by_point = {}
    for idx, (a, b) in enumerate(segs):
        by_point.setdefault(a, []).append(idx)
        by_point.setdefault(b, []).append(idx)
    used = [False] * len(segs)
    lines = []
    for start in range(len(segs)):
        if used[start]:
            continue
        used[start] = True
        line = list(segs[start])
        for direction in (0, 1):
            while True:
                end = line[-1] if direction == 0 else line[0]
                nxt = next((k for k in by_point.get(end, []) if not used[k]), None)
                if nxt is None:
                    break
                used[nxt] = True
                a, b = segs[nxt]
                new = b if a == end else a
                if direction == 0:
                    line.append(new)
                else:
                    line.insert(0, new)
        if len(line) > 4:
            lines.append(line)
    return lines


def to_path(line):
    pts = line[::2] + ([line[-1]] if len(line) % 2 == 0 else [])
    d = f"M{pts[0][0]:g} {pts[0][1]:g}"
    d += "".join(f"L{x:g} {y:g}" for x, y in pts[1:])
    return d


lo = min(min(r) for r in grid)
hi = max(max(r) for r in grid)
levels = 30
thin, thick = [], []
for n in range(1, levels):
    level = lo + (hi - lo) * n / levels
    paths = " ".join(to_path(l) for l in chain(segments(level)))
    (thick if n % 5 == 0 else thin).append(paths)

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="none" '
    f'stroke="#0A6E78" stroke-linejoin="round" stroke-linecap="round">'
    f'<path stroke-width="0.8" d="{" ".join(thin)}"/>'
    f'<path stroke-width="1.6" d="{" ".join(thick)}"/></svg>'
)
with open("public/topo.svg", "w", encoding="utf-8") as f:
    f.write(svg)
print(len(svg) // 1024, "KB")
