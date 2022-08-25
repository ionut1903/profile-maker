import React from "react";

export const ListComponent = ({extraStyles, children}) => {
    return (
        <ul style={extraStyles}>
            {children}
        </ul>
    )
}

export const ListElement = ({extraStyle, children}) => {
    return (
        <li style={extraStyle}>{children}</li>
    )
}