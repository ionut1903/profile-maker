import React from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionParagraph = ({children}) => {
    const pad = `0 ${layout.padContainer}`;
    return (
        <p style={{width: layout.articleWidth, padding: pad}}>{children}</p>
    )
}
