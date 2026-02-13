export const tryPrintJson = (data, space = 2) => {
    let res;
    try {
        const tempStr = JSON.stringify(data, undefined, space);
        res = tempStr
            ? tempStr
                .replace(/&/g, "&amp;")
                //.replace(/\\"/g, "&bsol;&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/^( *)("[^"]+": )?("[^"]*"|[\w.+-]*)?([{}[\],]*)?$/gm, (match, indent, key, value, end) => {
                const indentHtml = indent
                    ? '<span style="color: gray">' + indent + "</span>"
                    : "";
                //key.replace(/"([\w]+)": |(.*): /, "$1$2")
                const keyHtml = key
                    ? '<span style="color: brown">' +
                        (key ? key.replace(/..$/, "") : "") +
                        "</span>" +
                        '<span style="color: gray">: </span>'
                    : "";
                const valueHtml = value
                    ? (/^"/.test(value)
                        ? '<span style="color: olive">'
                        : /true|false/.test(value)
                            ? '<span style="color: teal">'
                            : /null/.test(value)
                                ? '<span style="color: magenta">'
                                : '<span style="color: navy">') +
                        value +
                        "</span>"
                    : "";
                const endHtml = end
                    ? '<span style="color: gray">' + end + "</span>"
                    : "";
                return indentHtml + keyHtml + valueHtml + endHtml;
            })
            : undefined;
    }
    catch (_) {
        return;
    }
    return res;
};
//# sourceMappingURL=json.js.map