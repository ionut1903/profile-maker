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

    getAdditionalDataHtml = (additionalData, listOfElements, isFirstPage) => {
        // the order of initialization matters!!
        let additionalDataHtml = additionalData.cloneNode(true);
        const additionalDataHeader = additionalDataHtml.children[0].children[0].children[0];
        const additionalDataListsContainer = additionalData.children[0].children[0].children[1].cloneNode(true);

        const additionalDataListsContainerEmpty = this.getEmptyHtmlContainer(additionalDataListsContainer);

        const languageListContainer = additionalDataListsContainer.children[0];
        const techSkillTitle = additionalDataListsContainer.children[1].children[0];
        const ulEmpty = this.getEmptyHtmlContainer(additionalDataListsContainer.children[1].children[1]);
        const techSkillEmptyListContainer = this.getEmptyHtmlContainer(additionalDataListsContainer.children[1]);

        const additionalDataEmpty = this.getEmptyHtmlContainer(additionalDataHtml.children[0].children[0]);

        if (isFirstPage) {
            techSkillEmptyListContainer.appendChild(techSkillTitle);
            additionalDataListsContainerEmpty.appendChild(languageListContainer);
            additionalDataEmpty.appendChild(additionalDataHeader);
        } else {
            additionalDataEmpty.appendChild(document.createElement('h2'));
        }

        for (let elem of listOfElements) {
            ulEmpty.appendChild(elem.cloneNode(true));
        }

        techSkillEmptyListContainer.appendChild(ulEmpty);
        additionalDataListsContainerEmpty.appendChild(techSkillEmptyListContainer);
        additionalDataEmpty.appendChild(additionalDataListsContainerEmpty);

        const additionalDataContentEmpty = this.getEmptyHtmlContainer(additionalDataHtml.children[0].children[0]);
        const additionalDataContainerEmpty = this.getEmptyHtmlContainer(additionalDataHtml.children[0]);
        additionalDataContentEmpty.appendChild(additionalDataEmpty);
        additionalDataContainerEmpty.appendChild(additionalDataContentEmpty);

        return additionalDataContainerEmpty;
    }

    splitAdditionalData(additionalData, remainingPageHeight) {
        let additionalDataHeight = this.getDimensionInMM(additionalData.offsetHeight);
        // take heights of the list elements
        const listElements = additionalData.children[0].children[0].children[1].children[1].children[1].children;
        const [liElements, listOfElemHeights] = this.getHeightAndCloneOfElement(listElements)
        //create clone of the html containers
        const cloneOfAdditionalData = additionalData.cloneNode(true);

        const elementsToAddToNextPage = [];
        let index = liElements.length - 1;
        let isOddNumberOfElem = false;
        let secondComponentHeight = additionalDataHeight;
        while (remainingPageHeight < additionalDataHeight) {
            if (liElements.length % 2 === 0 || isOddNumberOfElem) {
                //    take 2 elements at a time from the end of the array
                elementsToAddToNextPage.push(liElements[index].cloneNode(true));
                index--;
                elementsToAddToNextPage.push(liElements[index].cloneNode(true));
                index--;
                additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
            } else {
                // take one element at a time from
                isOddNumberOfElem = true;
                elementsToAddToNextPage.push(listElements[index].cloneNode(true));
                index--;
                additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
            }
        }
        secondComponentHeight = secondComponentHeight - additionalDataHeight;
        const elementsToAddToCurrentPage = [];

        for (let i = 0; i <= index; i++) {
            elementsToAddToCurrentPage.push(listElements[i]);
        }

        const firstPageAdditionalData = this.getAdditionalDataHtml(cloneOfAdditionalData, elementsToAddToCurrentPage, true);
        const secondPageAdditionalData = this.getAdditionalDataHtml(additionalData.cloneNode(true), elementsToAddToNextPage);
        // set each part to html and return
        return [firstPageAdditionalData, secondPageAdditionalData, secondComponentHeight];
    }

    splitResumeToA4Pages = (htmlElem) => {
        const targetPageHeight = 28.9;
        const templateContainer = htmlElem.children[0];
        const work = templateContainer.children[5];
        const additionalData = templateContainer.children[3];
        let [pageElements, listOfElemHeights] = this.getHeightAndCloneOfElement(templateContainer.children);

        const footer = pageElements[6];
        this.setFooterStyle(footer);
        let pagesToPrint = [];

        let newHtmlTemplate = this.getEmptyHtmlContainer(htmlElem);
        let newHtmlTemplateContainer = this.getEmptyHtmlContainer(templateContainer);
        const initialCurrentPageHeight = 3.4;
        let currentPageHeight = initialCurrentPageHeight;
        let heightLeftFromPage = targetPageHeight - currentPageHeight;
        let workHistoryPages = [];
        let componentOnSecondPage = null;
        let secondComponentHeight = 0;

        for (let i = 0; i < pageElements.length - 1; i++) {
            if(componentOnSecondPage) {
                // add secondPage
                newHtmlTemplateContainer.appendChild(componentOnSecondPage);
                componentOnSecondPage = null;
                currentPageHeight = currentPageHeight + secondComponentHeight;
                heightLeftFromPage = targetPageHeight - currentPageHeight;
                continue;
            }

            if (listOfElemHeights[i] + currentPageHeight > targetPageHeight) {
                console.log(`component from index: ${i} needs to be split`);
                if (i === 5) {
                    workHistoryPages = this.splitWorkComponents(work, footer)
                }
            }

            const currentPageHeightWithNextComp = currentPageHeight + listOfElemHeights[i];

            if (currentPageHeightWithNextComp < targetPageHeight && heightLeftFromPage > listOfElemHeights[i]) {
                newHtmlTemplateContainer.appendChild(pageElements[i]);
                currentPageHeight = currentPageHeightWithNextComp;
                heightLeftFromPage = targetPageHeight - currentPageHeight;
            }

            // if no element left add footer to last page and break the loop
            if (!pageElements[i + 1]) {
                newHtmlTemplateContainer.appendChild(footer);
                newHtmlTemplate.appendChild(newHtmlTemplateContainer);
                break;
            }

            //if there exists another element and it does not enters into the current page
            // add footer to the current page and reset data to initial values and go again
            if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
                // split additional data into 2 parts
                if (i + 1 === 3 && heightLeftFromPage < listOfElemHeights[i+1]) {
                    const [firstPageAdditionalData, secondPageAdditionalData, secondCompHeight] = this.splitAdditionalData(additionalData, heightLeftFromPage);
                    newHtmlTemplateContainer.appendChild(firstPageAdditionalData);
                    componentOnSecondPage = secondPageAdditionalData;
                    secondComponentHeight = secondCompHeight;
                    currentPageHeight += heightLeftFromPage;
                }

                // add footer to the end of the page
                newHtmlTemplateContainer.appendChild(footer);
                newHtmlTemplate.appendChild(newHtmlTemplateContainer);
                pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
                // reset to initial values
                newHtmlTemplate = this.getEmptyHtmlContainer(htmlElem);
                newHtmlTemplateContainer = this.getEmptyHtmlContainer(templateContainer);
                currentPageHeight = initialCurrentPageHeight;
                heightLeftFromPage = targetPageHeight - currentPageHeight
                continue;
            }
        }
        if (newHtmlTemplateContainer.children.length > 0) {
            pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
        }

        for (let elem of workHistoryPages) {
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
        const pdfURL = generatePDF(pages);
        this.setState({
            pdfURL: pdfURL
        })
        // todo return and url to download
    }

    render() {
        const {pdfUrl} = this.state;
        const {
            jsonURL,
            status,
            downloadSource,
            hideOnMobile,
            json
        } = this.props

        return (
            <Wrapper hideOnMobile={hideOnMobile}>
                <button onClick={this.downloadPdfResume}>Download Pdf</button>
                <LoadingBar status={status}/>
                <Toolbar
                    resumeURL={pdfUrl}
                    jsonURL={jsonURL}
                    downloadSource={downloadSource}
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
    downloadSource
}

export default connect(mapState, mapActions)(Preview)
