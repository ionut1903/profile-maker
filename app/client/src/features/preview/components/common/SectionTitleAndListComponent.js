import React from "react";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {ListElement} from "./ListComponent";

export const SectionTitleAndListComponent = ({title, list}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader extraStyles={{paddingTop: '3px', paddingBottom: '3px'}}>{title}</SectionHeader>
                
                <ul style={{width: layout.articleWidth, paddingLeft: layout.listPaddingLeft, paddingTop: '7px', paddingBottom: '3px'}}>
                    {
                        list?
                        list.map((elem, i) => {
                            return (
                                <ListElement extraStyle={{marginBottom: layout.marginSmallRight}}
                                             key={elem+i}>{elem}</ListElement>
                            )
                        }) : null
                    }
                </ul>
            </FlexBetweenContainer>
        </MainColorContainer>)
}