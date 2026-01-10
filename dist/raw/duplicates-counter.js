function duplicateCount(text) {
    //...
    if (text.length === 0)
        return 0;
    const prep = text.toLowerCase();
    const dup = new Set();
    let curr = -1;
    for (let i = 0; i < text.length; i++) {
        curr = text.indexOf(text[i]);
        if (i !== curr && curr !== -1) {
            dup.add(text[i]);
        }
    }
    return dup.size;
}
export {};
