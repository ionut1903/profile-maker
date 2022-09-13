import React from 'react';
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {ListElement} from "./ListComponent";
import {TitleSmallSection} from "./TitleSmallSection";
const marginBottomZero = {
    marginBottom: 0
}
export const AdditionalDataComponent = ({additionalData, children}) => {
    additionalData = additionalData? additionalData : [];
    // todo: see where it is set to undefined!!!
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{'Additional Data'}</SectionHeader>
                <div style={{width: layout.articleWidth, margin: '13px 0'}}>
                    {
                        additionalData.map((additional, i) => {
                            return <div key={i} style={{paddingLeft: '30px'}}>
                                <TitleSmallSection>{additional.name.toUpperCase()}</TitleSmallSection>
                                {
                                    additional.name === 'Tech skills' ?
                                        <ul style={{
                                            display: 'flex',
                                            flexWrap: "wrap",
                                            justifyContent: 'space-between',
                                            ...marginBottomZero
                                        }}>
                                            {
                                                additional.value.map((val) => {
                                                    return <ListElement extraStyle={{
                                                        paddingBottom: layout.marginSmallRight,
                                                        width: '40%',
                                                        wordWrap: 'break-word'
                                                    }}
                                                                        key={val}>{val}</ListElement>
                                                })
                                            }
                                        </ul>
                                        :
                                        <ul>
                                            {
                                                additional.value.map((val) => {
                                                    return <ListElement
                                                        extraStyle={{paddingBottom: layout.marginSmallRight}}
                                                        key={val}>{val}</ListElement>
                                                })
                                            }
                                        </ul>
                                }
                            </div>
                        })
                    }
                </div>
            </FlexBetweenContainer>
        </MainColorContainer>
    )
}