// @ts-nocheck
/**
 * Выполняет запрос с таймаутом и ретраями
 */
async function fetchWithTimeout(url, retries, timeoutMs) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return await response.json();
        }
        catch (err) {
            clearTimeout(id);
            const isLastAttempt = attempt === retries;
            if (isLastAttempt) {
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
            results.push(res);
            executing.delete(p); // Удаляем себя из сета по завершении
        });
        executing.add(p);
        // Если достигли лимита N, ждем, пока любой из запросов завершится
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }
    // Ждем завершения последних оставшихся запросов
    await Promise.all(executing);
    return results;
}
const urls = Array.from({ length: 100 }, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`);
// Одновременно 5 запросов, по 3 попытки на каждый, таймаут 2 секунды
poolRequests(urls, 5, 3, 2000).then((allData) => {
    console.log("Все запросы обработаны:", allData);
});
export {};
//# sourceMappingURL=test.js.map