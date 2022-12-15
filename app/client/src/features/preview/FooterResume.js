import React from "react";
import {FlexBetweenContainer} from "./components/common/TemplateFlexComponents";
import {colors, font} from "./components/TemplateCommonComponents";

const noMargin = {
    margin: 0,
    fontSize: '10px!important',
    lineHeight: 1
}

const footer = {
    margin: '0 auto',
    width: '88.5%',
}

export const FooterResume = () => {
    return (
        <footer style={footer}>
            <FlexBetweenContainer>
                <div style={{width: '20%', display: 'flex'}}>
                    <img style={{width: '100%', alignSelf: 'center'}}
                         src="https://mertus-consulting.com/wp-content/uploads/2021/06/logo_mertus.png"
                         alt="Mertus logo"/>
                </div>
                <FlexBetweenContainer extraStyle={{background: colors.mainColor, padding: '10px 15px', width: '67%'}}>
                    <div style={{width: '57%'}}>
                        {/*todo: create a list with all this data*/}
                        <p style={{fontSize: font.contentFontSize, ...noMargin}}>Mertus Consulting GmbH</p>
                        <p style={noMargin}>Simon-von-Utrecht-Str. 85A</p>
                        <p style={noMargin}>D-20359 Hamburg</p>
                        <p style={{paddingTop: '8px', ...noMargin}}>Vertraulicher Inhalt – keine unbefugte</p>
                        <p style={noMargin}>Weitergabe an Dritte.</p>
                        
                    </div>
                    <div style={{width: '47%'}}>
                        <p style={{fontSize: font.contentFontSize, ...noMargin}}>Ihr Ansprechpartner:</p>
                        <p style={{padding:'0 0 8px 0', ...noMargin}}>Herr Hans-Justus Daase</p>
                        <p style={noMargin}>+49 (0)173 43 91 430</p>
                        <p style={noMargin}>+49 (0)40 571 99 133</p>
                        <p style={noMargin}>justus.daase@mertus-consulting.com</p>
                        <p style={noMargin}>www.mertus-consulting.com</p>
                    </div>
                </FlexBetweenContainer>
            </FlexBetweenContainer>
        </footer>
    )
}