export const MAP_BRAND_COLOR = "#F9502E";

export const MOVER_CLUSTER_STYLES = [
  { size: 36, background: "#feeeea", color: "#e04829" },
  { size: 40, background: "#fed8d0", color: "#e04829" },
  { size: 44, background: "#fd947f", color: "#ffffff" },
  { size: 48, background: MAP_BRAND_COLOR, color: "#ffffff" },
  { size: 52, background: "#e04829", color: "#ffffff" },
].map(({ size, background, color }) => ({
  width: `${size}px`,
  height: `${size}px`,
  background,
  border: "3px solid #ffffff",
  borderRadius: "50%",
  boxSizing: "border-box",
  boxShadow: "0 2px 8px rgba(17, 17, 17, 0.24)",
  color,
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: `${size - 6}px`,
  textAlign: "center",
}));

export const MOVER_SUMMARY_STYLES = {
  card: "width:248px;padding:16px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(17,17,17,.18);font-family:Pretendard,sans-serif;box-sizing:border-box;",
  header: "display:flex;align-items:center;gap:10px;margin-bottom:10px;",
  avatar: "width:44px;height:44px;border-radius:12px;object-fit:cover;background:#f3f4f6;",
  identity: "min-width:0;flex:1;",
  name: "display:block;overflow:hidden;color:#1f2937;font-size:15px;line-height:22px;text-overflow:ellipsis;white-space:nowrap;",
  stats: "display:block;color:#6b7280;font-size:12px;line-height:18px;",
  profileLink: `display:flex;height:38px;align-items:center;justify-content:center;border-radius:10px;background:${MAP_BRAND_COLOR};color:#fff;font-size:13px;font-weight:700;text-decoration:none;`,
} as const;

export const ROUTE_LINE_STYLE = {
  strokeWeight: 5,
  strokeColor: MAP_BRAND_COLOR,
  strokeOpacity: 0.72,
  strokeStyle: "shortdash" as const,
  zIndex: 1,
};
