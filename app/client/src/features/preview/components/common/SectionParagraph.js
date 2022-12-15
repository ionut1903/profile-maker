import React from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionParagraph = ({children, extraStyle}) => {
    return (
        <p style={{width: layout.profileWidth, paddingTop: layout.padContainer, ...extraStyle}}>{children}</p>
    )
}
