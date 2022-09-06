import React from "react";
import {FlexBetweenContainer} from "./components/common/TemplateFlexComponents";
import {colors} from "./components/TemplateCommonComponents";
const noMargin = {
    margin: 0
}
export const FooterResume = () => {
    return (
        <footer>
            <FlexBetweenContainer>
                <div>
                    <img src="https://mertus-consulting.com/wp-content/uploads/2021/06/logo_mertus.png"
                         alt="Mertus logo"/>
                </div>
                <FlexBetweenContainer extraStyle={{background: colors.mainColor, padding: '10px'}}>
                    <div style={{width: '45%'}}>
                        {/*todo: create a list with all this data*/}
                        <h5 style={noMargin}>Mertus Consulting UG</h5>
                        <p style={noMargin}>Mertus Consulting UG</p>
                        <p style={noMargin}>Neumühlen 42, D-22763 Hamburg</p>
                        <p style={noMargin}>www.mertus-consulting.com</p>
                    </div>
                    <div style={{width: '45%'}}>
                        <h5 style={noMargin}>Ihr Ansprechpartner:</h5>
                        <p style={noMargin}>Herr Hans-Justus Daase</p>
                        <p style={noMargin}>Tel.: +49 (0)40 571 99 133</p>
                        <p style={noMargin}>Mob.: +49 (0)173 43 91 430</p>
                        <p style={noMargin}>E-Mail: justus.daase@mertus-consulting.com</p>
                    </div>
                </FlexBetweenContainer>
                </FlexBetweenContainer>
        </footer>
    )
}