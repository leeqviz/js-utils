function debounce(callback, delay = 300) {
    let timeoutId;
    let counter = 0;
    return (...args) => {
        counter++;
        console.log("Counter:", counter);
        clearTimeout(timeoutId); // Clear any existing timeout
        // Only the last call within the delay period will execute the callback
        timeoutId = setTimeout(() => {
            //callback(...args); // Original line
            callback.apply(this, [...args]); // Use apply to maintain context and pass arguments
        }, delay);
    };
}
// Example usage:
const logMessage = (message) => {
    console.log("Logged message:", message);
};
const debouncedLogMessage = debounce(logMessage, 1000);
debouncedLogMessage("message 1");
debouncedLogMessage("message 2 (this will cancel message 1)");
debouncedLogMessage("message 3 (this will cancel message 2 and only this will be logged)");
setTimeout(() => {
    debouncedLogMessage("message 4 but with a timeout");
}, 999); // Less than 1 second after message 3, so message 3 is canceled
export {};
/* for (let i = 1; i < 100; i++) {
  setTimeout(function () {
    debouncedLogMessage("Debounced message " + i);
  }, 100 * i);
} */
