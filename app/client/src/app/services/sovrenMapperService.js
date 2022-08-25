import {getResumeObject} from "./ResumeObject";

const getWorkExperience = (positions) => {
    const work = [];
    for (let pos in positions) {
        const position = positions[pos];
        work.push({
            "name": (position.Employer ? position.Employer.Name.Raw : ""),
            "position": (position.JobTitle ? position.JobTitle.Raw : ""),
            "url": "",
            "startDate": (position.StartDate ? position.StartDate.Date : ""),
            "endDate": (position.EndDate ? position.EndDate.Date : ""),
            "summary": (position.Description ? position.Description : ""),
            "highlights": [
                (position.Description ? position.Description : "")
            ],
            "company": (position.Employer ? position.Employer.Name.Raw : "")
        });
    }
    return work;
}
// todo : Add type to resumeObject !!! future improvement after the first version
const getSkills = (skillsData) => {
    const skillsMap = new Map();
    skillsData.forEach((skill) => {
        let frequencyOfSkill = 0;
        const skillFrequencyList = skill.FoundIn;
        skillFrequencyList.forEach((section) => {
            if (section.SectionType == 'WORK HISTORY') {
                frequencyOfSkill++;
            }
        });
        if (frequencyOfSkill > 3 && !skillsMap.has(skill.Name)) {
            console.log("Add Skill: ", skill.Name);
            skillsMap.set(skill.Name, {
                "name": skill.Name,
                "level": "",
                "keywords": []
            });
        }
    });
    const skills = Array.from(skillsMap.values());
    return skills;
}

const getLanguages = (langCompetencies) => {
    const languages = [];
    for (var i in langCompetencies) {
        var item = langCompetencies[i];
        languages.push({
            "language": item.Language,
            "fluency": ""
        });
    }
    return languages;
}

const getEducation = (education) => {
    const educationList = [];
    if (education) {
        for (var i in education.EducationDetails) {
            var item = education.EducationDetails[i];
            educationList.push({
                "institution": "",
                "url": "",
                "area": item.Majors,
                "studyType": item.Degree.Name ? item.Degree.Name.Raw : '',
                "startDate": "",
                "endDate": item.LastEducationDate ? item.LastEducationDate.Date : '',
                "score": "",
                "courses": [
                    ""
                ]
            });
        }
    }
    return educationList;
}

const getCertification = (educationList, certifications) => {
    for (let i in certifications) {
        let item = certifications[i];
        educationList.push({
            "institution": "",
            "url": "",
            "area": item.Name,
            "studyType": item.Name,
            "startDate": "",
            "endDate": "",
            "score": "",
            "courses": [
                ""
            ]
        });
    }
    return educationList;
}

const getLocation = (locationObj) => {
    if (!locationObj) {
        return {
            address: '',
            postalCode: '',
            city: '',
            countryCode: '',
            region: ''
        };
    }
    return {
        address: locationObj.StreetAddressLines,
        postalCode: locationObj.PostalCode,
        city: locationObj.Municipality,
        countryCode: locationObj.CountryCode,
        region: ""
    }
}

const getAdditionalData = (resume) => {
    const languages = getLanguages(resume.LanguageCompetencies);
    // const technologies =

}

// const getLanguages=(languageCompetencies)=>{
//     if (!languageCompetencies) {
//         return {};
//     }
//     const languageList = languageCompetencies.map((langObj) => {
//         return langObj.Language;
//     })
//     return {
//         languages: {
//             type: 'list',
//             name: 'Languages',
//             languageList
//         }
//     }
// }

const getEducationAndCertifications = (resumeData) => {
    let education = getEducation(resumeData.Education);
    if (resumeData.Education) {
        education = getEducation(resumeData.Education);
    }
    if (resumeData.Certifications) {
        education = getCertification(education, resumeData.Certifications);
    }
    return education;
}

const getFullAddress = (location) => {
    const {countryCode, postalCode, address, city} = location;
    return `${countryCode}; ${city}; ${address}; ${postalCode}`;
}

export const getMappedResumeData = (resumeData) => {
    const finalResume = getResumeObject(resumeData);
    const location = getLocation(resumeData.ContactInformation.Location);
    const languages = getLanguages(resumeData.LanguageCompetencies);
    const fullAddress = getFullAddress(location);
    const skills = getSkills(resumeData.Skills.Raw);
    const education = getEducationAndCertifications(resumeData)
    const work = getWorkExperience(resumeData.EmploymentHistory.Positions);
    // const additionalData = getAdditionalData(resumeData);

    finalResume.basics.location = location;
    finalResume.basics.fullAddress = fullAddress;
    finalResume.skills = skills;
    finalResume.languages = languages;
    finalResume.work = work;
    finalResume.education = education;
    return finalResume;
}