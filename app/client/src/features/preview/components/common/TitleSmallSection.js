import React from "react";
import {font, layout} from "../TemplateCommonComponents";

export const TitleSmallSection = ({children}) => {
    return (
        <h4 style={{
            margin: `0 0 ${layout.padContainer} 0`,
            fontWeight: font.bold
        }}>{children}</h4>
    )
}