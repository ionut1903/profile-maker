import React from 'react'
import {layout, font, colors} from "../TemplateCommonComponents";

export const LogoContainer = ({fullName, shortDescription, img}) => {
    return (
        <HeaderElement
            extraStyle={{
                width: "44%",
                color: colors.black,
                height: "180px",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
            <LogoImgContainer></LogoImgContainer>
            <div>
                <HeaderTitle extraStyle={{marginBottom: layout.marginSmallRight}}>{fullName}</HeaderTitle>
                <HeaderSubTitle extraStyle={{letterSpacing:'-1px'}}>
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
        <div style={{height: "32%"}}>
            <img style={{height: '100%'}}
                 src="https://mertus-consulting.com/wp-content/uploads/2021/06/logo_mertus.png"
                 alt="Mertus consulting logo"/>
        </div>
    )
}

export const HeaderTitle = ({extraStyle, children}) => {
    return (
        <h2 style={{
            margin: 0,
            fontWeight: font.bold,
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