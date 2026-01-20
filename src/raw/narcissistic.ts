function narcissistic(value: number) {
  if (typeof value !== "number" || value < 0) return false;
  // Code me to return true or false
  const digits = value.toString().split("").map(Number);

  let res = 0;
  for (let i = 0; i < digits.length; i++) {
    // @ts-ignore
    res += Math.pow(digits[i], digits.length);
  }

  return res === value;
}

console.log(narcissistic(7)); // true
console.log(narcissistic(371)); // true
console.log(narcissistic(122)); // false
