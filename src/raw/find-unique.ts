function findUnique<T = any>(arr: T[]) {
  let a = arr[0];
  const filtered = arr.filter((item) => item === a);
  if (filtered.length === 1) return a;

  for (let i = 1; i < arr.length; i++) {
    if (a !== arr[i]) {
      a = arr[i];
      break;
    }
  }
  return a;
}

console.log(findUnique([2, 1, 1, 1, 1, 1]));
