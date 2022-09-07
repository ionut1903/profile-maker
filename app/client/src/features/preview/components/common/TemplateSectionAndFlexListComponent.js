import React from 'react'
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {layout, MainColorContainer} from "../TemplateCommonComponents";
import {SectionHeader} from "./SectionHeader";
import {ListComponent, ListElement} from "./ListComponent";

export const SectionTitleAndFlexListComponent = ({title, list}) => {
    return (
        <MainColorContainer>
            <FlexBetweenContainer>
                <SectionHeader>{title}</SectionHeader>
                <ListComponent extraStyles={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: layout.articleWidth,
                    flexWrap: 'wrap',
                }}>
                    {
                        list.map((elem: string) => {
                            return <ListElement extraStyle={{width: '45%', marginBottom: layout.marginSmallRight}}
                                                key={elem}>{elem}</ListElement>
                        })
                    }
                </ListComponent>
            </FlexBetweenContainer>
        </MainColorContainer>)
}