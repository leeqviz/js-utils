function incrementString(str) {
    const arr = str.match(/\d+/g) || [];
    if (arr.length === 0) {
        return str + "1";
    }
    const lastOne = arr[arr.length - 1];
    // @ts-ignore
    const newNum = String(Number(lastOne) + 1).padStart(lastOne.length, "0");
    const newStr = str.replace(/\d+$/, "");
    return newStr + newNum;
}
console.log(incrementString("fo99obar99"));
export {};
//# sourceMappingURL=string-incrementer.js.map