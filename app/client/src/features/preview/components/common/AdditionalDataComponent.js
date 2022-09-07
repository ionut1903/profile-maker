import React from 'react';
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {SectionHeader} from "./SectionHeader";
import {ListElement} from "./ListComponent";
import {TitleSmallSection} from "./TitleSmallSection";

export const AdditionalDataComponent = ({additionalData, children}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{'Additional Data'}</SectionHeader>
                <div style={{width: layout.articleWidth}}>
                    {
                        additionalData.map((additional) => {
                            return <div style={{paddingLeft: '30px'}}>
                                <TitleSmallSection>{additional.name.toUpperCase()}</TitleSmallSection>
                                {
                                    additional.name === 'Tech skills' ?
                                        <ul style={{
                                            display: 'flex',
                                            flexWrap: "wrap",
                                            justifyContent: 'space-between'
                                        }}>
                                            {
                                                additional.value.map((val) => {
                                                    return <ListElement extraStyle={{
                                                        marginBottom: layout.marginSmallRight,
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
                                                        extraStyle={{marginBottom: layout.marginSmallRight}}
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