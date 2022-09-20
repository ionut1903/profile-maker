import React from "react";
import {font, layout} from "../TemplateCommonComponents";

export const TitleSmallSection = ({children}) => {
    return (
        <h4 style={{
            margin: 0,
            fontWeight: font.bold,
            fontFamily: font.fontFamilyBold,
            padding: `${layout.padContainer} 0`
        }}>{children}</h4>
    )
}