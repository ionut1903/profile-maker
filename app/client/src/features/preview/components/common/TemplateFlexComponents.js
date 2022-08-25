import React from 'react'

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