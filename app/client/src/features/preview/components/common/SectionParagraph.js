import React, { useEffect, useRef } from "react";
import {layout} from "../TemplateCommonComponents";

export const SectionParagraph = ({children, extraStyle}) => {
    const ref = useRef(null)
    useEffect(() => {
        ref.current.innerHTML = children
    }, [children])
    return (
        <div style={{width: layout.profileWidth, paddingTop: layout.padContainer, ...extraStyle}}><div ref={ref}></div></div>
    )
}
