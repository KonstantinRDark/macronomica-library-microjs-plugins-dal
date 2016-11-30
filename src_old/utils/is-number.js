
export default function isNumber(value) {
  return isFinite(+value) && !isNaN(+value);
}