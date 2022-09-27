import React from 'react';
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {ListElement} from "./ListComponent";

const marginBottomZero = {
    marginBottom: 0
}
export const AdditionalDataComponent = ({allSkills, children}) => {
    allSkills = allSkills ? allSkills : [];
    // todo: see where it is set to undefined!!!
    return (
        <MainColorContainer extraStyle={{padding: '0 8px'}}>
            <FlexBetweenContainer>
                <SectionHeader>{'Skills'}</SectionHeader>
                <div style={{width: layout.articleWidth, margin: '13px 0'}}>
                    {
                        <div style={{paddingLeft: '19px'}}>
                            <ul style={{
                                display: 'flex',
                                flexWrap: "wrap",
                                paddingLeft: '11px',
                                justifyContent: 'space-between',
                                ...marginBottomZero
                            }}>
                                {
                                    allSkills.map((val) => {
                                        return <ListElement extraStyle={{
                                            paddingBottom: layout.marginSmallRight,
                                            width: '40%',
                                            wordWrap: 'break-word'
                                        }} key={val}>
                                            {val}
                                        </ListElement>
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>
            </FlexBetweenContainer>
        </MainColorContainer>
    )
}