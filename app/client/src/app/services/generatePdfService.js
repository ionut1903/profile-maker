export const generatePDF = async (pages) => {
    const {fetch} = window;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: pages})
    }
    const pdfBuffer = await fetch('/api/htmltopdf', request);

    pdfBuffer.blob().then(res => {
        const fileURL = window.URL.createObjectURL(res);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'resume.pdf';
        alink.click();
    }).catch(err => {
        console.error(err);
    })

}