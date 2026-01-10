function countBits(n: number) {
  // Program Me
  let bits = "";
  while (n > 0) {
    bits += n % 2;
    n = Math.floor(n / 2);
  }

  let counter = 0;
  for (let i = 0; i < bits.length; i++) {
    if (Number(bits[i]) === 1) counter += 1;
  }
  return counter;
}
