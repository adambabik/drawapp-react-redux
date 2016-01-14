export const APP_HTML_ID = "app";

// Modes
export const MANAGE_MODE = "MANAGE_MODE";
export const DRAW_RECT_MODE = "DRAW_RECT_MODE";
export const DRAW_ELLIPSE_MODE = "DRAW_ELLIPSE_MODE";

export const Modes = [MANAGE_MODE, DRAW_RECT_MODE, DRAW_ELLIPSE_MODE]
  .reduce((obj, mode) => (obj[mode] = mode, obj), {});
