import {getResumeObject} from "./ResumeObject";

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
        const companyName = pos.Employer ? (pos.Employer.Name ? pos.Employer.Name.Raw : '') : '';
        workMap.set(pos.Id, {
            id: pos.Id,
            name: companyName,
            position: (pos.JobTitle ? pos.JobTitle.Raw.toUpperCase() : ''),
            url: '',
            startDate: (pos.StartDate ? pos.StartDate.Date : ''),
            endDate: (pos.EndDate ? pos.EndDate.Date : ''),
            summary: (pos.Description ? pos.Description : ''),
            highlights: [
                (pos.Description ? pos.Description : '')
            ],
            company: companyName
        });
    });
    sortListOfPositions(positionIdList);
    positionIdList.forEach(id => {
        work.push(workMap.get(id));
    });
    if (work.length === 0) {
        return ['NOT FOUND - WORK HISTORY'];
    }
    return work;
}
const getCoreCompetencies = (skillsData) => {
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
    if (skillsMap.size === 0) {
        return ['NOT FOUND - CORE COMPETENCIES'];
    }
    const skills = Array.from(skillsMap.values());
    return skills;
}

const getAllTechSkills = (skillsData) => {
    const skillsSet = new Set();
    const lowerCaseSkillsSet = new Set();
    skillsData.forEach((skill) => {
        if (!lowerCaseSkillsSet.has(skill.Name.trim().toLowerCase())) {
            skillsSet.add(skill.Name);
            lowerCaseSkillsSet.add(skill.Name.trim().toLowerCase());
        }
    });

    if (skillsSet.size === 0) {
        return ['NOT FOUND - SKILLS'];
    }
    return Array.from(skillsSet);
}

const getLanguages = (langCompetencies) => {
    const languages = [];
    for (var i in langCompetencies) {
        var item = langCompetencies[i];
        languages.push(item.Language);
    }

    if (languages.length === 0) {
        return ['NOT FOUND - LANGUAGES']
    }
    return languages;
}

const getEducation = (education) => {
    const educationList = [];
    education.EducationDetails.forEach((edDetail) => {
        const educationDegree = edDetail.Degree ? edDetail.Degree : null;
        const studyType = educationDegree ? (edDetail.Degree.Name ? edDetail.Degree.Name.Raw : '') : '';
        educationList.push({
            institution: edDetail.SchoolName ? edDetail.SchoolName.Normalized : 'NOT FOUND',
            url: '',
            area: edDetail.Text,
            studyType: studyType,
            startDate: '',
            endDate: edDetail.LastEducationDate ? edDetail.LastEducationDate.Date : '',
            score: '',
            courses: [edDetail.Text],
        });
    })
    return educationList;
}

const setCertification = (educationList, certifications) => {
    certifications.forEach((cert) => {
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
    });
    if (educationList.length === 0) {
        return [{area: 'NOT FOUND - EDUCATION AND CERTIFICATION'}]
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
        region: ''
    }
}

const getEducationAndCertifications = (resumeData) => {
    let education = [];
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
    fullAddress += countryCode ? countryCode + ',' : '';
    fullAddress += city ? city + ',' : '';
    fullAddress += address ? address + ',' : '';
    fullAddress += postalCode ? postalCode + ',' : '';
    return fullAddress;
}

export const getMappedResumeData = (resumeData) => {
    debugger
    if (!resumeData) {
        // show error
        console.error("Could not parse resume, or resume was made with images");
        return;
    }
    const finalResume = getResumeObject(resumeData);
    const location = getLocation(resumeData.ContactInformation.Location);
    const languages = getLanguages(resumeData.LanguageCompetencies);
    const fullAddress = getFullAddress(location);
    const competencies = getCoreCompetencies(resumeData.Skills.Raw);
    const allSkills = getAllTechSkills(resumeData.Skills.Raw);
    const education = getEducationAndCertifications(resumeData)
    const work = getWorkExperience(resumeData.EmploymentHistory.Positions);
    const additionalData = [{name: 'Languages', value: languages}, {name: 'Tech skills', value: allSkills}]

    finalResume.basics.location = location;
    finalResume.basics.fullAddress = fullAddress;
    finalResume.skills = competencies;
    finalResume.work = work;
    finalResume.education = education;
    finalResume.additionalData = additionalData;
    return finalResume;
}