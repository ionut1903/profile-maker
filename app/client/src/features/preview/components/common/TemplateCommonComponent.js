import React from 'react'

const white = '#fff';
const black = '#021C1E';
const mainColor = '#2C7873';

// fonts
const contentFontSize = '13px';
const titleFontSize = '30px';
const subTitleFontSize = '25px';
const bold = 500;
const lineHeight = 1.1;

//layout
const headerHeight = '200px';
const padContainer = '10px'
const marginSmallRight = '5px';
const padInt = '1.5%';
const border = '1px solid lightgray';
const sidebarWidth = '25%';
const articleWidth = '65%';

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

export const FlexColumnBetweenContainer = (props) => {
    return (
        <FlexBetweenContainer extraStyle={{flexDirection: 'column'}}>{props.children}</FlexBetweenContainer>
    )
}

export const FlexContainer = (props) => {
    return (
        <div style={{display: 'flex'}}>{props.children}</div>
    )
}