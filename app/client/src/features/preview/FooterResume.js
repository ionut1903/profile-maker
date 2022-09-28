import React from "react";
import {FlexBetweenContainer} from "./components/common/TemplateFlexComponents";
import {colors, font} from "./components/TemplateCommonComponents";

const noMargin = {
    margin: 0
}

const footer = {
    margin: '0 auto',
    width: '88.5%'
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
                <FlexBetweenContainer extraStyle={{background: colors.mainColor, padding: '10px 5px', width: '80%'}}>
                    <div style={{width: '48%'}}>
                        {/*todo: create a list with all this data*/}
                        <h5 style={{fontSize: font.contentFontSize, ...noMargin}}>Mertus Consulting UG (haftungsbeschränkt)</h5>
                        <p style={noMargin}>Neumühlen 42</p>
                        <p style={noMargin}>D - 22763 Hamburg</p>
                        <p style={{padding: '8px 0', ...noMargin}}>www.mertus-consulting.com</p>
                        <p style={noMargin}>Vertraulicher Inhalt – keine unbefugte Weitergabe an Dritte.</p>
                    </div>
                    <div style={{width: '48%'}}>
                        <h5 style={{fontSize: font.contentFontSize, ...noMargin}}>Ihr Ansprechpartner:</h5>
                        <p style={{padding:'0 0 8px 0', ...noMargin}}>Herr Hans-Justus Daase</p>
                        <p style={noMargin}>+49 (0)173 43 91 430</p>
                        <p style={noMargin}>+49 (0)40 571 99 133</p>
                        <p style={noMargin}>justus.daase@mertus-consulting.com</p>
                    </div>
                </FlexBetweenContainer>
            </FlexBetweenContainer>
        </footer>
    )
}