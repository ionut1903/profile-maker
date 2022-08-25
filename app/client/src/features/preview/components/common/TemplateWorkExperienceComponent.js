import React from 'react'
import {colors, font, layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";

export const TemplateWorkExperienceComponent = () => {

}

const WorkExperienceTextContainer = ({children}) => {
    return (
        <div style={{width: layout.sidebarWidth}}>{children}</div>
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
            color: colors.black,
            borderBottom: '2px solid lightgray',
            width: '90%',
            margin: '10px auto',
            paddingLeft: '0'
        }}>{children}</MainColorContainer>
    )
}


const HighlightedTitle = ({children}) => {
    return (
        <h4 style={{fontStyle: 'italic', fontWeight: font.bold}}>{children}</h4>
    )
}

export const WorkExperienceSection = ({work}) => {

    const date = `${work.startDate} - ${work.endDate}`
    const {name, summary} = work;
    const summaryData = summary.split("\n\n");
    if (summaryData.length !== 3) {
        return '';
    }
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
                <div style={{width: layout.articleWidth}}>
                    <HighlightedTitle><strong>{name}</strong></HighlightedTitle>
                    {componentToRender}
                </div>
            </FlexBetweenContainer>
        </WorkExperienceContainer>
    )
}