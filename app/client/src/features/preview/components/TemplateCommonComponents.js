import React from 'react'

export const colors = {
    white: '#fff',
    black: '#021C1E',
    mainColor: '#2C7873'
};

export const font = {
    fontFamily: 'Open Sans',
    fontFamilyBold: 'Open Sans Bold',
    contentFontSize: '10px',
    titleFontSize: '25px',
    subTitleFontSize: '18px',
    bold: 700,
    lineHeight: 1.2
};
export const layout = {
    headerHeight: '155px',
    padContainer: '8px',
    marginSmallRight: '5px',
    border: '1px solid lightgray',
    sidebarWidth: '25%',
    articleWidth: '72%',
    listPaddingLeft: '18px'
};

export const TemplateContainer = (props) => {
    return (
        <div style={{
            fontSize: font.contentFontSize,
            fontFamily: font.fontFamily,
            color: colors.white,
            height: 'auto',
            background: colors.white,
            lineHeight: font.lineHeight,
            letterSpacing: '1.2px',
            textAlign: 'initial',
            width: '90%',
            margin: '0 auto',
            padding: layout.padContainer
        }}>{props.children}</div>
    )
}

// Professional Profile
export const MainColorContainer = ({extraStyle, children}) => {
    return (
        <div style={{background: colors.mainColor, padding: layout.padContainer, marginBottom: layout.padContainer, ...extraStyle}}>{children}</div>
    )
}

