#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Original abstract line-art generated specifically for the House of Rose PRF
trifold — no photography, no figures/faces (stays clear of the Creative
System's visual blacklist), pure brand-palette linework. Each motif maps to
a panel's idea:
  science-mark   -> platelets/growth-factor network (What PRF Is)
  light-burst    -> IPL light rays (PRF + Lumecca)
  channel-grid   -> RF microneedling micro-channels (PRF + Morpheus8)
  layered-arcs   -> build-your-plan layering (Build Your Plan)
  cover-rings    -> quiet architectural rings behind the monogram (Cover)
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

OUT = "/sessions/lucid-blissful-mayer/mnt/house-of-rose-site/docs/GOVERNANCE/internal_only/marketing/print/prf-brochure/assets/art"
os.makedirs(OUT, exist_ok=True)

BRONZE = "#8A6A43"
GOLD = "#E7D6A8"
IVORY = "#F1EDE5"

W, H = 8, 18.6  # matches panel aspect 3.6667 x 8.5in, scaled up

def new_fig():
    fig = plt.figure(figsize=(W, H), dpi=160)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W); ax.set_ylim(0, H)
    ax.axis("off")
    fig.patch.set_alpha(0)
    ax.patch.set_alpha(0)
    return fig, ax

def save(fig, name):
    fig.savefig(f"{OUT}/{name}.png", transparent=True)
    plt.close(fig)

# ---------------- 1. science-mark: platelet / growth-factor network ----------------
rng = np.random.default_rng(7)
fig, ax = new_fig()
n = 16
pts = np.column_stack([rng.uniform(0.8, W - 0.8, n), rng.uniform(H - 6.2, H - 0.6, n)])
for i in range(n):
    dists = np.linalg.norm(pts - pts[i], axis=1)
    nearest = np.argsort(dists)[1:3]
    for j in nearest:
        ax.plot([pts[i,0], pts[j,0]], [pts[i,1], pts[j,1]], color=BRONZE, linewidth=0.6, alpha=0.55, zorder=1)
sizes = rng.uniform(14, 46, n)
ax.scatter(pts[:,0], pts[:,1], s=sizes, color=GOLD, alpha=0.85, zorder=2, edgecolors="none")
save(fig, "science-mark")

# ---------------- 2. light-burst: IPL light rays from a corner ----------------
fig, ax = new_fig()
origin = np.array([-1.2, H + 1.2])
rng2 = np.random.default_rng(3)
n_rays = 26
angles = np.linspace(-95, -5, n_rays) + rng2.uniform(-1.5, 1.5, n_rays)
for a in angles:
    rad = np.radians(a)
    length = rng2.uniform(16, 24)
    x2 = origin[0] + length * np.cos(rad)
    y2 = origin[1] + length * np.sin(rad)
    ax.plot([origin[0], x2], [origin[1], y2], color=GOLD, linewidth=0.5, alpha=rng2.uniform(0.18, 0.5), zorder=1)
# a few short arcs to suggest pulses
for r in [3.2, 5.6, 8.0]:
    th = np.linspace(np.radians(-95), np.radians(-5), 60)
    xs = origin[0] + r*np.cos(th)
    ys = origin[1] + r*np.sin(th)
    ax.plot(xs, ys, color=BRONZE, linewidth=0.7, alpha=0.4)
save(fig, "light-burst")

# ---------------- 3. channel-grid: RF microneedling micro-channels ----------------
fig, ax = new_fig()
rng3 = np.random.default_rng(11)
cols = 9
rows = 20
xs = np.linspace(0.9, W - 0.9, cols)
ys = np.linspace(H - 0.9, 0.9, rows)
for yi, y in enumerate(ys):
    for xi, x in enumerate(xs):
        jitter_x = x + rng3.uniform(-0.06, 0.06)
        jitter_y = y + rng3.uniform(-0.06, 0.06)
        highlight = rng3.random() < 0.09
        ax.scatter([jitter_x], [jitter_y],
                   s=(30 if highlight else 6),
                   color=(GOLD if highlight else BRONZE),
                   alpha=(0.9 if highlight else 0.38),
                   edgecolors="none", zorder=2)
save(fig, "channel-grid")

# ---------------- 4. layered-arcs: build-your-plan layering ----------------
fig, ax = new_fig()
cx, cy = W/2, -2.5
for i, r in enumerate([6, 9, 12, 15, 18]):
    th = np.linspace(np.radians(20), np.radians(160), 120)
    xs = cx + r*np.cos(th)
    ys = cy + r*np.sin(th)
    ax.plot(xs, ys, color=(GOLD if i == 4 else BRONZE), linewidth=(1.1 if i==4 else 0.6), alpha=(0.75 if i==4 else 0.32))
save(fig, "layered-arcs")

# ---------------- 5. cover-rings: quiet architectural rings ----------------
fig, ax = new_fig()
cx, cy = W/2, H*0.58
for i, r in enumerate([1.6, 2.6, 3.7, 4.9, 6.2]):
    th = np.linspace(0, 2*np.pi, 200)
    xs = cx + r*np.cos(th)
    ys = cy + r*np.sin(th)*0.55
    ax.plot(xs, ys, color=GOLD, linewidth=0.55, alpha=0.22)
save(fig, "cover-rings")

print("Generated:", os.listdir(OUT))
