export const getWorkExperience = (positions) => {
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

export const getSkills = (skillsData) => {
    const skills = [];
    for (let skill in skillsData) {
        for (let taxonomie in skillsData[skill].Taxonomies) {
            var Keywords = {
                keywords: []
            };
            for (let c in skillsData[skill].Taxonomies[taxonomie].SubTaxonomies) {
                var item = skillsData[skill].Taxonomies[taxonomie].SubTaxonomies[c];
                Keywords.keywords.push(
                    item.SubTaxonomyName
                );
            }
            var item = skillsData[skill].Taxonomies[taxonomie];
            skills.push({
                "name": item.Name,
                "level": "",
                "keywords": Keywords.keywords
            });
        }
    }
    return skills;
}

export const getLanguages = (langCompetencies) => {
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

export const getEducation = (education) => {
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

export const getCertification = (educationList, certifications) => {
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

export const getLocation = (locationObj) => {
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

export const getAdditionalData = (resume) => {
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