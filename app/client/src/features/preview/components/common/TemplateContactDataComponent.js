import React from 'react'
import {
    colors,
    layout
} from "../TemplateCommonComponents";
import {HeaderElement} from "./TemplateHeaderComponent";
import {Icon} from "../../../../common/components";
import {FlexColumnBetweenContainer, FlexContainer} from "./TemplateFlexComponents";

export const TemplateContactDataComponent = ({phoneNumber, email, fullAddress, dateOfBirth}) => {
    return (
        <HeaderElement extraStyle={{
            background: colors.mainColor,
            color: colors.white,
            width: "30%",
            wordWrap: 'break-word',
            padding: layout.padContainer,
            height: 'auto'
        }}>
            {/*<div style={{*/}
            {/*    borderBottom: layout.border,*/}
            {/*    marginBottom: layout.marginSmallRight,*/}
            {/*// }}>*/}
                {/*<AddressElement value={phoneNumber} icon="phone"/>*/}
                {/*<AddressElement value={email} icon="email"/>*/}
            {/*</div>*/}
            <div>
                <AddressLabelElement title='Address: ' value={fullAddress}/>
                <AddressLabelElement title='Year of birth: ' value={dateOfBirth}/>
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