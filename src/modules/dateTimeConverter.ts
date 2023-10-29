export const dateTimeConverter = (date: Date | null): (String | null) => {
    if (date == null) {
        return null;
    }
    return date.toLocaleDateString("ja-JP", {
        year: "numeric", month: "2-digit",
        day: "2-digit", hour: "2-digit", minute: "2-digit"
    }).replaceAll('/', '-');
}