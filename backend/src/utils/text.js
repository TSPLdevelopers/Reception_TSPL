const cleanText = (value, maxLength = 200) =>
    String(value || "").trim().slice(0, maxLength);

const escapeRegex = (value) =>
    String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const escapeHtml = (value) =>
    String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

module.exports = {
    cleanText,
    escapeRegex,
    escapeHtml
};
