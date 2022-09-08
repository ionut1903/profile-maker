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

    getEmptyHtmlContainer = (htmlElem) => {
        let htmlElemClone = htmlElem.cloneNode(true)
        while (htmlElemClone.hasChildNodes()) {
            htmlElemClone.removeChild(htmlElemClone.lastChild);
        }
        return htmlElemClone;
    }

    splitWorkComponents = (work, footer) => {
        const targetPageHeight = 29.7;
        const workPages = [];
        let currentPageHeight = 4;
        const totalWorkPageHeight = this.getDimensionInMM(work.offsetHeight) + currentPageHeight;
        let [pageElements, listOfElemHeights] = this.getHeightAndCloneOfElement(work.children);
        const header = pageElements[0];
        const workHeaderHeight = listOfElemHeights[0];

        if (totalWorkPageHeight < targetPageHeight) {
            workPages.push(work);
            return workPages;
        }
        let workEmptyContainer = this.getEmptyHtmlContainer(work);
        let heightLeftFromPage = targetPageHeight - currentPageHeight;

        for (let i = 1; i < pageElements.length; i++) {
            let currentPageHeightAndNextComp = currentPageHeight + listOfElemHeights[i];
            if (i === 1) {
                workEmptyContainer.appendChild(header);
                currentPageHeight += workHeaderHeight;
                heightLeftFromPage = targetPageHeight - currentPageHeight;
            }

            if (listOfElemHeights[i] + currentPageHeight > targetPageHeight) {
                console.log(`work component from index: ${i} is bigger than the page`);
            }

            currentPageHeightAndNextComp = currentPageHeight + listOfElemHeights[i];

            if (currentPageHeightAndNextComp < targetPageHeight && heightLeftFromPage > listOfElemHeights[i]) {
                workEmptyContainer.appendChild(pageElements[i]);
                currentPageHeight = currentPageHeightAndNextComp;
                heightLeftFromPage = targetPageHeight - currentPageHeight;
            }

            // if no element left add footer to last page and break the loop
            if (!pageElements[i + 1]) {
                workEmptyContainer.appendChild(footer);
                workPages.push(workEmptyContainer);
                // workPages.push(currentPageHeight);
                break;
            }

            //if there exists another element and it does not enters into the current page
            // add footer to the current page and reset data to initial values and go again
            if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
                // add footer to the end of the page
                workEmptyContainer.appendChild(footer);
                workPages.push(workEmptyContainer.cloneNode(true));
                // reset to initial values
                workEmptyContainer = this.getEmptyHtmlContainer(work);
                currentPageHeight = 4;
                heightLeftFromPage = targetPageHeight - currentPageHeight
                continue;
            }
        }
        return workPages;
    }

    getHeightAndCloneOfElement = (elements) => {
        const pageElements = [];
        let listOfElemHeights = []
        for (let elem of elements) {
            pageElements.push(elem.cloneNode(true));
            listOfElemHeights.push(this.getDimensionInMM(elem.offsetHeight));
        }
        return [pageElements, listOfElemHeights];
    }

    setFooterStyle = (footer) => {
        footer.style.position = 'fixed'
        footer.style.bottom = 0;
    }

    splitResumeToA4Pages = (htmlElem) =>
    {
        const targetPageHeight = 29.7;
        const templateContainer = htmlElem.children[0];
        const work = templateContainer.children[5];
        let [pageElements, listOfElemHeights] = this.getHeightAndCloneOfElement(templateContainer.children);

        const footer = pageElements[6];
        this.setFooterStyle(footer);
        let pagesToPrint = [];

        let newHtmlTemplate = this.getEmptyHtmlContainer(htmlElem);
        let newHtmlTemplateContainer = this.getEmptyHtmlContainer(templateContainer);
        let currentPageHeight = 4;
        let heightLeftFromPage = targetPageHeight - currentPageHeight;
        const pageHeights = [];
        let workHistoryPages = [];
        for (let i = 0; i < pageElements.length - 1; i++) {
            if (listOfElemHeights[i] + currentPageHeight > targetPageHeight) {
                console.log(`component from index: ${i} needs to be split`);
                if (i === 5) {
                    //    work history
                    workHistoryPages = this.splitWorkComponents(work, footer)
                }
            }

            const currentPageHeightAndNextComp = currentPageHeight + listOfElemHeights[i];

            if (currentPageHeightAndNextComp < targetPageHeight && heightLeftFromPage > listOfElemHeights[i]) {
                newHtmlTemplateContainer.appendChild(pageElements[i]);
                currentPageHeight = currentPageHeightAndNextComp;
                heightLeftFromPage = targetPageHeight - currentPageHeight;
            }

            // if no element left add footer to last page and break the loop
            if (!pageElements[i + 1]) {
                newHtmlTemplateContainer.appendChild(footer);
                newHtmlTemplate.appendChild(newHtmlTemplateContainer);
                pageHeights.push(currentPageHeight);
                break;
            }

            //if there exists another element and it does not enters into the current page
            // add footer to the current page and reset data to initial values and go again
            if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
                // add footer to the end of the page
                newHtmlTemplateContainer.appendChild(footer);
                newHtmlTemplate.appendChild(newHtmlTemplateContainer);
                pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
                pageHeights.push(currentPageHeight);
                // reset to initial values
                newHtmlTemplate = this.getEmptyHtmlContainer(htmlElem);
                newHtmlTemplateContainer = this.getEmptyHtmlContainer(templateContainer);
                currentPageHeight = 3.5;
                heightLeftFromPage = targetPageHeight - currentPageHeight
                continue;
            }
        }
        if (newHtmlTemplateContainer.children.length > 0) {
            pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
        }

        for(let elem of workHistoryPages) {
            const newHtmlTemplate = this.getEmptyHtmlContainer(htmlElem);
            const newHtmlTemplateContainer = this.getEmptyHtmlContainer(templateContainer);
            newHtmlTemplateContainer.appendChild(elem);
            newHtmlTemplate.appendChild(newHtmlTemplateContainer);
            pagesToPrint.push(newHtmlTemplate.innerHTML);
        }

        return pagesToPrint;
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
