function duplicateCount(text: string) {
  if (text.length === 0) return 0;
  const prep = text.toLowerCase();
  const dup = new Set();
  let curr = -1;
  for (let i = 0; i < prep.length; i++) {
    // @ts-ignore
    curr = prep.indexOf(prep[i]);
    if (i !== curr && curr !== -1) {
      dup.add(prep[i]);
    }
  }

  return dup.size;
}
