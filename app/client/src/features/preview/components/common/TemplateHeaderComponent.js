import React from 'react'
import {layout, font, colors} from "../TemplateCommonComponents";
import logo from "../../assets/logo.png"

export const LogoContainer = ({fullName, shortDescription, img}) => {
    return (
        <HeaderElement
            extraStyle={{
                width: "44%",
                color: colors.black,
                height: layout.headerHeight,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
            <LogoImgContainer></LogoImgContainer>
            <div>
                <HeaderTitle extraStyle={{marginBottom: layout.marginSmallRight}}>{fullName}</HeaderTitle>
                <HeaderSubTitle extraStyle={{letterSpacing: '-1px', textAlign: 'end'}}>
                    {shortDescription}
                </HeaderSubTitle>
            </div>
        </HeaderElement>
    )
}

export const HeaderElement = (props) => {
    const {extraStyle} = props
    return (
        <div style={{
            width: layout.sidebarWidth,
            height: '100%',
            maxHeight: '100%', ...extraStyle
        }}>{props.children}</div>
    )
}

const LogoImgContainer = () => {
    return (
        <div style={{height: "58px"}}>
            <img style={{height: '100%'}}
                 src={logo}
                 alt="Mertus consulting logo"/>
        </div>
    )
}

export const HeaderTitle = ({extraStyle, children}) => {
    return (
        <h2 style={{
            margin: 0,
            fontWeight: font.bold,
            fontFamily: font.fontFamilyBold,
            fontSize: font.titleFontSize,
            textAlign: 'end', ...extraStyle
        }}>{children}</h2>
    )
}

export const HeaderSubTitle = ({extraStyle, children}) => {
    return (
        <p style={{
            margin: 0,
            fontSize: font.subTitleFontSize,
            wordWrap: 'break-word',
            textAlign: 'justify',
            ...extraStyle
        }}>{children}</p>

    )
}