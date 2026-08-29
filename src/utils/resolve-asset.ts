/**
 * Resolve a dynamic require() for an image/asset.
 * In production builds (Webpack 5), require() returns { default: "..." }
 * instead of a plain string. This helper handles both cases.
 */
export const resolveAsset = (mod: any): string => {
  return typeof mod === "object" && mod.default ? mod.default : mod;
};
