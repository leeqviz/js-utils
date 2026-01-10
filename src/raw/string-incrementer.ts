function incrementString(strng: string) {
  const arr = strng.match(/\d+/g) || [];

  if (arr.length === 0) {
    return strng + "1";
  }

  const lastOne = arr[arr.length - 1];
  const newNum = String(Number(lastOne) + 1).padStart(lastOne.length, "0");
  const newStr = strng.replace(/\d+$/, "");
  return newStr + newNum;
}

console.log(incrementString("fo99obar99"));
