import {
    appendToPageIfComponentFitsAndReturnNewHeights,
    getDimensionInMM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

export const splitWorkComponents = (work, footer) => {
    const targetPageHeight = 29.7;
    const workPages = [];
    let currentPageHeight = 4;
    const totalWorkPageHeight = getDimensionInMM(work.offsetHeight) + currentPageHeight;
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(work.children);
    const header = pageElements[0];
    const workHeaderHeight = listOfElemHeights[0];

    if (totalWorkPageHeight < targetPageHeight) {
        workPages.push(work);
        return workPages;
    }
    let workEmptyContainer = getEmptyHtmlContainer(work);
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

        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageHeightAndNextComp,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            workEmptyContainer,
            pageElements[i]);

        currentPageHeight = changeHeights[0]? changeHeights[0] : currentPageHeight;
        heightLeftFromPage = changeHeights[1]? changeHeights[1] : heightLeftFromPage;

        // if no element left add footer to last page and break the loop
        const isElementLeft = isFooterLastElementToBeAdded(pageElements[i + 1], workEmptyContainer, workPages, footer);
        if (isElementLeft) break;

        //if there exists another element, and it does not enter into the current page
        // add footer to the current page and reset data to initial values and go again
        if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
            // add footer to the end of the page
            workEmptyContainer.appendChild(footer);
            workPages.push(workEmptyContainer.cloneNode(true));
            // reset to initial values
            workEmptyContainer = getEmptyHtmlContainer(work);
            currentPageHeight = 4;
            heightLeftFromPage = targetPageHeight - currentPageHeight
        }
    }
    return workPages;
}

export const isFooterLastElementToBeAdded = (elem, content, container, footer) => {
    if (!elem) {
        content.appendChild(footer);
        return true;
    }
    return false;
}