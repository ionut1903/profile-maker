import React, {Component} from 'react'
import jsonResume from '../../../../../../test_json.json'
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
// todo - investigate where is the email set as a string and not as an array?
type Props = {
    json?: any
}

class TemplateComponent extends Component<Props> {
    getEmail = (email) => {
        if (typeof email === 'string') {
            return email;
        } else {
            return email[0];
        }
    }

    mapJsonResumeToTemplate = () => {

        let {json} = this.props;
        if(!json) {
            json = basicJson;
        }
        const fullAddress = json.basics.fullAddress;
        const dateOfBirth = 'Not in sovren JSON?';
        const phoneNumber = json.basics.phone
        const email = this.getEmail(json.basics.email);
        const fullName = json.basics.name;
        // console.log("6.EDUCATION BASIC TO MAP ON TEMPLATE: ",json.education);
        const certifications = json.education.map(edu => {
            return edu.area;
        });

        const workList = json.work;

        const coreCompetencies = json.skills.map(skill => skill.name);
        const description = json.basics.summary;
        return {
            fullAddress,
            dateOfBirth,
            phoneNumber,
            email,
            fullName,
            certifications,
            workList,
            coreCompetencies,
            description
        };
    }

    render() {
        const {
            fullAddress,
            dateOfBirth,
            phoneNumber,
            email,
            fullName,
            certifications,
            workList,
            coreCompetencies,
            description
        } = this.mapJsonResumeToTemplate();

        return (
            <div id="componentToPrint">
                <TemplateContainer>
                    <FlexBetweenContainer extraStyle={{marginBottom: layout.padContainer, height: "180px"}}>
                        <LogoContainer fullName={fullName}
                                       shortDescription={'SAP BO/BI Berater / Data Warehouse Architekt / SAP Data Services'}/>
                        <TemplateProfilePhotoComponent/>
                        <TemplateContactDataComponent email={email} phoneNumber={phoneNumber} dateOfBirth={dateOfBirth}
                                                      fullAddress={fullAddress}/>
                    </FlexBetweenContainer>
                    <section>
                        <SectionTitleAndDescriptionComponent title={'Profesional Profile'}
                                                             description={description}/>
                    </section>
                    <section>
                        <SectionTitleAndFlexListComponent title={'Core Competencies'}
                                                          list={coreCompetencies}/>
                    </section>
                    <section>
                        <SectionTitleAndListComponent title={'Education & Certificates'}
                                                      list={certifications}/>
                    </section>
                    <section style={{background: colors.white}}>
                        <SectionHeader extraStyles={{
                            color: colors.black,
                            width: '100%',
                            padding: '20px 20px 0'
                        }}>{'WORK EXPERIENCE'}</SectionHeader>
                        {
                            workList.map((work, i) => {
                                return <WorkExperienceSection key={work.startDate + work.endDate}
                                                              work={work}></WorkExperienceSection>
                            })
                        }
                    </section>
                </TemplateContainer>

            </div>

        )
    }
}

export default TemplateComponent

