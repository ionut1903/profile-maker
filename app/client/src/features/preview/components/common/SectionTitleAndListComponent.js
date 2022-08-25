import React from "react";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {ListElement} from "./ListComponent";

export const SectionTitleAndListComponent = ({title, list}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <ul style={{width: layout.articleWidth}}>
                    {
                        list.map((elem, i) => {
                            return (
                                <ListElement extraStyle={{marginBottom: layout.marginSmallRight}}
                                             key={elem}>{elem}</ListElement>
                            )
                        })
                    }
                </ul>
            </FlexBetweenContainer>
        </MainColorContainer>)
}