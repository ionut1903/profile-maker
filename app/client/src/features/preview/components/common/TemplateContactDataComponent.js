import React from 'react'
import {
    colors,
    layout
} from "../TemplateCommonComponents";
import {HeaderElement} from "./TemplateHeaderComponent";
import {Icon} from "../../../../common/components";
import {FlexColumnBetweenContainer, FlexContainer} from "./TemplateFlexComponents";

export const TemplateContactDataComponent = ({fullAddress, dateOfBirth, languages}) => {
    return (
        <HeaderElement extraStyle={{
            background: colors.mainColor,
            color: colors.white,
            width: "30%",
            wordWrap: 'break-word',
            padding: layout.padContainer,
            height: 'auto'
        }}>
            <div>
                <AddressLabelElement title='Address: ' value={fullAddress}/>
                <AddressLabelElement title='Year of birth: ' value={dateOfBirth}/>
            </div>
            <div>
                <LanguageElements title='Languages' values={languages}></LanguageElements>
            </div>
        </HeaderElement>
    )
}

export const SpanElementWithMarginRight = ({extraStyle, children}) => {
    return (
        <span style={{marginRight: layout.marginSmallRight, ...extraStyle}}>{children}</span>
    )
}

export const AddressElement = ({value, icon}) => {
    return (
        <FlexContainer extraStyle={{marginBottom: layout.padContainer}}>
            <SpanElementWithMarginRight>
                <Icon type={icon}></Icon>
            </SpanElementWithMarginRight>
            <span style={{wordBreak:'break-word'}}>{value}</span>
        </FlexContainer>
    )
}

export const AddressLabelElement = ({title, value}) => {
    return (
        <FlexColumnBetweenContainer extraStyle={{marginBottom: layout.padContainer}}>
            <SpanElementWithMarginRight extraStyle={{marginBottom: layout.marginSmallRight}}>
                <label><strong>{title}</strong></label>
            </SpanElementWithMarginRight>
            <p style={{margin: '0px',wordBreak: 'break-word'}}>{value}</p>
        </FlexColumnBetweenContainer>
    )
}

export const LanguageElements = ({title, values}) => {
    return (
        <FlexColumnBetweenContainer extraStyle={{marginBottom: layout.padContainer}}>
            <SpanElementWithMarginRight extraStyle={{marginBottom: layout.marginSmallRight}}>
                <label><strong>{title}</strong></label>
            </SpanElementWithMarginRight>
            {
                values.map((val)=>{
                    return <p key={val} style={{margin: '0px',wordBreak: 'break-word'}}>{val}</p>
                })
            }
        </FlexColumnBetweenContainer>
    )
}