const sanitizeCsvValue = (value) => {
    let text = String(value ?? "");

    
    if (/^[=+\-@]/.test(text)) {
        text = `'${text}`;
    }

    
    text = text.replaceAll('"', '""');

    return `"${text}"`;
};

export const downloadCsv = ({ filename, headers, rows }) => {
    const content = [
        headers.map(sanitizeCsvValue).join(","),
        ...rows.map((row) => row.map(sanitizeCsvValue).join(","))
    ].join("\n");

    const blob = new Blob([content], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
