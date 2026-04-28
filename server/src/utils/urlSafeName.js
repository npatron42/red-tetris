export const URL_SAFE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;

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

export const isUrlSafeNameValid = (name, maxLength) => {
    return typeof name === "string" && name.length > 0 && name.length <= maxLength && URL_SAFE_NAME_PATTERN.test(name);
};
