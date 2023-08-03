/**
 * @flow
 */

import Router from 'koa-router'
import formidable from 'koa2-formidable'
import { generatePDF, generateSourceCode } from '../generator'
import { sanitizer, jsonResume } from '../middleware'
import { generatePDFFromHTML } from '../generator/pdfGenerator'
import { blobToBase64 } from '../generator/utils/file.util'
import { getContentDocumentId, salesforceAuth, salesforceCreateDocument, linkDocumentToObjectRecord } from '../services/salesforce.service'

const router = new Router({ prefix: '/api' })

/**
 * Router middleware
 */

router.use('/generate', sanitizer()) // Remove falsy values and empty objects/arrays from request body
router.use('/upload', formidable(), jsonResume()) // Parse multipart/form-data
router.use('/htmltopdf')
router.use('/getpdfsource')
router.use('/salesforcesync')

/**
 * Generate PDF from form data
 */
router.post("/salesforcesync", async ({ request, response }) => {
    const data: any = request.body;
    const token = await salesforceAuth();
    if(token && data) {

        Object.values(data.data).forEach((file) => {
            salesforceCreateDocument(file, data.meta.freelancer_id, token).then(async (id) => {
                const contentDocId = await getContentDocumentId(id, token);
                linkDocumentToObjectRecord(contentDocId, data.meta.record_id, token)
            })
        })
    }
    response.body = "";
})


router.post('/generate/resume', async ({ request, response }) => {
    response.body = generatePDF((request.body: any))
    response.type = 'application/pdf'
})

/**
 * Generate TeX source from form data
 */

router.post('/generate/source', async ({ request, response }) => {
    response.body = generateSourceCode((request.body: any))
    response.type = 'application/zip'
})

/**
 * Handle JSON upload from input file
 */

router.post('/upload', async ({ request, response }) => {
    response.body = (request.jsonResume: any)
    response.type = 'application/json'
})

/**
 * Handle HTML input and generate pdf from it
 */
router.post("/htmltopdf", async ({ request, response }) => {
    const { content, footer }: any = request.body;
    const pdf = await generatePDFFromHTML(content, footer)

    response.set("content-type", "application/pdf");
    response.body = pdf;
})

router.get("/getpdfsource", async ({ request, response }) => {
    const { profile }= request.query;
    const res = await fetch(profile);
    const lastModified = res.headers.get('last-modified');
    const blob = await res.blob();
    const array_buffer = await blob.arrayBuffer();

    const buffer = Buffer.from(array_buffer);
    response.set('Last-Modified',lastModified || '');
    response.body = buffer;
    response.type = blob.type;
})


export default router;