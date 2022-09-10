import {getLanguages, getLocation, getWorkExperience} from "./sovrenMapperService";

export const getResumeObject = (resumeData) => {
    const name = resumeData.ContactInformation.CandidateName ?
        resumeData.ContactInformation.CandidateName.FormattedName : 'NOT FOUND - NAME';
    return {
        basics: {
            name: name,
            label: '',
            image: '',
            email: resumeData.ContactInformation.EmailAddresses,
            phone: resumeData.ContactInformation.Telephones ? resumeData.ContactInformation.Telephones[0].Normalized : '',
            url: '',
            summary: resumeData.ProfessionalSummary,
            location: '',
            profiles: [{
                // network: '',
                // username: '',
                // url: ''
            }]
        },
        work: [],
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
        education: [],
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
        skills: [],
        // "skills": [{
        //   "name": "Web Development",
        //   "level": "Master",
        //   "keywords": [
        //     "HTML",
        //     "CSS",
        //     "JavaScript"
        //   ]
        // }],
        languages: {},
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
        }],
    }

}