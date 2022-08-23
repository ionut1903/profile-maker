import React from 'react'
import styled from "styled-components";
import {Icon} from "../../../common/components";
import {divide} from "lodash/math";

//colors
const white = '#fff';
const black = '#021C1E';
const mainColor = '#2C7873';

// fonts
const contentFontSize = 13;
const titleFontSize = 30;
const subTitleFontSize = 25;
const bold = 500;
const lineHeight = 1.1;

//layout
const headerHeight = 250;
const marginSmallRight = 5;
const padInt = 10;
const mgBottom = 10;
const border = '1px solid lightgray';

//Flex components

export const DivFlexContainer = (props) => {
    return (
        <div style={{display: 'flex', background: 'red', padding: '10px', height: '250px', color: 'black'}}>
            {props.children}
        </div>
    )
}

export const FlexBetweenContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2%
`

export const FlexColumnBetweenContainer = styled(FlexBetweenContainer)`
  flex-direction: column;
`

export const FlexContainer = styled.div`
  display: flex;
`

export const FlexCenterVerticalAndHorizontal = styled(FlexBetweenContainer)`
  align-items: center;
`

// Header components
export const TemplateContainer = styled.div`
  font-size: ${contentFontSize}px;
  font-family: 'Roboto';
  color: ${white};
  height: 100vh;
  background: ${white};
  line-height: ${lineHeight};
  letter-spacing: 1px;
  text-align: initial;
  width: 90%;
  margin: 0 auto;
  overflow: scroll;
`

export const HeaderContainer = styled(FlexBetweenContainer)`
  padding: ${padInt}px;
  height: ${headerHeight}px;
  color: ${black};
`

export const HeaderElement = styled.div`
  width: 25%;
  height: 100%;
  max-height: 100%;
`

export const LogoContainer = styled(HeaderElement)`
  flex-grow: 2;
`
export const ProfileContainer = styled(HeaderElement)`
  &.flex-center {
    display: flex;
    justifyContent: space-between;
    gap: 2%;
    align-items: center;
  }
`
export const ContactData = styled(HeaderElement)`
  flex-grow: 2;
  height: ${headerHeight}px;
  background: ${mainColor};
  color: ${white};
`

export const HeaderTitle = styled.h2`
  font-weight: ${bold};
  font-size: ${titleFontSize}px;
  text-align: end;
`

export const HeaderSubTitle = styled.p`
  text-align: end;
`
export const SpanElementWithMarginRight = styled.span`
  margin-right: ${marginSmallRight}px;
`

type AddressElementProps = {
    value: string,
    icon: string
}

export const AddressElement = ({value, icon}: AddressElementProps) => {
    return (
        <FlexContainer style={{padding: `${padInt}px`}}>
            <SpanElementWithMarginRight>
                <Icon type={icon}></Icon>
            </SpanElementWithMarginRight>
            <span>{value}</span>
        </FlexContainer>
    )
}

export const AddressLabelElement = ({title, value}) => {
    return (
        <FlexColumnBetweenContainer style={{padding: `${padInt}px`}}>
            <SpanElementWithMarginRight>
                <label><strong>{title}</strong></label>
            </SpanElementWithMarginRight>
            <p style={{margin: '0px'}}>{value}</p>
        </FlexColumnBetweenContainer>
    )
}

// Professional Profile
export const MainColorContainer = styled.div`
  background: ${mainColor};
  padding: ${padInt}px;
  margin-bottom: ${padInt}px;
`

export const SectionHeader = styled.h2`
  text-transform: uppercase;
  width: 30%;
  padding: ${padInt}px ${padInt}px 0 ${padInt}px
`
export const SectionParagraph = styled.p`
  width: 65%;
  padding: 0 ${padInt}px;
`

export const SectionTitleAndDescriptionComponent = ({title, description}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <SectionParagraph>{description}</SectionParagraph>
            </FlexBetweenContainer>
        </MainColorContainer>)
}

const FlexBetweenList = styled.ul`
  display: flex;
  justify-content: space-between;
  width: 65%;
  flex-wrap: wrap;
`

const ListElement = styled.li`
  width: 45%;
  margin-bottom: ${marginSmallRight}px;
`

export const SectionTitleAndFlexListComponent = ({title, list}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <FlexBetweenList>
                    {
                        list.map((elem: string) => {
                            return <ListElement key={elem}>{elem}</ListElement>
                        })
                    }
                </FlexBetweenList>
            </FlexBetweenContainer>
        </MainColorContainer>)
}

//Certificates

export const SectionTitleAndListComponent = ({title, list}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <ul style={{width: '65%'}}>
                    {
                        list.map((elem) => {
                            return (<li style={{marginBottom: '5px'}} key={elem}>
                                {elem}
                            </li>)
                        })
                    }
                </ul>
            </FlexBetweenContainer>
        </MainColorContainer>)
}

const NewChapterTitle = styled(HeaderTitle)`
  text-align: initial;
`

const WorkExperienceTextContainer = styled.div`
  width: 25%;
`

const WorkExperienceTitleSubtitle = ({title, subtitle}) => {
    return (
        <WorkExperienceTextContainer>
            <h3><strong>{title}</strong></h3>
            <p>{subtitle}</p>
        </WorkExperienceTextContainer>
    )
}

const WorkExperienceContainer = styled(MainColorContainer)`
  background: ${white};
  color: ${black};
  border-bottom: 2px solid lightgray;
  width: 90%;
  margin: 10px auto;
  padding-left: 0;

  &.mgBtn {
    margin-bottom: ${padInt}px;
  }
;

  &.pdLeft {
    padding-left: ${marginSmallRight}px;
  }

  &.bold {
    font-weight: 500;
  }
`

const HighlightedTitle = styled.h4`
  font-style: italic;
  font-weight: ${bold};
`

export const WorkExperienceSection = ({work}) => {

    const date = `${work.startDate} - ${work.endDate}`
    const {name, summary} = work;
    const summaryData = summary.split("\n\n");
    if (summaryData.length !== 3) {
        return '';
    }
    // console.log("data ", summaryData);
    let componentToRender;
    if (summaryData.length === 3) {
        const mainAchievementsList = summaryData[1].split("•");
        const mainAchievementsTitle = mainAchievementsList[0];
        const mainAchievementsFinalList = mainAchievementsList.slice(1, mainAchievementsList.length);
        const techStack = summaryData[2].split(":");
        componentToRender = (
            <div>
                <p className="mgBtn">{summaryData[0]}</p>
                <p className="mgBtn">{mainAchievementsTitle}</p>
                <ul className="pdLeft">
                    {
                        mainAchievementsFinalList.map(a => {
                            return <li key={a}>{a.trim()}</li>
                        })
                    }
                </ul>
                <p><strong className="bold">Tech-Stack:</strong>{techStack[1]}</p>
            </div>
        )
    }

    return (
        <WorkExperienceContainer>
            <FlexBetweenContainer>
                <WorkExperienceTitleSubtitle title={work.position} subtitle={date}></WorkExperienceTitleSubtitle>
                {/*todo: add component with width 25% and width 65% - or add class*/}
                <div style={{width: '65%'}}>
                    <HighlightedTitle className="mgBtn bold"><strong>{name}</strong></HighlightedTitle>
                    {/*<p className="mgBtn">Berater und Entwickler für Datenqualitäts-Management</p>*/}
                    {/*<p className="mgBtn">Einführung von DQM im NextGen Data Warehouse</p>*/}
                    {/*<ul className="pdLeft">*/}
                    {/*    <li>Erstellung der DQ-Leitlinien und DQ-Prüfungen</li>*/}
                    {/*    <li>Erstellung der DQ-Leitlinien und DQ-Prüfungen</li>*/}
                    {/*    <li>Erstellung der DQ-Leitlinien und DQ-Prüfungen</li>*/}
                    {/*</ul>*/}
                    {/*/!*todo: add class*!/*/}
                    {componentToRender}
                </div>
            </FlexBetweenContainer>
        </WorkExperienceContainer>
    )
}