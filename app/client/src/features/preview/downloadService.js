import {
    appendToPageIfComponentFitsAndReturnNewHeights,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement, isFooterLastElementToBeAdded
} from "./splitTemplateUtils";
import {splitAdditionalData} from "./additionalDataSplitService";
import {splitWorkComponents} from "./workSplitService";

export const splitResumeToA4Pages = (htmlElem) => {
    const targetPageHeight = 28.9;
    const templateContainer = htmlElem.children[0];
    const work = templateContainer.children[5];
    const additionalData = templateContainer.children[3];
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(templateContainer.children);
    const footer = pageElements[6];
    setFooterStyle(footer);
    let pagesToPrint = [];

    let newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
    let newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
    const initialCurrentPageHeight = 3.4;
    let currentPageHeight = initialCurrentPageHeight;
    let heightLeftFromPage = targetPageHeight - currentPageHeight;
    let workHistoryPages = [];

    let componentOnSecondPage = null;
    let secondComponentHeight = 0;

    for (let i = 0; i < pageElements.length - 1; i++) {
        if (componentOnSecondPage) {
            // add secondPage
            newHtmlTemplateContainer.appendChild(componentOnSecondPage);
            componentOnSecondPage = null;
            currentPageHeight = currentPageHeight + secondComponentHeight;
            heightLeftFromPage = targetPageHeight - currentPageHeight;
            continue;
        }

        if (listOfElemHeights[i] + currentPageHeight > targetPageHeight && i === 5) {
            workHistoryPages = splitWorkComponents(work, footer)
        }

        const currentPageHeightWithNextComp = currentPageHeight + listOfElemHeights[i];

        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageHeightWithNextComp,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            newHtmlTemplateContainer,
            pageElements[i]);

        currentPageHeight = changeHeights[0] ? changeHeights[0] : currentPageHeight;
        heightLeftFromPage = changeHeights[1] ? changeHeights[1] : heightLeftFromPage;

        // if no element left add footer to last page and break the loop
        const isElementLeft = isFooterLastElementToBeAdded(pageElements[i + 1], newHtmlTemplateContainer, newHtmlTemplate, footer)
        if (isElementLeft) break;

        //if there exists another element, and it does not enter into the current page
        // add footer to the current page and reset data to initial values and go again
        if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
            // split additional data into 2 parts
            if (i + 1 === 3 && heightLeftFromPage < listOfElemHeights[i + 1]) {
                const [firstPageAdditionalData, secondPageAdditionalData, secondCompHeight] = splitAdditionalData(additionalData, heightLeftFromPage);
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
            newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
            newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = targetPageHeight - currentPageHeight
        }
    }
    if (newHtmlTemplateContainer.children.length > 0) {
        pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
    }

    for (let elem of workHistoryPages) {
        const newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
        const newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
        newHtmlTemplateContainer.appendChild(elem);
        newHtmlTemplate.appendChild(newHtmlTemplateContainer);
        pagesToPrint.push(newHtmlTemplate.innerHTML);
    }

    return pagesToPrint;
}

// to display footer always on the bottom of the page
const setFooterStyle = (footer) => {
    footer.style.position = 'fixed'
    footer.style.bottom = 0;
}