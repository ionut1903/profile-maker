import {
    getCertification,
    getEducation,
    getLanguages, getLocation,
    getSkills,
    getWorkExperience
} from "../services/sovrenMapperService";

const http = require('https');

export const setAndGetOptionsForJSONResumeRequest = (payload, modifiedDate) => {
    const base64Text = Base64.encodeArray(payload);

    //other options here (see https://sovren.com/technical-specs/latest/rest-api/resume-parser/api/)
    const postData = JSON.stringify({
        'DocumentAsBase64String': base64Text,
        'DocumentLastModified': modifiedDate
    });

    //use https://eu-rest.resumeparsing.com/v10/parser/resume if your account is in the EU data center or
    //use https://au-rest.resumeparsing.com/v10/parser/resume if your account is in the AU data center
    const options = {
        host: 'eu-rest.resumeparsing.com',
        protocol: 'https:',
        path: '/v10/parser/resume',
        method: 'POST',
        headers: {
            'Sovren-AccountId': '24043950',
            'Sovren-ServiceKey': 'HytPHQt8UqzkBNP4lfEGg17BqyBhtABncto74GOF',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return [options, postData];
}

const makeRequestForJSONResume = (options, callback) => {
    console.log("makeRequestForJSONResume");
    const resumeParsingRequest = http.request(options, (response) => {
        response.setEncoding('utf8');
        let responseAsString = '';
        response.on('data', (chunk) => {
            responseAsString += chunk;
        });
        response.on('end', () => {
            const responseAsJson = JSON.parse(responseAsString);
            console.log("Sovren resume: ", responseAsJson);
            const resumeData = responseAsJson.Value.ResumeData;

            const work = getWorkExperience(resumeData.EmploymentHistory.Positions);
            const skills = getSkills(resumeData.SkillsData);
            const languages = getLanguages(resumeData.LanguageCompetencies);
            let education = getEducation(resumeData.Education);
            if (resumeData.Education) {
                education = getEducation(resumeData.Education);
            }

            if (resumeData.Certifications) {
                education = getCertification(education, resumeData.Certifications);
            }

            //ADDITIONAL

            // const additionalData = getAdditionalData(resumeData);

            const resume = {
                basics: {
                    name: resumeData.ContactInformation.CandidateName.FormattedName,
                    label: '',
                    image: '',
                    email: resumeData.ContactInformation.EmailAddresses,
                    phone: resumeData.ContactInformation.Telephones?resumeData.ContactInformation.Telephones[0].Normalized: '',
                    url: '',
                    summary: resumeData.ProfessionalSummary,
                    location: getLocation(resumeData.ContactInformation.Location),
                    profiles: [{
                        // network: '',
                        // username: '',
                        // url: ''
                    }]
                },
                work,
                // work: [/*{
                //   name: "Company",
                //   position: "President",
                //   url: "https://company.com",
                //   startDate: "2013-01-01",
                //   endDate: "2014-01-01",
                //   summary: "Description…",
                //   highlights: [
                //     "Started the company"
                //   ]
                // }*/],
                volunteer: [{
                    // organization: "Organization",
                    // position: "Volunteer",
                    // url: "https://organization.com/",
                    // startDate: "2012-01-01",
                    // endDate: "2013-01-01",
                    // summary: "Description…",
                    // highlights: [
                    //   "Awarded 'Volunteer of the Month'"
                    // ]
                }],
                education,
                // education: [{
                //   institution: "University",
                //   url: "https://institution.com/",
                //   area: "Software Development",
                //   studyType: "Bachelor",
                //   startDate: "2011-01-01",
                //   endDate: "2013-01-01",
                //   score: "4.0",
                //   courses: [
                //     "DB1101 - Basic SQL"
                //   ]
                // }],
                awards: [{
                    // title: "Award",
                    // date: "2014-11-01",
                    // awarder: "Company",
                    // summary: "There is no spoon."
                }],
                publications: [{
                    // name: "Publication",
                    // publisher: "Company",
                    // releaseDate: "2014-10-01",
                    // url: "https://publication.com",
                    // summary: "Description…"
                }],
                skills,
                // "skills": [{
                //   "name": "Web Development",
                //   "level": "Master",
                //   "keywords": [
                //     "HTML",
                //     "CSS",
                //     "JavaScript"
                //   ]
                // }],
                languages,
                // "languages": [{
                //   "language": "English",
                //   "fluency": "Native speaker"
                // }],
                interests: [{
                    // "name": '',
                    // "keywords": [
                    //   '',
                    //   ''
                    // ]
                }],
                references: [{
                    // "name": "Jane Doe",
                    // "reference": "Reference…"
                }],
                projects: [{
                    // "name": "Project",
                    // "description": "Description…",
                    // "highlights": [
                    //   "Won award at AIHacks 2016"
                    // ],
                    // "keywords": [
                    //   "HTML"
                    // ],
                    // "startDate": "2019-01-01",
                    // "endDate": "2021-01-01",
                    // "url": "https://project.com/",
                    // "roles": [
                    //   "Team Lead"
                    // ],
                    // "entity": "Entity",
                    // "type": "application"
                }]
            }
            callback(resume);
        });
    })
    return resumeParsingRequest;
}

export default makeRequestForJSONResume;