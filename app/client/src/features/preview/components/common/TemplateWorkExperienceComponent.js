import React, { useEffect, useRef } from 'react'
import {colors, font, layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import { formatDateToMMYYYY } from '../../utils/date.util';

const WorkExperienceTextContainer = ({children}) => {
    return (
        <div style={{width: layout.sidebarWidth, wordBreak: 'break-word'}}>{children}</div>
    )
}

const WorkExperienceTitleSubtitle = ({title, subtitle}) => {
    return (
        <WorkExperienceTextContainer>
            <h3 style={{margin: 0, padding: `10px 0`}}>
                <strong style={{wordBreak: 'break-word'}}>{title}</strong>
            </h3>
            <p style={{margin: 0, padding: `${layout.marginSmallRight} 0`}}>{subtitle}</p>
        </WorkExperienceTextContainer>
    )
}

const WorkExperienceContainer = ({children}) => {
    return (
        <MainColorContainer extraStyle={{
            background: colors.white,
            pageBreakInside:"avoid",
            color: colors.black,
            borderBottom: '2px solid lightgray',
            width: '93%',
            margin: '0px auto',
            paddingLeft: '0'
        }}>{children}</MainColorContainer>
    )
}

const HighlightedTitle = ({children}) => {
    return (
        <h4 style={{fontWeight: font.bold, fontFamily: font.fontFamilyBold, padding: `${layout.padContainer} 0`, margin: 0}}>{children}</h4>
    )
}

export const WorkExperienceSection = ({work}) => {
    const ref = useRef(null)
    const startDate = work.startDate? formatDateToMMYYYY(work.startDate) : '';
    const endDate =  work.endDate? formatDateToMMYYYY(work.endDate) : '';
    const date = (startDate ? startDate: 'NO START DATE') +'-'+ (endDate? endDate:'NO END DATE');
    const {name, summary} = work;
    let summaryData = summary? summary : ['NO WORK SUMMARY DATA'];
    useEffect(() => {
        ref.current.innerHTML = summaryData
    }, [summaryData])
    return (
        <WorkExperienceContainer>
            <FlexBetweenContainer>
                <WorkExperienceTitleSubtitle title={work.position} subtitle={date}></WorkExperienceTitleSubtitle>
                <div style={{width: layout.articleWidth}}>
                    <HighlightedTitle><strong>{name}</strong></HighlightedTitle>
                     <div style={{margin: 0}} ref={ref}><br/></div>
                </div>
            </FlexBetweenContainer>
        </WorkExperienceContainer>
    )
}