function humanReadable(seconds) {
    const hours = Math.floor(seconds / 60 / 60);
    const hoursToSeconds = hours * 60 * 60;
    const restSeconds = seconds - hoursToSeconds;
    const minutes = Math.floor(restSeconds / 60);
    const minutesToSeconds = minutes * 60;
    const anotherRestSeconds = restSeconds - minutesToSeconds;
    return (String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(anotherRestSeconds).padStart(2, "0"));
}
console.log(humanReadable(60)); // "00:01:00"
console.log(humanReadable(86399)); // "23:59:59"
console.log(humanReadable(359999)); // "99:59:59"
export {};
