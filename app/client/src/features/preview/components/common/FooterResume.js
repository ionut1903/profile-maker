import React from "react";
import {FlexBetweenContainer} from "./TemplateFlexComponents";
import {colors, font} from "../TemplateCommonComponents";

const noMargin = {
    margin: 0,
    fontSize: '9px',
    lineHeight: 1
}

const footer = {
    margin: '0 auto',
    width: '88.5%',
    fontFamily: 'Open Sans'
}

type Props = {
    info: {
        contactName?: ?string,
        contactNumber1?: ?string,
        contactNumber2?: ?string,
        contactEmail?: ?string,
    }
}

export const FooterResume = ({ info = {} }: Props) => {
    return (
        <footer id="footer-resume" style={footer}>
            <FlexBetweenContainer>
                <div style={{width: '20%', display: 'flex', fontSize: '10px'}}>
                    <img style={{width: '100%', alignSelf: 'center'}}
                         src={"https://mertus-consulting.com/wp-content/uploads/2023/06/logo-1.png"}
                         alt="Mertus logo"/>
                </div>
                <FlexBetweenContainer extraStyle={{backgroundColor: colors.mainColor, padding: '10px 15px', width: '68%', color: "#ffffff"}}>
                    <div style={{width: '57%'}}>
                        {/*todo: create a list with all this data*/}
                        <p style={{fontSize: font.footerFontSize, ...noMargin}}>Mertus Consulting GmbH</p>
                        <p style={noMargin}>Simon-von-Utrecht-Str. 85A</p>
                        <p style={noMargin}>D-20359 Hamburg</p>
                        <p style={{paddingTop: '8px', ...noMargin}}>Vertraulicher Inhalt – keine unbefugte</p>
                        <p style={noMargin}>Weitergabe an Dritte.</p>
                        
                    </div>
                    <div style={{width: '47%'}}>
                        <p style={{fontSize: font.footerFontSize, ...noMargin}}>Ihr Ansprechpartner:</p>
                        <p style={{padding:'0 0 8px 0', ...noMargin}}>{info.contactName}</p>
                        <p style={noMargin}>{info.contactNumber1}</p>
                        <p style={noMargin}>{info.contactNumber2}</p>
                        <p style={noMargin}>{info.contactEmail}</p>
                        <p style={noMargin}>www.mertus-consulting.com</p>
                    </div>
                </FlexBetweenContainer>
            </FlexBetweenContainer>
        </footer>
    )
}

