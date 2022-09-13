import {
    appendToPageIfComponentFitsAndReturnNewHeights, getDimensionInMM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement, isFooterLastElementToBeAdded
} from "./splitTemplateUtils";
import {splitAdditionalData} from "./additionalDataSplitService";
import {splitWorkComponents} from "./workSplitService";

export const splitResumeToA4Pages = (htmlElem) => {
    const pdfPadding = getDimensionInMM(20);
    const targetPageHeight = 28.9 - pdfPadding;
    const templateContainer = htmlElem.children[0];
    let pagesToPrint = [];
    let workIndex = 5;
    const work = templateContainer.children[workIndex];
    const additionalDataIndex = 3;
    const additionalData = templateContainer.children[additionalDataIndex];

    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(templateContainer.children);
    const footer = pageElements.pop();
    setFooterStyle(footer);
    // todo refactor to remove all references of components!


    let newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
    let newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
    const initialCurrentPageHeight = 3.4;
    let currentPageHeight = initialCurrentPageHeight;
    let heightLeftFromPage = targetPageHeight - currentPageHeight;
    let workHistoryPages = [];
    let isAdditionalComponentSplit = false;
    let isWorkSplit = false;

    for (let i = 0; i < pageElements.length; i++) {
        if (i === additionalDataIndex && isAdditionalComponentSplit) {
            continue;
        }

        if (isWorkSplit) {
            continue;
        }

        if (listOfElemHeights[i] + currentPageHeight > targetPageHeight && i === workIndex) {
            workHistoryPages = splitWorkComponents(work, footer);
            isWorkSplit = true;
        }

        const currentPageHeightWithNextComp = currentPageHeight + listOfElemHeights[i];

        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(
            currentPageHeightWithNextComp,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            newHtmlTemplateContainer,
            pageElements[i]);

        currentPageHeight = changeHeights[0] ? changeHeights[0] : currentPageHeight;
        heightLeftFromPage = changeHeights[1] ? changeHeights[1] : heightLeftFromPage;

        //if there exists another element, and it does not enter into the current page
        // add footer to the current page and reset data to initial values and go again
        if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
            // split additional data into multiple parts
            let nextAdditionalDataPagesAndHeights = null
            if (i + 1 === additionalDataIndex && heightLeftFromPage < listOfElemHeights[i + 1]) {
                const {
                    firstPageAdditionalData,
                    additionalDataPagesAndHeights,
                } = splitAdditionalData(additionalData, heightLeftFromPage, targetPageHeight - initialCurrentPageHeight);

                newHtmlTemplateContainer.appendChild(firstPageAdditionalData);
                currentPageHeight += heightLeftFromPage;
                isAdditionalComponentSplit = true;
                nextAdditionalDataPagesAndHeights = additionalDataPagesAndHeights && additionalDataPagesAndHeights.length > 0 ? additionalDataPagesAndHeights : [];
            }

            // add footer to the end of the page
            newHtmlTemplateContainer.appendChild(footer);
            newHtmlTemplate.appendChild(newHtmlTemplateContainer);
            pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
            // reset to initial values
            newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
            newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = targetPageHeight - currentPageHeight

            if (nextAdditionalDataPagesAndHeights && nextAdditionalDataPagesAndHeights.length > 0) {
                // // add next elements to be parsed to pageElements list
                const [newElemsList, newElemHeights] = setNewElementsToPageElements(additionalDataIndex, nextAdditionalDataPagesAndHeights, listOfElemHeights, pageElements);
                pageElements = newElemsList;
                listOfElemHeights = newElemHeights;
                workIndex += nextAdditionalDataPagesAndHeights.length;
                console.log('Work index moved to: ', workIndex);
            }
        }
    }

    if (newHtmlTemplateContainer.children.length > 0) {
        pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
    }

    const workPages = getWorkHistoryPages(workHistoryPages, htmlElem, templateContainer);
    pagesToPrint = pagesToPrint.concat(workPages);
    return pagesToPrint;
}

const getWorkHistoryPages = (workHistoryPages, htmlElem, templateContainer) => {
    const pagesToPrint = [];
    console.log('Work pages to print: ', workHistoryPages.length);
    for (let elem of workHistoryPages) {
        const newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
        const newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
        newHtmlTemplateContainer.appendChild(elem);
        newHtmlTemplate.appendChild(newHtmlTemplateContainer);
        pagesToPrint.push(newHtmlTemplate.innerHTML);
    }
    return pagesToPrint;
}

const setNewElementsToPageElements = (index, additionalComponents, listOfElemHeights, pageElements) => {
    if (additionalComponents && additionalComponents.length === 0) {
        return [pageElements, listOfElemHeights];
    }

    const nextIndex = index + 1;
    let currentParsedElements = [];
    let elementsThatNeedToBeParsed = [];
    let elementsHeightsThatNeedToBeParsed = [];
    let currentParsedElementHeights = [];
    currentParsedElements = pageElements.slice(0, nextIndex);
    currentParsedElementHeights = listOfElemHeights.slice(0, nextIndex);
    elementsThatNeedToBeParsed = pageElements.slice(nextIndex);
    elementsHeightsThatNeedToBeParsed = listOfElemHeights.slice(nextIndex);

    additionalComponents.forEach(elem => {
        currentParsedElements.push(elem[0]);
        currentParsedElementHeights.push(elem[1]);
    });

    pageElements = currentParsedElements.concat(elementsThatNeedToBeParsed);
    listOfElemHeights = currentParsedElementHeights.concat(elementsHeightsThatNeedToBeParsed);
    return [pageElements, listOfElemHeights];
}

// to display footer always on the bottom of the page
const setFooterStyle = (footer) => {
    footer.style.position = 'fixed'
    footer.style.bottom = 0;
}