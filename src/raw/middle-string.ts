function getMiddle(s: string) {
  //Code goes here!
  return s.length % 2 === 0
    ? s.substring(
        Math.floor((s.length - 1) / 2),
        Math.ceil((s.length - 1) / 2) + 1
      )
    : s.substring((s.length - 1) / 2, (s.length - 1) / 2 + 1);
}

console.log(getMiddle("test"));
console.log(getMiddle("testing"));
console.log(getMiddle("middle"));
