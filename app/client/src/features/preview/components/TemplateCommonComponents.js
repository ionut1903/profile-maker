import React from 'react'
import {Icon} from "../../../common/components";

export const colors = {
    white: '#fff',
    black: '#021C1E',
    mainColor: '#2C7873'
};

export const font = {
    contentFontSize: '13px',
    titleFontSize: '25px',
    subTitleFontSize: '18px',
    bold: 700,
    lineHeight: 1.1
};
export const layout = {
    headerHeight: '200px',
    padContainer: '10px',
    marginSmallRight: '5px',
    padInt: '1.5%',
    border: '1px solid lightgray',
    sidebarWidth: '25%',
    articleWidth: '67%',
};
//colors
const black = '#021C1E';
const mainColor = '#2C7873';

// fonts
const bold = 500;

//layout
const headerHeight = '200px';
const marginSmallRight = '5px';
const padInt = '1.5%';
const border = '1px solid lightgray';
const sidebarWidth = '25%';
const articleWidth = '67%';
//Flex components

export const TemplateContainer = (props) => {
    return (
        <div style={{
            fontSize: font.contentFontSize,
            fontFamily: 'Roboto',
            color: colors.white,
            height: 'auto',
            background: colors.white,
            lineHeight: font.lineHeight,
            letterSpacing: '1px',
            textAlign: 'initial',
            width: '90%',
            margin: '0 auto',
            padding: layout.padContainer
        }}>{props.children}</div>
    )
}

export const FlexBetweenContainer = (props) => {
    const {extraStyle} = props;
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1.5%',
            ...extraStyle
        }}>
            {props.children}
        </div>
    )
}

export const FlexColumnBetweenContainer = ({extraStyle, children}) => {
    return (
        <FlexBetweenContainer extraStyle={{flexDirection: 'column', ...extraStyle}}>{children}</FlexBetweenContainer>
    )
}

export const FlexContainer = ({extraStyle, children}) => {
    return (
        <div style={{display: 'flex', ...extraStyle}}>{children}</div>
    )
}

export const FlexCenterVerticalAndHorizontal = (props) => {
    return (
        <FlexBetweenContainer extraStyle={{alignItems: 'center'}}>{props.children}</FlexBetweenContainer>
    )
}

// Professional Profile
export const MainColorContainer = ({extraStyle, children}) => {
    return (
        <div style={{background: mainColor, padding: padInt, marginBottom: padInt, ...extraStyle}}>{children}</div>
    )
}

export const SectionHeader = ({children}) => {
    const pad = `${padInt} ${padInt} 0 ${padInt}`;
    return (
        <h2 style={{textTransform: 'uppercase', width: '30%', padding: pad}}>{children}</h2>
    )
}

export const SectionParagraph = ({children}) => {
    const pad = `0 ${padInt}`;
    return (
        <p style={{width: articleWidth, padding: pad}}>{children}</p>
    )
}


export const SectionTitleAndDescriptionComponent = ({title, description}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <SectionParagraph>{description}</SectionParagraph>
            </FlexBetweenContainer>
        </MainColorContainer>)
}

const FlexBetweenList = ({children}) => {
    return (
        <ul style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: articleWidth,
            flexWrap: 'wrap'
        }}>{children}</ul>
    )
}

const ListElement = ({children}) => {
    return (
        <li style={{width: '45%', marginBottom: layout.marginSmallRight}}>{children}</li>
    )
}

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
                <ul style={{width: '67%'}}>
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


const WorkExperienceTextContainer = ({children}) => {
    return (
        <div style={{width: sidebarWidth}}>{children}</div>
    )
}

const WorkExperienceTitleSubtitle = ({title, subtitle}) => {
    return (
        <WorkExperienceTextContainer>
            <h3><strong>{title}</strong></h3>
            <p>{subtitle}</p>
        </WorkExperienceTextContainer>
    )
}

const WorkExperienceContainer = ({children}) => {
    return (
        <MainColorContainer extraStyle={{
            background: colors.white,
            color: black,
            borderBottom: '2px solid lightgray',
            width: '90%',
            margin: '10px auto',
            paddingLeft: '0'
        }}>{children}</MainColorContainer>
    )
}

// &.mgBtn {
//   margin-bottom: ${padInt}px;
// }
//
// &.pdLeft {
//   padding-left: ${marginSmallRight}px;
// }
//
// &.bold {
//   font-weight: 500;
// }

const HighlightedTitle = ({children}) => {
    return (
        <h4 style={{fontStyle: 'italic', fontWeight: bold}}>{children}</h4>
    )
}

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
                <div style={{width: '67%'}}>
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