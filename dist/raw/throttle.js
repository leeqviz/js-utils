function throttle(callback, delay = 300) {
    let timeoutId;
    let counter = 0;
    return (...args) => {
        counter++;
        console.log("Counter:", counter);
        if (!timeoutId) {
            // Only set a timeout if one isn't already set
            //callback(...args); // Original line
            callback.apply(this, [...args]); // Use apply to maintain context and pass arguments
            timeoutId = setTimeout(() => {
                timeoutId = undefined; // Reset timeoutId after the delay to allow future calls
            }, delay);
        }
    };
}
// Example usage:
const logMessage = (message) => {
    console.log("Logged message:", message);
};
const throttledLogMessage = throttle(logMessage, 1000);
for (let i = 1; i < 100; i++) {
    setTimeout(function () {
        throttledLogMessage("Throttled message " + i);
    }, 100 * i);
}
console.log("The loop is done!");
export {};
