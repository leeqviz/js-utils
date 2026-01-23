// @ts-nocheck
Array.prototype.myMap = function (callback) {
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
const names = ["alice", "bob"];
const uppercase = names.myMap((name) => name.toUpperCase());
console.log(uppercase); // ['ALICE', 'BOB']

function flattenObject(obj, prefix = "", result = {}) {
  // Проходимся по всем ключам текущего уровня объекта
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Формируем новый ключ.
      // Если есть префикс (мы внутри вложенности), добавляем точку: "user.address.city"
      // Если префикса нет (верхний уровень), берем просто ключ: "user"
      const newKey = prefix ? `${prefix}.${key}` : key;

      // ПРОВЕРКА: Нужно ли нырять глубже?
      // Мы идем в рекурсию, если значение — это объект,
      // но не null (т.к. typeof null === 'object') и не массив (опционально)
      if (value && typeof value === "object" && !Array.isArray(value)) {
        // РЕКУРСИВНЫЙ ВЫЗОВ
        // Передаем текущее значение и накопленный ключ (newKey) как префикс
        flattenObject(value, newKey, result);
      } else {
        // БАЗОВЫЙ СЛУЧАЙ (Лист дерева)
        // Если это примитив (число, строка) или массив — записываем в результат
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

function unflattenObject(data) {
  const result = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // 1. Разбиваем длинный ключ на части: "user.profile.name" -> ["user", "profile", "name"]
      const parts = key.split(".");

      // 2. Создаем "курсор", который будет бегать вглубь объекта.
      // Изначально он указывает на корень (result).
      let current = result;

      // 3. Бежим по частям пути, КРОМЕ последней
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        // Если по этому пути еще нет объекта — создаем пустой {}
        if (!current[part]) {
          current[part] = {};
        }

        // ДВИГАЕМ КУРСОР ВГЛУБЬ
        // Теперь current ссылается на вложенный объект
        current = current[part];
      }

      // 4. Последняя часть пути — это наш целевой ключ, куда пишем значение
      const lastPart = parts[parts.length - 1];
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

function deepFreeze(object) {
  const propertyNames = Object.getOwnPropertyNames(object);
  for (const name of propertyNames) {
    const value = object[name];
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value); // Recursively freeze
    }
  }
  return Object.freeze(object);
}

const compose = (...functions) => {
  return (input) => {
    return functions.reduceRight((acc, fn) => {
      return fn(acc);
    }, input);
  };
};

const add5 = (x) => x + 5;
const multiplyBy3 = (x) => x * 3;
const subtract10 = (x) => x - 10;

const composedFunction = compose(subtract10, multiplyBy3, add5);
const result = composedFunction(7);

console.log(result); // Output: 26
