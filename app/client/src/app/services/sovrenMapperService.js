import {getResumeObject} from "./ResumeObject";
// todo : what if no end date found?
// todo : Add type to resumeObject !!! future improvement after the first version

const sortListOfPositions = (list) => {
    return list.sort((a, b) => {
        const idA = parseInt(a.split('-')[1]);
        const idB = parseInt(b.split('-')[1]);
        if (idA < idB) {
            return -1;
        }
        if (idB < idA) {
            return 1;
        }
        return 0;
    });
}
const getWorkExperience = (positions) => {
    const workMap = new Map();
    const work = [];
    const positionIdList = [];
    positions.forEach(pos => {
        positionIdList.push(pos.Id);
        workMap.set(pos.Id, {
            id: pos.Id,
            name: (pos.Employer ? pos.Employer.Name.Raw : ''),
            position: (pos.JobTitle ? pos.JobTitle.Raw : ''),
            url: '',
            startDate: (pos.StartDate ? pos.StartDate.Date : ''),
            endDate: (pos.EndDate ? pos.EndDate.Date : ''),
            summary: (pos.Description ? pos.Description : ''),
            highlights: [
                (pos.Description ? pos.Description : '')
            ],
            company: (pos.Employer ? pos.Employer.Name.Raw : '')
        });
    });
    sortListOfPositions(positionIdList);
    positionIdList.forEach(id => {
        work.push(workMap.get(id));
    });
    return work;
}
const getSkills = (skillsData) => {
    const skillsMap = new Map();
    skillsData.forEach((skill) => {
        let frequencyOfSkill = 0;
        const skillFrequencyList = skill.FoundIn;
        skillFrequencyList.forEach((section) => {
            if (section.SectionType === 'WORK HISTORY') {
                frequencyOfSkill++;
            }
        });
        if (frequencyOfSkill > 3 && !skillsMap.has(skill.Name)) {
            skillsMap.set(skill.Name, {
                name: skill.Name,
                level: '',
                keywords: []
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
            language: item.Language,
            "fluency": ''
        });
    }
    return languages;
}

const getEducation = (education) => {
    // console.log("1. SOVREN EDUCATION:", education);
    const educationList = [];
    education.EducationDetails.forEach((edDetail) => {
        educationList.push({
            institution: edDetail.SchoolName.Normalized,
            url: '',
            area: edDetail.Text,
            studyType: edDetail.Degree.Name ? edDetail.Degree.Name.Raw : '',
            startDate: '',
            endDate: edDetail.LastEducationDate ? edDetail.LastEducationDate.Date : '',
            score: '',
            courses: [edDetail.Text],
        });
    })
    // console.log("2.MAPPED EDUCATION: ", educationList)
    return educationList;
}

const setCertification = (educationList, certifications) => {
    debugger
    // console.log("3.SOVREN CERTIFICATION: ", certifications);
    certifications.forEach((cert)=>{
        educationList.push({
            institution: '',
            url: '',
            area: cert.Name,
            studyType: cert.Name,
            startDate: '',
            endDate: '',
            score: '',
            courses: []
        });
    })
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
        region: ''
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
    let education = [];
    debugger;
    if (resumeData.Education) {
        education = getEducation(resumeData.Education);
    }
    if (resumeData.Certifications) {
        setCertification(education, resumeData.Certifications);
    }
    return education;
}

const getFullAddress = (location) => {
    const {countryCode, postalCode, address, city} = location;
    let fullAddress = '';
    fullAddress += countryCode ? countryCode + ';' : '';
    fullAddress += postalCode ? postalCode + ';' : '';
    fullAddress += address ? address + ';' : '';
    fullAddress += city ? city + ';' : '';
    return fullAddress;
}

export const getMappedResumeData = (resumeData) => {
    const finalResume = getResumeObject(resumeData);
    const location = getLocation(resumeData.ContactInformation.Location);
    const languages = getLanguages(resumeData.LanguageCompetencies);
    const fullAddress = getFullAddress(location);
    const skills = getSkills(resumeData.Skills.Raw);
    const education = getEducationAndCertifications(resumeData)
    console.log("4.EDUCATION WITH CERTIFICATION: ", education);
    const work = getWorkExperience(resumeData.EmploymentHistory.Positions);
    // const additionalData = getAdditionalData(resumeData);

    finalResume.basics.location = location;
    finalResume.basics.fullAddress = fullAddress;
    finalResume.skills = skills;
    finalResume.languages = languages;
    finalResume.work = work;
    finalResume.education = education;
    console.log("FINAL RESUME:", finalResume);
    return finalResume;
}