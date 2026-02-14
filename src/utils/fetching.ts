/**
Использование Promise.race() — это классический способ реализации динамического пула запросов. 
В отличие от статического разделения на «пачки», этот метод позволяет запускать новый запрос сразу же, как только освобождается «слот», не дожидаясь остальных запросов в группе.

Для реализации нам понадобятся:
AbortController — для отмены запроса по таймауту.
Promise.race() — для контроля лимита одновременных соединений.
Рекурсия или цикл для обработки ретраев.
 */

interface FetchWithRetriesResult {
  url: string;
  data?: any | undefined;
}

interface FetchWithRetriesError {
  url: string;
  error?: unknown | undefined;
}

/**
 * Выполняет запрос с таймаутом и ретраями
 */
export async function fetchWithRetries(
  url: string,
  retries: number,
  timeoutMs: number,
): Promise<FetchWithRetriesResult | FetchWithRetriesError> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok)
        throw new Error(`${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data, url }; // Возвращаем результат и выходим из цикла попыток
    } catch (error) {
      if (attempt === retries) return { error, url }; //Попытки закончились
    } finally {
      clearTimeout(id); // Очистка таймера. Сработает перед любым return
    }
  }
  return {
    error: new Error(`Request failed after ${retries} attempt(s)`),
    url,
  };
}

/**
 * Основная функция управления очередью через Promise.race
 */
export async function poolRequests(
  urls: string[],
  executingLimit: number,
  fetchRetries: number,
  fetchTimeoutMs: number,
) {
  const results: any[] = new Array(urls.length); // Инициализируем массив для результатов
  const executing = new Set(); // Сет для активных промисов

  let currentUrl: string | undefined = undefined;
  for (let i = 0; i < urls.length; i++) {
    currentUrl = urls[i];
    if (currentUrl === undefined) continue; // На всякий случай, если в массиве есть пустые элементы
    // Создаем промис для текущего URL
    const p = fetchWithRetries(currentUrl, fetchRetries, fetchTimeoutMs).then(
      (res) => {
        results[i] = res; // Сохраняем результат по индексу
        executing.delete(p); // Удаляем себя из сета по завершении
      },
    );

    executing.add(p);

    // Если достигли лимита N, ждем, пока любой из запросов завершится
    if (executing.size >= executingLimit) await Promise.race(executing);
  }

  // Ждем завершения последних оставшихся запросов
  await Promise.all(executing);
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

export function runExample() {
  const urls = Array.from(
    { length: 100 },
    (_, i) => `https://jsonplaceholder.typicode.com/posts/${i + 1}`,
  );

  // Одновременно 5 запросов, по 3 попытки на каждый, таймаут 2 секунды
  poolRequests(urls, 5, 3, 2000).then((allData) => {
    console.log("Все запросы обработаны:", allData.length);
  });
}

/**
Почему это лучше альтернатив?
Память: Мы не создаем 1 000 000 промисов сразу, если в массиве миллион URL. Мы итерируемся по списку постепенно.
Скорость: Нет «бутылочного горлышка» как в Promise.all группами. Если один URL «тупит», остальные каналы продолжают молотить очередь.
Контроль: Вы жестко контролируете нагрузку на клиент и сервер.
 */
