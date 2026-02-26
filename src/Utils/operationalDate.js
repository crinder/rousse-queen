// utils/operationalDate.js
export function getOperationalDate(date = new Date()) {
  const hour = date.getHours();
  if (hour < 1) date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}