export function htmlDecode(input: string) {
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent!;
}

export function parseBreaks(input: string) {
    return input.replace(/&lt;br \/&gt;/g, '<br />');
}
