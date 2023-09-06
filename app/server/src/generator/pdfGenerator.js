import { createReadStream, createWriteStream, readFileSync } from 'fs-promise';
import pupeteer from 'puppeteer'
const wkhtmltopdf = require("wkhtmltopdf")
import { BROWSER_ARGS, FOOTER_TEMPLATE, PATH_FOOTER, PATH_RESUME } from '../constants';
import { base64_encode } from './utils/file.util';



async function getFooterTemplate (footerHTML: string, browser: pupeteer.Browser) {

    const footerTemplate = await browser.newPage();

    await footerTemplate.setViewport({
        width: 800,
        height: 100,
        deviceScaleFactor: 8,
    });

    await footerTemplate.setContent(footerHTML);
    await footerTemplate.screenshot({ path: PATH_FOOTER, quality: 100, type:"jpeg" });

    const footerImg = base64_encode(PATH_FOOTER);

    return `<img src="data:image/png;base64, ${footerImg}" style="width:100%;height:120px; object-fit:contain;;margin-bottom:-40px"/>`
}

async function getPDF(contentHTML: string, footerTemplate: string, browser: pupeteer.Browser) {
    const path = PATH_RESUME;

    const template = await browser.newPage();

    await template.setContent(contentHTML, { waitUntil: 'networkidle2' });

    await template.emulateMediaType('screen');
    // add margin-top exception in first page
    await template.addStyleTag({
        content: "@page:first {margin-top: 10px;}",
    })
    
    await template.pdf({
        path,
        format: 'A4',
        margin: { top: '60px', right: '5px', bottom: '180px', left: '5px' },
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate,
        headerTemplate: "<div></div>"
    })

    const pdf = createReadStream(PATH_RESUME);

    return pdf;
}

export async function generatePDFFromHTML(contentHTML: string, footerHTML: string) {
    try {
        const browser = await pupeteer.launch({
            //executablePath: '/usr/bin/google-chrome-stable', 
            headless: true,
            args: BROWSER_ARGS,
            userDataDir: "./tmp"
        });

        const footerTemplate = await getFooterTemplate(footerHTML, browser);

        const pdf = await getPDF(contentHTML, footerTemplate, browser)


        await browser.close();

        return pdf

    } catch (err) {
        console.log(err)
    }

}