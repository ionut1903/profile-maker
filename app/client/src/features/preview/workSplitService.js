import {
    appendToPageIfComponentFitsAndReturnNewHeights,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

export const splitWorkComponents = (work, footer) => {
    const targetPageHeight = 28.9;
    const workPages = [];
    let currentPageHeight = 3.4;
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(work.children);

    let workEmptyContainer = getEmptyHtmlContainer(work);
    let heightLeftFromPage = targetPageHeight - currentPageHeight;
    for (let i = 1; i < pageElements.length; i++) {
        let currentPageHeightAndNextComp = currentPageHeight + listOfElemHeights[i];
        const [currentHeight, leftHeight] = appendWorkPageHeaderAndGetUpdatedPageHeight(i, workEmptyContainer, listOfElemHeights, pageElements, currentPageHeight, heightLeftFromPage)
        currentPageHeight = currentHeight;
        heightLeftFromPage = leftHeight;

        currentPageHeightAndNextComp = currentPageHeight + listOfElemHeights[i];
        if (listOfElemHeights[i] + currentPageHeight > targetPageHeight) {
            console.log(`work component from index: ${i} is bigger than the page`);
        }
        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageHeightAndNextComp,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            workEmptyContainer,
            pageElements[i]);

        currentPageHeight = changeHeights[0] ? changeHeights[0] : currentPageHeight;
        heightLeftFromPage = changeHeights[1] ? changeHeights[1] : heightLeftFromPage;

        // if no element left add footer to last page and break the loop
        if (!pageElements[i + 1]) {
            workEmptyContainer.appendChild(pageElements[i])
            workEmptyContainer.appendChild(footer);
            workPages.push(workEmptyContainer.cloneNode(true));
            break
        }

        //if there exists another element, and it does not enter into the current page
        // add footer to the current page and reset data to initial values and go again
        if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
            // add footer to the end of the page
            workEmptyContainer.appendChild(footer);
            workPages.push(workEmptyContainer.cloneNode(true));
            // reset to initial values
            workEmptyContainer = getEmptyHtmlContainer(work);
            currentPageHeight = 3.4;
            heightLeftFromPage = targetPageHeight - currentPageHeight
        }
    }
    return workPages;
}

const appendWorkPageHeaderAndGetUpdatedPageHeight = (index, workEmptyContainer, listOfElemHeights, pageElements, currentPageHeight, heightLeftFromPage) => {
    const targetPageHeight = 28.9;
    const workHeaderHeight = listOfElemHeights[0];
    const header = pageElements[0];
    // at first work history elem append header before the element
    if (index === 1) {
        workEmptyContainer.appendChild(header);
        currentPageHeight += workHeaderHeight;
        heightLeftFromPage = targetPageHeight - currentPageHeight;
    }
    return [currentPageHeight, heightLeftFromPage];
}
