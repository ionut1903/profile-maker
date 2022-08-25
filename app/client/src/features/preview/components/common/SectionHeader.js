import React from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionHeader = ({children}) => {
    const pad = `${layout.padContainer} ${layout.padContainer} 0 ${layout.padContainer}`;
    return (
        <h2 style={{textTransform: 'uppercase', width: '30%', padding: pad}}>{children}</h2>
    )
}