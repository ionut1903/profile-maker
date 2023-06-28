/**
 * @flow
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {Toolbar, LoadingBar} from '.'
import {sizes} from '../../../common/theme'
import type {State as ReduxState} from '../../../app/types'
import TemplateComponent from "./TemplateComponent";
import {generatePDF} from "../../../app/services/generatePdfService";
import {splitResumeToA4Pages} from "../downloadService";

const Wrapper = styled.div`
  width: 60%;
  position: relative;
  overflow-y: auto;
  padding-bottom: 25px;
  text-align: center;
  height: auto;

  @media screen and (max-width: 850px) {
    ${props => props.hideOnMobile && 'display: none;'} width: 100%;
    overflow: visible;
    margin-bottom: calc(${sizes.footer} + 25px);
  }
`

type Props = {
    resumeURL?: string,
    jsonURL?: string,
    status?: 'pending' | 'success' | 'failure',
    hideOnMobile?: boolean,
    downloadSource: () => Promise<void>
}

type State = {
    numPages: number,
    currPage: number,
    scale: number,
    isPrinting: boolean
}

const initialScale = (document.body: any).clientWidth > 1440 ? 1.75 : 1

class Preview extends Component<Props, State> {
    state = {
        numPages: 1,
        currPage: 1,
        scale: initialScale,
        isPrinting: false,
        pdfUrl: ''
    }

    print = (url: string) => {
        if (/Android/i.test(navigator.userAgent) || this.state.isPrinting) {
            return
        }

        const frame = document.createElement('iframe')

        frame.addEventListener('load', () => {
            const win = frame.contentWindow

            win.focus()
            win.print()
            win.addEventListener('focus', () =>
                (document.body: any).removeChild(frame)
            )
        })

        Object.assign(frame.style, {
            visibility: 'hidden',
            position: 'fixed',
            right: '0',
            bottom: '0'
        })

        frame.src = url;
        (document.body: any).appendChild(frame)
    }

    downloadPdfResume = async () => {
        const {json} = this.props

        const node = await document.querySelector("#componentToPrint");
        const pages = splitResumeToA4Pages(node);
        const htmls = pages.map((p, i) => {
            const html = document.implementation.createHTMLDocument(`resume_page_${i}`);
            html.head.innerHTML = `<link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;750" rel="stylesheet" type="text/css">`
            html.body.innerHTML = p 
            return `<html>${html.documentElement.innerHTML}</html>`
        })
        generatePDF(htmls, json.basics.name.toUpperCase());
    }

    render() {
        const {
            jsonURL,
            status,
            downloadSource,
            hideOnMobile,
            json
        } = this.props

        return (
            <Wrapper hideOnMobile={hideOnMobile}>
                {/* <button onClick={this.downloadPdfResume}>Download Pdf</button> */}
                <LoadingBar status={status}/>
                <Toolbar
                    
                    resumeURL={''}
                    jsonURL={jsonURL}
                    downloadSource={this.downloadPdfResume}
                    print={this.print}
                />
                <TemplateComponent json={json}></TemplateComponent>
            </Wrapper>
        )
    }
}

function mapState(state: ReduxState) {
    return {
        resumeURL: state.preview.resume.url,
        jsonURL: state.preview.data.url,
        page: state.preview.resume.page,
        status: state.preview.resume.status,
        json: state.preview.data.json
    }
}

const mapActions = {
}

export default connect(mapState, mapActions)(Preview)
