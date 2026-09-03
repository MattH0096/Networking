"""Build labeled contact sheets so the whole image library can be reviewed at a glance.

Usage: python tools/contact_sheet.py "individual image" tools/_sheets
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

COLS = 4
ROWS = 4
CELL_W = 420
CELL_H = 260
PAD = 8
LABEL_H = 22


def build(src_dir: Path, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"})
    per_sheet = COLS * ROWS
    manifest: dict[str, str] = {}

    for sheet_idx in range(0, len(files), per_sheet):
        chunk = files[sheet_idx : sheet_idx + per_sheet]
        sheet_no = sheet_idx // per_sheet + 1
        sheet = Image.new(
            "RGB",
            (COLS * (CELL_W + PAD) + PAD, ROWS * (CELL_H + LABEL_H + PAD) + PAD),
            (18, 18, 18),
        )
        draw = ImageDraw.Draw(sheet)

        for i, path in enumerate(chunk):
            ref = f"{sheet_no}-{i + 1:02d}"
            manifest[ref] = path.name

            col, row = i % COLS, i // COLS
            x = PAD + col * (CELL_W + PAD)
            y = PAD + row * (CELL_H + LABEL_H + PAD)

            with Image.open(path) as im:
                thumb = im.convert("RGB")
                thumb.thumbnail((CELL_W, CELL_H))
                sheet.paste(thumb, (x + (CELL_W - thumb.width) // 2, y + (CELL_H - thumb.height) // 2))

            draw.rectangle([x, y + CELL_H, x + CELL_W, y + CELL_H + LABEL_H], fill=(0, 0, 0))
            draw.text((x + 6, y + CELL_H + 5), f"{ref}  {path.name[:58]}", fill=(255, 170, 80))

        sheet.save(out_dir / f"sheet-{sheet_no:02d}.png")

    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"{len(files)} images -> {len(manifest) // per_sheet + 1} sheets in {out_dir}")


if __name__ == "__main__":
    build(Path(sys.argv[1]), Path(sys.argv[2]))
