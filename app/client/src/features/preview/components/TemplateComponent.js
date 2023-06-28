import React, {Component} from 'react'
import basicJson from '../../../../../basic.json'
import {
    layout,
    TemplateContainer,
    colors
} from "./TemplateCommonComponents";
import {LogoContainer} from "./common/TemplateHeaderComponent";
import {TemplateContactDataComponent} from "./common/TemplateContactDataComponent";
import {TemplateProfilePhotoComponent} from "./common/TemplateProfilePhotoComponent";
import {FlexBetweenContainer} from "./common/TemplateFlexComponents";
import {WorkExperienceSection} from "./common/TemplateWorkExperienceComponent";
import {SectionTitleAndFlexListComponent} from "./common/TemplateSectionAndFlexListComponent";
import {SectionTitleAndDescriptionComponent} from "./common/SectionTitleAndDescriptionComponent";
import {SectionTitleAndListComponent} from "./common/SectionTitleAndListComponent";
import {SectionHeader} from "./common/SectionHeader";
import {AdditionalDataComponent} from "./common/AdditionalDataComponent";
import {FooterResume} from "../FooterResume";
// todo - investigate where is the email set as a string and not as an array?
type Props = {
    json?: any
}

class TemplateComponent extends Component<Props> {
    getEmail = (email) => {
        if (typeof email === 'string') {
            return email;
        } else if (!email) {
            return 'No email found'
        } else {
            return email[0];
        }
    }

    mapJsonResumeToTemplate = () => {
        let {json} = this.props;
        console.log("json: ", json)
        if (!json) {
            json = basicJson;
        }
        const fullAddress = json.basics.fullAddress ? json.basics.fullAddress : 'NOT FOUND - ADD ADDRESS';
        const dateOfBirth = json.basics.year ? json.basics.year : 'NOT FOUND - YEAR?';
        const shortDescription = json.basics.shortDescription ? json.basics.shortDescription.toUpperCase() : 'NOT FOUND - SHORT DESCRIPTION?';
        const phoneNumber = json.basics.phone ? json.basics.phone : 'NOT FOUND - PHONE NUMBER'
        const email = this.getEmail(json.basics.email);
        const fullName = json.basics.name? json.basics.name.toUpperCase(): 'NOT FOUND NAME';
        const certifications = [];
        json.education.forEach(edu => {
            if (edu.area) {
                certifications.push(edu.area);
            }
        });
        const workList = json.work;
        workList.forEach((w) => {
            w.position =  w.position? w.position.toUpperCase() : '';
        });
        const coreCompetencies = [];
        json.skills.forEach(skill => {
            if (skill.name) {
                coreCompetencies.push(skill.name);
            }
        });
        const description = json.basics.summary;
        const languages = json.languages;
        let allSkills = [];
        if(json.allSkills) {
            allSkills = json.allSkills.filter(sk => sk)
        }
        return {
            languages,
            allSkills,
            fullAddress,
            dateOfBirth,
            phoneNumber,
            email,
            fullName,
            certifications,
            workList,
            coreCompetencies,
            description,
            shortDescription,
            footer: json.footer
        };
    }

    render() {
        if(!this) {
            return null;
        }
        const {
            languages,
            allSkills,
            fullAddress,
            dateOfBirth,
            fullName,
            certifications,
            workList,
            coreCompetencies,
            description,
            shortDescription,
            footer
        } = this.mapJsonResumeToTemplate();

        return (
            <div id="componentToPrint">
                <TemplateContainer>
                    <FlexBetweenContainer extraStyle={{marginBottom: layout.marginBottomSection, height: layout.headerHeight}}>
                        <LogoContainer fullName={fullName}
                                       shortDescription={shortDescription}/>
                        <TemplateProfilePhotoComponent/>
                        <TemplateContactDataComponent dateOfBirth={dateOfBirth}
                                                      fullAddress={fullAddress}
                                                      languages={languages}/>
                    </FlexBetweenContainer>
                    <section>
                        <SectionTitleAndDescriptionComponent title={'Profesional Profile'}
                                                             description={description}/>
                    </section>
                    <section>
                        <SectionTitleAndFlexListComponent title={'Core Competencies'}
                                                          list={coreCompetencies}/>
                    </section>
                    <AdditionalDataComponent allSkills={allSkills}></AdditionalDataComponent>
                    <section>
                        <SectionTitleAndListComponent title={'Education & Certificates'}
                                                      list={certifications}/>
                    </section>
                    <section style={{background: colors.white}}>
                        <SectionHeader extraStyles={{
                            color: colors.black,
                            width: '100%',
                            padding: '0 20px 20px 20px',
                            margin: 0
                        }}>{'WORK EXPERIENCE'}</SectionHeader>
                        {
                            workList.map((work) => {
                                return <WorkExperienceSection key={work.startDate + work.endDate + work.name}
                                                              work={work}></WorkExperienceSection>
                            })
                        }
                    </section>
                    <FooterResume info={footer}/>
                </TemplateContainer>
            </div>

        )
    }
}

export default TemplateComponent

