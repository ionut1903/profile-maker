import React, {Component} from 'react'
import jsonResume from '../../../../../../test_json.json'
import {
    AddressElement,
    AddressLabelElement,
    ContactData, DivFlexContainer,
    HeaderContainer,
    HeaderSubTitle,
    HeaderTitle,
    LogoContainer,
    ProfileContainer,
    SectionTitleAndDescriptionComponent,
    SectionTitleAndFlexListComponent,
    SectionTitleAndListComponent,
    TemplateContainer,
    WorkExperienceSection
} from "./TemplateCommonComponents";

type Props = {
    json?: any
}

class TemplateComponent extends Component<Props> {

    mapJsonResumeToTemplate = () => {
        const {json} = this.props;
        const {countryCode, postalCode, address, city} = json.basics.location;
        const fullAddress = `${countryCode}; ${city}; ${address}; ${postalCode}`;
        const dateOfBirth = 'Not in sovren JSON';
        const phoneNumber = json.basics.phone

        // todo - make type the same everywhere
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

        const coreCompetencies = []
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
        console.log("Template2: ", this.props.json);
        console.log("Template component : ", this.props.json.basics.email);
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
                    <DivFlexContainer>
                        <LogoContainer>
                            <img
                                src="https://mertus-consulting.com/wp-content/uploads/2021/06/logo_mertus.png"
                                alt="Mertus consulting logo"/>
                            <HeaderTitle>{fullName}</HeaderTitle>
                            <HeaderSubTitle>
                                {'Short description or what?'}
                            </HeaderSubTitle>
                        </LogoContainer>
                        <ProfileContainer className="center">
                            <img style={{width: '100%'}}
                                 src="data:image/jpeg;base64,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"
                                 alt="Mertus consulting user profile"/>
                        </ProfileContainer>
                        <ContactData>
                            <div style={{
                                borderBottom: `1px solid lightgray`,
                                paddingBottom: '5px',
                                marginBottom: '5px'
                            }}>
                                <AddressElement value={phoneNumber} icon="phone"/>
                                <AddressElement value={email} icon="email"/>
                            </div>
                            <div>
                                <AddressLabelElement title='Address: ' value={fullAddress}/>
                                <AddressLabelElement title='Year: ' value={dateOfBirth}/>
                            </div>
                        </ContactData>
                    </DivFlexContainer>
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
                    <section style={{height: '300px', background: 'white'}}>
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

