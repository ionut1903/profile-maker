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

type Props = {
    json?: any
}

class TemplateComponent extends Component<Props> {

    mapJsonResumeToTemplate = () => {
        let {json} = this.props;
        if(!json){
            json = basicJson;
        }
        const fullAddress = json.basics.fullAddress;
        const dateOfBirth = 'Not in sovren JSON?';
        const phoneNumber = json.basics.phone

        let email = '';
        if (typeof json.basics.email === 'string') {
            email = json.basics.email;
        } else {
            email = json.basics.email[0];
        }
        const fullName = json.basics.name;
        const certifications = json.education.map(edu => {
            return edu.area;
        });

        const workList = json.work;

        const coreCompetencies = json.skills.map(skill=> skill.name);
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
                        <LogoContainer fullName={fullName} shortDescription={'SAP BO/BI Berater / Data Warehouse Architekt / SAP Data Services'}/>
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
                        <SectionTitleAndListComponent title={'Certificates'}
                                                      list={certifications}/>
                    </section>
                    <section style={{background: colors.white}}>
                        {
                            workList.map(work => {
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

