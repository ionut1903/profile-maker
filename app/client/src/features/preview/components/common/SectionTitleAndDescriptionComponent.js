import React from "react";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {SectionParagraph} from "./SectionParagraph";
import {MainColorContainer} from "../TemplateCommonComponents";

export const SectionTitleAndDescriptionComponent = ({title, description}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader extraStyles={{paddingTop: '0'}}>{title}</SectionHeader>
                <SectionParagraph extraStyle={{paddingTop: '4px', marginLeft:'-5px'}}>{description}</SectionParagraph>
            </FlexBetweenContainer>
        </MainColorContainer>)
}
