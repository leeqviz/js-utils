// @ts-nocheck
/**
Использование Promise.race() — это классический способ реализации динамического пула запросов. В отличие от статического разделения на «пачки», этот метод позволяет запускать новый запрос сразу же, как только освобождается «слот», не дожидаясь остальных запросов в группе.

Для реализации нам понадобятся:

AbortController — для отмены запроса по таймауту.

Promise.race() — для контроля лимита одновременных соединений.

Рекурсия или цикл для обработки ретраев.

Вот как это реализовать максимально эффективно:
 */
/**
 * Выполняет запрос с таймаутом и ретраями
 */
async function fetchWithTimeout(url, retries, timeoutMs) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            // Выполняем запрос
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id); // Отменяем абортирование по завершении запроса
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return await response.json(); // Возвращаем результат и выходим из цикла попыток
        }
        catch (err) {
            clearTimeout(id); // Отменяем абортирование по ошибке
            if (attempt === retries) {
                //Попытки закончились
                return {
                    error: err.name === "AbortError" ? "Timeout" : err.message,
                    url,
                };
            }
            // Можно добавить задержку между попытками: await new Promise(r => setTimeout(r, 1000));
        }
    }
}
/**
 * Основная функция управления очередью через Promise.race
 */
async function poolRequests(urls, limit, retries, timeoutMs) {
    const results = [];
    const executing = new Set(); // Сет для активных промисов
    for (const url of urls) {
        // Создаем промис для текущего URL
        const p = fetchWithTimeout(url, retries, timeoutMs).then((res) => {
            results.push(res); // Сохраняем результат
            console.log("result", res);
            executing.delete(p); // Удаляем себя из сета по завершении
        });
        executing.add(p);
        // Если достигли лимита N, ждем, пока любой из запросов завершится
        if (executing.size >= limit) {
            console.log("limit executing", executing);
            await Promise.race(executing);
        }
    }
    // Ждем завершения последних оставшихся запросов
    console.log("rest executing", executing);
    await Promise.allSettled(executing);
    return results;
}
/**
Разбор ключевых моментов:
Зачем тут Promise.race(executing)?
Когда количество активных запросов (executing.size) достигает вашего лимита $N$, выполнение цикла for...of приостанавливается на строке await Promise.race(executing).
Как только любой из запущенных запросов завершается, он удаляет себя из Set и Promise.race «разрешается».
Цикл делает следующую итерацию и запускает новый запрос.
Это обеспечивает максимальную плотность потока.Абортирование (Таймаут):Мы используем AbortController.
Если сервер не ответил в течение timeoutMs, вызывается controller.abort(), запрос прерывается, и мы переходим к следующему ретраю (если они остались).
Обработка ошибок:В данном примере ошибки не «роняют» всё приложение.
Если после всех попыток URL не загрузился, в массив результатов записывается объект с описанием ошибки.
Это важно для обработки больших массивов данных
 */
const urls = Array.from({ length: 100 }, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`);
// Одновременно 5 запросов, по 3 попытки на каждый, таймаут 2 секунды
poolRequests(urls, 5, 3, 2000).then((allData) => {
    console.log("Все запросы обработаны:", allData.length);
});
export {};
/**
Почему это лучше альтернатив?
Память: Мы не создаем 1 000 000 промисов сразу, если в массиве миллион URL. Мы итерируемся по списку постепенно.

Скорость: Нет «бутылочного горлышка» как в Promise.all группами. Если один URL «тупит», остальные каналы продолжают молотить очередь.

Контроль: Вы жестко контролируете нагрузку на клиент и сервер.

Нюанс: Если вам нужно сохранять строгий порядок результатов (чтобы results[0] соответствовал urls[0]), в функцию fetchWithTimeout стоит передавать индекс и записывать результат в массив по этому индексу: results[index] = data
 */
//# sourceMappingURL=test.js.map