/**
 * @flow
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {Toolbar, LoadingBar} from '.'
import {downloadSource} from '../actions'
import {Loader} from '../../../common/components'
import {sizes} from '../../../common/theme'
import type {State as ReduxState} from '../../../app/types'
import TemplateComponent from "./TemplateComponent";
import {generatePDF} from "../../../app/services/generatePdfService";

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
        isPrinting: false
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

    getDimensionInMM = (dimensionInPX) => {
        return dimensionInPX * 2.54 / 96;
    }

    getEmptyHtmlPageContainers = (htmlElem, templateContainer) => {
        let newHtmlTemplate = htmlElem.cloneNode(true);
        newHtmlTemplate.removeChild(newHtmlTemplate.children[0])
        //create an empty page container
        let newHtmlTemplateContainer = templateContainer.cloneNode(true)
        while (newHtmlTemplateContainer.hasChildNodes()) {
            newHtmlTemplateContainer.removeChild(newHtmlTemplateContainer.lastChild);
        }

        return [newHtmlTemplate, newHtmlTemplateContainer];
    }
    splitResumeToA4Pages = (htmlElem) => {
        const targetPageHeight = 29.7;
        const templateContainer = htmlElem.children[0];
        const pageElements = [];
        let listOfElemHeights = []

        for (let elem of templateContainer.children) {
            pageElements.push(elem.cloneNode(true));
            listOfElemHeights.push(this.getDimensionInMM(elem.offsetHeight));
        }

        const footer = pageElements[6];
        const footerHeight = listOfElemHeights[6];
        footer.style.position = 'fixed'
        footer.style.bottom = 0;
        const pageList = [];
        let childIndexToAppend = 0;

        while (childIndexToAppend < 7) {
            let currentPageHeight = 0;
            let futurePageHeight = 0;
            let [newHtmlTemplate, newHtmlTemplateContainer] = this.getEmptyHtmlPageContainers(htmlElem, templateContainer);

            while (currentPageHeight < targetPageHeight) {
                //create an empty container to add pages
                // futurePageHeight += listOfElemHeights[childIndexToAppend];
                // if(futurePageHeight > targetPageHeight) {
                //     // logic to split the component in multiple parts and add footer at the end
                //     // - at the end reset the height;
                //
                //     break;
                // }

                if(childIndexToAppend > 6) {
                    // todo : refactor after display resume correctly
                    break;
                }

                // if(pageElements[childIndexToAppend] > targe){}

                newHtmlTemplateContainer.appendChild(pageElements[childIndexToAppend]);
                currentPageHeight += listOfElemHeights[childIndexToAppend];
                const currentHeightToFooter = Math.ceil(targetPageHeight - currentPageHeight);

                if (currentHeightToFooter < 0) {
                    newHtmlTemplateContainer.removeChild(newHtmlTemplateContainer.lastChild);
                    currentPageHeight = 100;
                    // todo: remove after testing! - index 3 > height got to index 4
                    newHtmlTemplateContainer.appendChild(footer);
                    childIndexToAppend++;
                    break;
                }

                if (currentHeightToFooter > 0 && currentHeightToFooter < 2) {
                    newHtmlTemplateContainer.appendChild(footer);
                    currentPageHeight = 100;
                }

                childIndexToAppend++;
            }
            newHtmlTemplate.appendChild(newHtmlTemplateContainer);
            pageList.push(newHtmlTemplate.cloneNode(true).innerHTML);
        }
        return pageList;
    }

    downloadPdfResume = async () => {
        const node = await document.querySelector("#componentToPrint");
        const pages = this.splitResumeToA4Pages(node);
        generatePDF(pages);
    }

    render() {
        const {
            resumeURL,
            jsonURL,
            status,
            downloadSource,
            hideOnMobile,
            json
        } = this.props
        const {currPage} = this.state

        return (
            <Wrapper hideOnMobile={hideOnMobile}>
                <button onClick={this.downloadPdfResume}>Download Pdf</button>
                <LoadingBar status={status}/>
                <Toolbar
                    resumeURL={resumeURL}
                    jsonURL={jsonURL}
                    downloadSource={downloadSource}
                    // currPage={currPage}
                    // prevPage={this.prevPage}
                    // nextPage={this.nextPage}
                    print={this.print}
                    // zoomIn={this.zoomIn}
                    // zoomOut={this.zoomOut}
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
    downloadSource
}

export default connect(mapState, mapActions)(Preview)
