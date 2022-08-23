export const generatePDF = async (html) => {
    const { fetch } = window
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: html.innerHTML})
    }
    const response = await fetch('/api/htmltopdf', request);
    console.log("Response after generating pdf: ", response);
}