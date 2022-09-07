export const generatePDF = async (pages) => {
    const { fetch } = window;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: pages})
    }
    const response = await fetch('/api/htmltopdf', request);
}