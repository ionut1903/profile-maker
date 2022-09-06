import React from 'react'
import {colors, font, layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";

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
            width: '93%',
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
    const startDate = work.startDate.split('-');
    const endDate = work.endDate.split('-');
    const date = `${startDate[1]}/${startDate[0]} - ${endDate[1]}/${endDate[0]}`
    const {name, summary} = work;
    let summaryData = summary.split('\n');

    return (
        <WorkExperienceContainer>
            <FlexBetweenContainer>
                <WorkExperienceTitleSubtitle title={work.position} subtitle={date}></WorkExperienceTitleSubtitle>
                <div style={{width: layout.articleWidth}}>
                    <HighlightedTitle><strong>{name}</strong></HighlightedTitle>
                    {summaryData.map((s, i) => {
                        if(!s) {
                            return <p key={i} style={{margin: 0, height: layout.marginSmallRight}}></p>
                        }
                        return <p key={i}>{s}<br/></p>
                    })}
                </div>
            </FlexBetweenContainer>
        </WorkExperienceContainer>
    )
}