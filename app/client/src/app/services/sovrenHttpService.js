import {
    getMappedResumeData,
} from "../services/sovrenMapperService";

const http = require('https');

export const setAndGetOptionsForJSONResumeRequest = (payload, modifiedDate) => {
    const base64Text = Base64.encodeArray(payload);

    const postData = JSON.stringify({
        'DocumentAsBase64String': base64Text,
        'DocumentLastModified': modifiedDate
    });

    const options = {
        host: 'eu-rest.resumeparsing.com',
        protocol: 'https:',
        path: '/v10/parser/resume',
        method: 'POST',
        headers: {
            'Sovren-AccountId': '18007492',
            'Sovren-ServiceKey': 'YRXLfLXmoEtuP7K7RzJ5XsHAfWIWKh9J3LihwiCU',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return [options, postData];
}

const makeRequestForJSONResume = (options, callback) => {
    const resumeParsingRequest = http.request(options, (response) => {
        response.setEncoding('utf8');
        let responseAsString = '';
        response.on('data', (chunk) => {
            responseAsString += chunk;
        });
        response.on('end', () => {
            const responseAsJson = JSON.parse(responseAsString);
            const resumeData = responseAsJson.Value.ResumeData;
            // console.log("SOVREN json: ", resumeData);
            const resume = getMappedResumeData(resumeData)

            callback(resume);
        });
    })
    return resumeParsingRequest;
}

export default makeRequestForJSONResume;
