/**
 * @flow
 */

import Router from 'koa-router'
import formidable from 'koa2-formidable'
import {generatePDF, generateSourceCode} from '../generator'
import {sanitizer, jsonResume} from '../middleware'
const pupeteer = require('puppeteer');
const router = new Router({prefix: '/api'})

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
        const browser = await pupeteer.launch();
        const page = await browser.newPage();
        await page.setContent(request.body.html);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'resume.pdf',
            format: 'A4',
            margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
            printBackground: true
        });
        await browser.close();
        response.body = 'Success'
    } catch (error) {
        console.error(error);
    }

})
export default router
