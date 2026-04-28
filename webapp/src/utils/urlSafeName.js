export const sanitizeUrlSafeNameInput = (name, maxLength) => {
    if (typeof name !== "string") {
        return "";
    }

    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9_-]/g, "")
        .replace(/-+/g, "-")
        .slice(0, maxLength);
};

export const parseUrlSafeName = (name, maxLength) => {
    if (typeof name !== "string") {
        return "";
    }

    return sanitizeUrlSafeNameInput(name.trim(), maxLength).replace(/^[-_]+|[-_]+$/g, "");
};
