function hexToRgb(hex: string) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** Clareia (amt > 0) ou escurece (amt < 0) uma cor hexadecimal. */
export function shade(hex: string, amt: number) {
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return (
    "#" +
    hexToRgb(hex)
      .map((c) => Math.round((target - c) * p + c).toString(16).padStart(2, "0"))
      .join("")
  );
}
