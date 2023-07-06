export const generatePDF = async (pages, userName) => {
    const {fetch} = window;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({html: pages})
    }
    userName = userName ? userName : 'resume';

    const pdfBuffer = await fetch('/api/htmltopdf', request);

    pdfBuffer.blob().then(res => {
        const fileURL = window.URL.createObjectURL(res);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = `${userName}.pdf`;
        alink.click();
    }).catch(err => {
        console.error(err);
    })

}

export const requestPDFConversion = async ({content, footer }, userName) => {
    const { fetch } = window;
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, footer })
    }
    userName = userName ? userName : 'resume';

    const pdfBuffer = await fetch('/api/htmltopdf', request);

    pdfBuffer.blob().then(res => {
        const fileURL = window.URL.createObjectURL(res);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = `${userName}.pdf`;
        alink.click();
    }).catch(err => {
        console.error(err);
    })

}