import React from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionParagraph = ({children}) => {
    return (
        <p style={{width: layout.profileWidth, paddingTop: layout.padContainer}}>{children}</p>
    )
}
