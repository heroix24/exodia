/**
 * Theme definitions for published dashboards
 */

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  CORPORATE: "corporate",
  MINIMAL: "minimal",
  VIBRANT: "vibrant",
  OCEANIC: "oceanic",
  FOREST: "forest",
  SUNSET: "sunset",
  MONOCHROME: "monochrome",
  GRADIENT: "gradient",
};

export const THEME_VALUES = Object.values(THEMES);

export const DEFAULT_THEME = THEMES.LIGHT;

/**
 * Validates if a theme string is valid
 * @param {string} theme
 * @returns {boolean}
 */
export const isValidTheme = (theme) => {
  return THEME_VALUES.includes(theme);
};

/**
 * Normalizes a theme input, returning default if invalid
 * @param {string|undefined} theme
 * @returns {string}
 */
export const normalizeTheme = (theme) => {
  if (!theme || typeof theme !== "string") {
    return DEFAULT_THEME;
  }
  const normalized = theme.trim().toLowerCase();
  return isValidTheme(normalized) ? normalized : DEFAULT_THEME;
};

/**
 * Theme color palettes for CSS generation
 */
export const THEME_PALETTES = {
  [THEMES.LIGHT]: {
    background: "#ffffff",
    foreground: "#1f2937",
    primary: "#3b82f6",
    secondary: "#6b7280",
    accent: "#8b5cf6",
    border: "#e5e7eb",
    muted: "#f9fafb",
    mutedForeground: "#6b7280",
    cardBackground: "#ffffff",
    cardBorder: "#e5e7eb",
  },
  [THEMES.DARK]: {
    background: "#0f172a",
    foreground: "#f1f5f9",
    primary: "#60a5fa",
    secondary: "#94a3b8",
    accent: "#a78bfa",
    border: "#334155",
    muted: "#1e293b",
    mutedForeground: "#cbd5e1",
    cardBackground: "#1e293b",
    cardBorder: "#334155",
  },
  [THEMES.CORPORATE]: {
    background: "#f8fafc",
    foreground: "#0f172a",
    primary: "#1e40af",
    secondary: "#475569",
    accent: "#0ea5e9",
    border: "#cbd5e1",
    muted: "#e2e8f0",
    mutedForeground: "#64748b",
    cardBackground: "#ffffff",
    cardBorder: "#cbd5e1",
  },
  [THEMES.MINIMAL]: {
    background: "#fafafa",
    foreground: "#171717",
    primary: "#404040",
    secondary: "#737373",
    accent: "#525252",
    border: "#e5e5e5",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    cardBackground: "#ffffff",
    cardBorder: "#e5e5e5",
  },
  [THEMES.VIBRANT]: {
    background: "#fef3c7",
    foreground: "#78350f",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#ec4899",
    border: "#fcd34d",
    muted: "#fef3c7",
    mutedForeground: "#92400e",
    cardBackground: "#fffbeb",
    cardBorder: "#fcd34d",
  },
  [THEMES.OCEANIC]: {
    background: "#ecfeff",
    foreground: "#164e63",
    primary: "#0891b2",
    secondary: "#0e7490",
    accent: "#06b6d4",
    border: "#a5f3fc",
    muted: "#cffafe",
    mutedForeground: "#155e75",
    cardBackground: "#ffffff",
    cardBorder: "#67e8f9",
  },
  [THEMES.FOREST]: {
    background: "#f0fdf4",
    foreground: "#14532d",
    primary: "#16a34a",
    secondary: "#15803d",
    accent: "#22c55e",
    border: "#bbf7d0",
    muted: "#dcfce7",
    mutedForeground: "#166534",
    cardBackground: "#ffffff",
    cardBorder: "#86efac",
  },
  [THEMES.SUNSET]: {
    background: "#fff7ed",
    foreground: "#7c2d12",
    primary: "#ea580c",
    secondary: "#c2410c",
    accent: "#f97316",
    border: "#fed7aa",
    muted: "#ffedd5",
    mutedForeground: "#9a3412",
    cardBackground: "#ffffff",
    cardBorder: "#fdba74",
  },
  [THEMES.MONOCHROME]: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#171717",
    secondary: "#525252",
    accent: "#404040",
    border: "#d4d4d4",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    cardBackground: "#ffffff",
    cardBorder: "#e5e5e5",
  },
  [THEMES.GRADIENT]: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    foreground: "#ffffff",
    primary: "#a78bfa",
    secondary: "#c4b5fd",
    accent: "#e9d5ff",
    border: "#c4b5fd",
    muted: "rgba(255, 255, 255, 0.1)",
    mutedForeground: "#e9d5ff",
    cardBackground: "rgba(255, 255, 255, 0.95)",
    cardBorder: "#c4b5fd",
  },
};

/**
 * Get the color palette for a theme
 * @param {string} theme
 * @returns {object}
 */
export const getThemePalette = (theme) => {
  const normalized = normalizeTheme(theme);
  return THEME_PALETTES[normalized] || THEME_PALETTES[DEFAULT_THEME];
};
