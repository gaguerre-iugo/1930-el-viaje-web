// Escenarios y umbrales para el testeo en pantallas interactivas grandes (65", 16:9).
// Basado en las especificaciones del manual de aula (Aspecto.pdf).

export const SERVER = {
  host: "127.0.0.1",
  port: Number(process.env.PORT || 5599),
};

// Viewports 16:9 de referencia. `dpr` = devicePixelRatio.
// Los paneles 4K de aula suelen exponer DPR 1 o 2 en Chrome/Android.
export const VIEWPORTS = [
  { name: "4k-3840x2160-dpr1", width: 3840, height: 2160, dpr: 1 },
  { name: "fhd-1920x1080-dpr1", width: 1920, height: 1080, dpr: 1 },
  { name: "fhd-1920x1080-dpr2", width: 1920, height: 1080, dpr: 2 },
  { name: "hd-1366x768-dpr1", width: 1366, height: 768, dpr: 1 },
  { name: "hd-1280x720-dpr1", width: 1280, height: 720, dpr: 1 },
];

// User-agent representativo de un panel Android + Chrome.
export const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 13; Interactive Flat Panel) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Distancia de visualización de aula asumida (m) y geometría física del panel.
// 65" 16:9 => ancho fisico ~1.44 m. La densidad fisica (mm por px CSS) se calcula
// por viewport a partir de estos datos.
export const PHYSICAL = {
  diagonalInches: 65,
  aspect: [16, 9],
  viewingDistanceMeters: 2.5,
};

export const THRESHOLDS = {
  // Área táctil mínima recomendada para uso con dedo/lápiz en aula compartida.
  // WCAG 2.5.5 pide >=44 CSS px; ademas exigimos un minimo fisico en mm.
  touchTargetMinMm: 9,
  touchTargetMinCssPx: 44,
  // Separación mínima entre bordes de elementos interactivos.
  minSpacingCssPx: 8,
  minSpacingMm: 3,
  // Contraste WCAG.
  contrastNormalText: 4.5,
  contrastLargeText: 3.0,
  // Margen de zona segura respecto a los bordes del viewport (px CSS).
  safeZonePx: 24,
  // Tamaño mínimo recomendado de un QR para escaneo a distancia (px CSS).
  qrMinCssPx: 160,
};

// Muestreo de páginas visuales a auditar (proporción del total, 0..1).
export const PAGE_SAMPLE_FRACTIONS = [0, 0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1];

// Estados de interfaz (paneles) a capturar además de las páginas.
export const PANEL_STATES = ["index", "tools", "glossary", "tts"];
