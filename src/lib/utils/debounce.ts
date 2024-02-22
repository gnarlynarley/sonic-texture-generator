export default function debounce<A extends any[]>(
  func: (...args: A) => any,
  timeout = 300,
) {
  let id: number | undefined;
  return (...args: A) => {
    clearTimeout(id);
    id = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
}
