import fetch from 'node-fetch';
import { SALESFORCE_URL_BASE, SALESFORCE_API_KEY, SALESFORCE_OWNER_ID } from '../constants';
import { getCurrentDateFormatted } from '../utils/date.util';

export async function salesforceAuth() {
    const options = {
        headers: {
            Authorization: `Basic ${SALESFORCE_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: "grant_type=client_credentials"
    }
    const response = await fetch(`${SALESFORCE_URL_BASE}/services/oauth2/token`, options)
    const data = await response.json()
    return data.access_token;
}


export async function salesforceCreateDocument(base_64, freelancer_id, token) {
    const body = {
        "Title": `Mertus_${freelancer_id}_${getCurrentDateFormatted()}`,
        "PathOnClient": `Mertus_${freelancer_id}_${getCurrentDateFormatted()}.${base_64.split(';')[0].includes('json') ? 'json': 'pdf'}`,
        "ContentLocation": "S",
        "OwnerId": SALESFORCE_OWNER_ID,
        "VersionData": base_64.split(",")[1]
    };


    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }
    const response = await fetch(`${SALESFORCE_URL_BASE}/services/data/v58.0/sobjects/ContentVersion`, options)
    const data = await response.json()
    return data.id;
}


export async function getContentDocumentId(id: string, token: string) {


    const query = `SELECT+ContentDocumentId+FROM+ContentVersion+WHERE+Id+=+'${id}'`

    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'GET',
    }
    const response = await fetch(`${SALESFORCE_URL_BASE}/services/data/v58.0/query/?q=${query}`, options)
    const data = await response.json()
    return data.records[0]["ContentDocumentId"];
}

export async function linkDocumentToObjectRecord(contentDocId: string, record_id: string, token: string) {
    const body = {
        "ContentDocumentId": contentDocId,
        "LinkedEntityId": record_id,
        "Visibility": "AllUsers"
    };


    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }
    const response = await fetch(`${SALESFORCE_URL_BASE}/services/data/v58.0/sobjects/ContentDocumentLink`, options)
    const data = await response.json()
    return data.id;
}