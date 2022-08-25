import React from "react";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {SectionParagraph} from "./SectionParagraph";
import {MainColorContainer} from "../TemplateCommonComponents";

export const SectionTitleAndDescriptionComponent = ({title, description}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <SectionParagraph>{description}</SectionParagraph>
            </FlexBetweenContainer>
        </MainColorContainer>)
}
