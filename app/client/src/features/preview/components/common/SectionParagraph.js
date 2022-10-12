import React from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionParagraph = ({children}) => {
    return (
        <p style={{width: layout.profileWidth}}>{children}</p>
    )
}
