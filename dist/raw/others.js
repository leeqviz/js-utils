function reverseStr(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}
console.log(reverseStr("hello"));
function isPalindrome(str) {
    const tempStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (let i = 0; i <= tempStr.length / 2; i++) {
        if (tempStr[i] !== tempStr[tempStr.length - 1 - i]) {
            return false;
        }
    }
    return true;
}
console.log(isPalindrome("he, l eh"));
function sumFromTo(first, last) {
    const amount = last - first + 1;
    return (amount * (first + last)) / 2;
}
console.log(sumFromTo(1, 5));
function debounce(func, ms) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, ms);
    };
}
function sumAB(a, b) {
    console.log(a + b);
}
const debounced = debounce(sumAB, 500);
debounced(5, 5);
debounced(5, 5);
debounced(5, 5);
function throttle(func, ms) {
    let timer = null;
    return (...args) => {
        if (timer === null) {
            func(...args);
            timer = setTimeout(() => {
                timer = null;
            }, ms);
        }
    };
}
const throttled = throttle((val) => console.log(val), 100);
for (let i = 1; i < 100; i++) {
    setTimeout(() => {
        throttled(i);
    }, 100 * i);
}
function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func(...args);
        }
        else {
            return (...args2) => curried(...args, ...args2);
        }
    };
}
const curriedSumAB = curry(sumAB);
curriedSumAB()(1)()(2);
function deepClone(src) {
    if (src === null || typeof src !== "object") {
        return src;
    }
    if (Array.isArray(src)) {
        const arr = [];
        for (let i = 0; i < src.length; i++) {
            arr[i] = deepClone(src[i]);
        }
        return arr;
    }
    const obj = {};
    for (const key in src) {
        if (Object.hasOwn(src, key)) {
            obj[key] = deepClone(src[key]);
        }
    }
    return obj;
}
const original = {
    a: undefined,
    a_1: null,
    b: "test-name",
    c: {
        d: () => console.log("I am a function"),
        e: {
            f: 4,
            arr: [1, 2, { g: 4, c: [1, "4", { a: "test" }] }, 3, { g: 5 }],
        },
    },
    d: [1, 2, () => console.log("I am a second function"), 4, 5],
    e: function () {
        return "I am a function too";
    },
    f: true,
    g: Symbol("I am a symbol"),
};
const copied = deepClone(original);
original.c.d = 5;
console.dir(original);
console.dir(copied);
const arr1 = [1, 2, 2, 3, 5];
const arr2 = [0, 4, 5, 5, 6, 7];
function combineArrays(firstArray, secondArray) {
    const resultArray = [];
    let firstCounter = 0;
    let secondCounter = 0;
    while (firstCounter < firstArray.length &&
        secondCounter < secondArray.length) {
        if (firstArray[firstCounter] < secondArray[secondCounter]) {
            if (resultArray.length === 0 ||
                resultArray[resultArray.length - 1] !== firstArray[firstCounter]) {
                resultArray.push(firstArray[firstCounter]);
            }
            firstCounter++;
        }
        else if (firstArray[firstCounter] > secondArray[secondCounter]) {
            if (resultArray.length === 0 ||
                resultArray[resultArray.length - 1] !== secondArray[secondCounter]) {
                resultArray.push(secondArray[secondCounter]);
            }
            secondCounter++;
        }
        else {
            if (resultArray.length === 0 ||
                resultArray[resultArray.length - 1] !== secondArray[secondCounter]) {
                resultArray.push(secondArray[secondCounter]);
            }
            secondCounter++;
            firstCounter++;
        }
    }
    while (firstCounter < firstArray.length) {
        if (resultArray.length === 0 ||
            resultArray[resultArray.length - 1] !== firstArray[firstCounter]) {
            resultArray.push(firstArray[firstCounter]);
        }
        firstCounter++;
    }
    while (secondCounter < secondArray.length) {
        if (resultArray.length === 0 ||
            resultArray[resultArray.length - 1] !== secondArray[secondCounter]) {
            resultArray.push(secondArray[secondCounter]);
        }
        secondCounter++;
    }
    return resultArray;
}
console.log(combineArrays(arr1, arr2));
function isSquare(num) {
    if (num <= 0) {
        return false;
    }
    return Math.sqrt(num) % 1 === 0;
}
console.log(isSquare(4));
function reverseNumber(num) {
    const isNegative = num < 0;
    const str = String(isNegative ? Math.abs(num) : num);
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return isNegative ? -Number(reversed) : Number(reversed);
}
console.log(reverseNumber(-123));
const testArr = [
    {
        city: "Moscow",
        user: "Ivan",
    },
    {
        user: "John",
        city: "New York",
    },
    {
        user: "John1",
        city: "New York",
    },
    {
        city: "Polotsk",
    },
];
function groupArrayBy(arr, key, value) {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i][key]);
        if (!obj[arr[i][key]]) {
            obj[arr[i][key]] = arr[i][value];
        }
        else if (Array.isArray(obj[arr[i][key]])) {
            obj[arr[i][key]].push(arr[i][value]);
        }
        else {
            obj[arr[i][key]] = [obj[arr[i][key]], arr[i][value]];
        }
    }
    return obj;
}
console.log(groupArrayBy(testArr, "city", "user"));
function factorial(n) {
    if (n <= 1)
        return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}
console.log(factorial(5));
function isSimpleNumber(num) {
    if (num <= 1)
        return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}
console.log(isSimpleNumber(6));
function isAnagram(str1, str2) {
    const prepared1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
    const prepared2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "");
    console.log(prepared1);
    console.log(prepared2);
    if (prepared1.length !== prepared2.length) {
        return false;
    }
    const obj = {};
    for (let char of prepared1) {
        obj[char] = (obj[char] || 0) + 1;
    }
    for (let char of prepared2) {
        if (!obj[char] || obj[char] < 0) {
            return false;
        }
        obj[char] -= 1;
    }
    return true;
}
console.log(isAnagram("hello, r", "e, rh llo"));
function customPromiseAll(arr) {
    const result = [];
    let counter = 0;
    return new Promise((resolve, reject) => {
        arr.forEach((el, ind) => {
            el.then((res) => {
                result[ind] = res;
                counter += 1;
                // проверка по счетчику а не по длине массива необходима, так как если последний промис выполнится быстрее, то длина массива будет равна последний элемент + 1
                if (counter === result.length) {
                    console.log(result);
                    resolve(result);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    });
}
let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Resolved-1");
    }, 1000);
});
let promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Resolved-2");
    }, 500);
});
let promise3 = new Promise((resolve, reject) => {
    resolve("Resolved-3");
});
const promises = [promise1, promise2, promise3];
customPromiseAll(promises).then((result) => console.log(result));
function finMax(arr) {
    let res = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (res < arr[i]) {
            res = arr[i];
        }
    }
    return res;
}
function arraysDifference(arr1, arr2) {
    const arr2Set = new Set(arr2);
    const arr1Filtered = arr1.filter((el) => !arr2Set.has(el));
    const arr1Set = new Set(arr1);
    const arr2Filtered = arr2.filter((el) => !arr1Set.has(el));
    return [...arr1Filtered, ...arr2Filtered];
}
console.log(arraysDifference(arr1, arr2));
function sortSymbols(str) {
    const obj = {};
    for (let ch of str) {
        obj[ch] = (obj[ch] || 0) + 1;
    }
    const arr = Object.entries(obj);
    arr.sort((a, b) => {
        if (b[1] !== a[1])
            return b[1] - a[1];
        else {
            return b[0].localeCompare(a[0]);
        }
    });
    let combined = "";
    for (let item of arr) {
        combined += item[0].repeat(item[1]);
    }
    return combined;
}
console.log(sortSymbols("hello"));
export {};
