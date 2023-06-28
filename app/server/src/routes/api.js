/**
 * @flow
 */

import Router from 'koa-router'
import formidable from 'koa2-formidable'
import {generatePDF, generateSourceCode} from '../generator'
import {sanitizer, jsonResume} from '../middleware'

const pupeteer = require('puppeteer');
const router = new Router({prefix: '/api'})
const PDFMerger = require("pdf-merger-js")
const fs = require('fs')

/**
 * Router middleware
 */

router.use('/generate', sanitizer()) // Remove falsy values and empty objects/arrays from request body
router.use('/upload', formidable(), jsonResume()) // Parse multipart/form-data
router.use('/htmltopdf')

/**
 * Generate PDF from form data
 */

router.post('/generate/resume', async ({request, response}) => {
    response.body = generatePDF((request.body: any))
    response.type = 'application/pdf'
})

/**
 * Generate TeX source from form data
 */

router.post('/generate/source', async ({request, response}) => {
    response.body = generateSourceCode((request.body: any))
    response.type = 'application/zip'
})

/**
 * Handle JSON upload from input file
 */

router.post('/upload', async ({request, response}) => {
    response.body = (request.jsonResume: any)
    response.type = 'application/json'
})

/**
 * Handle HTML input and generate pdf from it
 */

router.post('/htmltopdf', async ({request, response}) => {
    try {
        const browser = await pupeteer.launch({
		executablePath: '/usr/bin/google-chrome-stable'
	});
        const pagePaths = [];
        for (let i = 0; i < request.body.html.length; i++) {
            const page = await browser.newPage();
            const path = `page${i}.pdf`;
            await page.setContent(request.body.html[i], { waitUntil: 'networkidle2' });
            await page.emulateMediaType('screen');
            await page.pdf({
                path: path,
                    format: 'A4',
                    margin: {top: '10px', right: '5px', bottom: '10px', left: '5px'},
                    printBackground: true,
            })
            pagePaths.push(path);
        }

        await browser.close();
        const merger = new PDFMerger();

        for (let i = 0; i < pagePaths.length; i++) {
            await merger.add(pagePaths[i]);
        }

        await merger.save('resume.pdf');
        for (let i = 0; i < pagePaths.length; i++) {
            fs.unlinkSync(pagePaths[i]);
        }
        const src = fs.createReadStream('resume.pdf');
        response.set("content-type", "application/pdf");
        response.body = src;

        // fs.unlinkSync(resumeName);
    } catch (error) {
        console.error(error);
    }
})
export default router
