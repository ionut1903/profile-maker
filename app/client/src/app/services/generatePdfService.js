export const generatePDF = async (html) => {
    const { fetch } = window;
    let htmlWrapper = "<html><head></head><body>"
    htmlWrapper += html.innerHTML;
    htmlWrapper += "</body></html>";
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: htmlWrapper})
    }
    const response = await fetch('/api/htmltopdf', request);
}