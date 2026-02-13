// @ts-nocheck
Array.prototype.myGroupBy = function (callback) {
    const result = {};
    for (let i = 0; i < this.length; i++) {
        const key = callback(this[i], i, this);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(this[i]);
    }
    return result;
};
const inventory = [
    { name: "apple", type: "fruit" },
    { name: "carrot", type: "vegetable" },
    { name: "banana", type: "fruit" },
    { name: "celery", type: "vegetable" },
];
const grouped = inventory.myGroupBy((item) => item.type);
console.log(grouped);
Array.prototype.customMap = function (callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        // Only process indexes that exist (skips sparse array holes)
        if (i in this) {
            result[i] = callback(this[i], i, this);
        }
    }
    return result;
};
// Usage Example
const names = ["alice", "bob", , , , "charlie"];
const uppercase = names.customMap((name) => name.toUpperCase());
console.log(uppercase);
function flattenObject(obj, prefix = "", result = {}) {
    // Проходимся по всем ключам текущего уровня объекта
    for (const key of Object.keys(obj)) {
        // Формируем новый ключ.
        // Если есть префикс (мы внутри вложенности), добавляем точку: "user.address.city"
        // Если префикса нет (верхний уровень), берем просто ключ: "user"
        const newKey = prefix ? `${prefix}.${key}` : key;
        // ПРОВЕРКА: Нужно ли нырять глубже?
        // Мы идем в рекурсию, если значение — это объект, но не null и не массив
        if (obj[key] !== null &&
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key])) {
            // Передаем текущее значение и накопленный ключ (newKey) как префикс
            flattenObject(obj[key], newKey, result);
        }
        else {
            // Если это примитив (число, строка) или массив — записываем в результат
            result[newKey] = obj[key];
        }
    }
    return result;
}
function flattenObjectSmart(obj, prefix = "", result = {}) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            // ОПРЕДЕЛЯЕМ ФОРМАТ КЛЮЧА
            // Если prefix пустой, просто берем ключ (для корня)
            // Если obj - массив, то ключ (индекс) берем в скобки: prefix[0]
            // Если obj - объект, то ставим точку: prefix.key
            let newKey;
            if (prefix.length === 0) {
                newKey = key;
            }
            else if (Array.isArray(obj)) {
                newKey = `${prefix}[${key}]`;
            }
            else {
                newKey = `${prefix}.${key}`;
            }
            if (value && typeof value === "object") {
                flattenObjectSmart(value, newKey, result);
            }
            else {
                result[newKey] = value;
            }
        }
    }
    return result;
}
// Example Usage:
const nestedData = {
    user: {
        id: 1,
        profile: {
            name: "Alex",
            contacts: {
                email: "alex@example.com",
            },
        },
    },
    active: true,
};
console.log(flattenObject(nestedData));
/* Результат:
{
  "user.id": 1,
  "user.profile.name": "Alex",
  "user.profile.contacts.email": "alex@example.com",
  "active": true
}
*/
function unflattenObject(obj, prefix = ".") {
    if (obj === null ||
        typeof obj !== "object" ||
        Array.isArray(obj) ||
        typeof prefix !== "string")
        return undefined;
    const result = {};
    for (const key of Object.keys(obj)) {
        // Разбиваем ключ на части: "user.profile.name" -> ["user", "profile", "name"]
        // Иначе получаем массив с одним элементом
        const ks = key.split(prefix);
        // Создаем "курсор", который будет бегать вглубь объекта.
        // Изначально он указывает на корень (result).
        let current = result;
        // Бежим по частям пути, КРОМЕ последней, так как она будет нашим целевым ключом в который мы поместим значение
        // Если у нас массив из одного элемента, то мы сюда не зайдем
        for (let i = 0; i < ks.length - 1; i++) {
            const k = ks[i];
            // Если по этому пути еще нет объекта — создаем пустой {}
            if (!current[k])
                current[k] = {};
            // ДВИГАЕМ КУРСОР ВГЛУБЬ
            // Теперь current ссылается на вложенный объект
            current = current[k];
        }
        // Таким образом, через current мы создаем вложенность в result и влияем на result
        // Последняя часть пути или если элемент в массиве один — это наш целевой ключ, куда пишем значение
        const last = ks[ks.length - 1];
        current[last] = obj[key];
    }
    return result;
}
function unflattenObjectSmart(data) {
    const result = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            // 1. ПОДГОТОВКА КЛЮЧЕЙ
            // Превращаем "users[0].name" -> "users.[0].name"
            // Чтобы split('.') корректно разбил всё на части
            const normalizedKey = key.replace(/\[/g, ".[");
            const parts = normalizedKey.split(".");
            let current = result;
            for (let i = 0; i < parts.length - 1; i++) {
                let part = parts[i];
                const nextPart = parts[i + 1];
                // Очищаем ключ от скобок, если они есть ("[0]" -> "0")
                if (part.startsWith("[")) {
                    part = part.slice(1, -1); // убираем [ и ]
                }
                // 2. РЕШАЮЩИЙ МОМЕНТ: Look Ahead
                // Мы смотрим на СЛЕДУЮЩУЮ часть ключа.
                // Если она начинается с '[', значит мы сейчас должны создать МАССИВ.
                // Иначе создаем ОБЪЕКТ.
                if (!current[part]) {
                    const isNextArray = nextPart.startsWith("[");
                    current[part] = isNextArray ? [] : {};
                }
                current = current[part];
            }
            // 3. Запись значения
            let lastPart = parts[parts.length - 1];
            if (lastPart.startsWith("[")) {
                lastPart = lastPart.slice(1, -1);
            }
            current[lastPart] = data[key];
        }
    }
    return result;
}
// --- Тестируем ---
const flatData = {
    "user.id": 1,
    "user.profile.name": "Alex",
    active: true,
};
console.log(unflattenObject(flatData));
/* Результат:
{
  user: {
    id: 1,
    profile: {
      name: "Alex"
    }
  },
  active: true
}
*/
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
        if (obj[key] !== null &&
            typeof obj[key] === "object" &&
            !Object.isFrozen(obj[key])) {
            deepFreeze(obj[key]); // Recursively freeze
        }
    }
    return obj;
}
const obj = { a: 1, b: { c: 2 } };
deepFreeze(obj);
// obj.a = 2; // Error: Cannot assign to read only property 'a' of object '#<Object>'
// obj.b.c = 3; // Error: Cannot assign to read only property 'c' of object '#<Object>'
const compose = (...functions) => {
    return (value) => {
        return functions.reduceRight((acc, fn) => {
            return fn(acc);
        }, value);
    };
};
const add5 = (x) => x + 5;
const multiplyBy3 = (x) => x * 3;
const subtract10 = (x) => x - 10;
const composedFunction = compose(subtract10, multiplyBy3, add5);
const result = composedFunction(7);
console.log(result); // Output: 26
function deepClone(obj) {
    if (obj === null || typeof obj !== "object")
        return obj;
    if (Array.isArray(obj)) {
        const newArr = [];
        for (let i = 0; i < obj.length; i++) {
            if (i in obj) {
                newArr[i] = deepClone(obj[i]);
            }
            else {
                newArr.length++;
            }
        }
        return newArr;
    }
    const newObj = {};
    for (const key of Object.keys(obj)) {
        newObj[key] = deepClone(obj[key]);
    }
    return newObj;
}
const originalObj = { a: 1, b: { c: 2, d: [3, , , 4] } };
const clonedObj = deepClone(originalObj);
console.log(clonedObj);
export {};
//# sourceMappingURL=useful.js.map