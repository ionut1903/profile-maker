import {
    appendToPageIfComponentFitsAndReturnNewHeights,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

const targetPageHeight = 28.9;
const initialCurrentPageHeight = 3.4;

export const splitWorkComponents = (work, footer) => {
    const workPages = [];
    let currentPageHeight = initialCurrentPageHeight;
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
            const splitComponentParts = splitDescription(work.children[i]);
            // append new component to the page
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
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = targetPageHeight - currentPageHeight
        }
    }
    return workPages;
}

const appendWorkPageHeaderAndGetUpdatedPageHeight = (index, workEmptyContainer, listOfElemHeights, pageElements, currentPageHeight, heightLeftFromPage) => {
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

const splitDescription = (componentToSplit) => {
    const {
        descriptionCloneElements,
        descriptionElementsHeights
    } = destructureWorkComponentAndGetDOMEElements(componentToSplit);
    const pages = getDescriptionPages(descriptionCloneElements, descriptionElementsHeights);
    const workComponentsAndHeights = [];

    pages.forEach((page, i) => {
        workComponentsAndHeights.push(constructAndGetWorkComponentAndHeight(page, i, componentToSplit));
    });

    return workComponentsAndHeights;
}

const getDescriptionPages = (descriptionCloneElements, descriptionElementsHeights) => {
    let currentPageHeight = initialCurrentPageHeight;
    let nextPage = [];
    let pages = [];
    let nextPageElement = null;

    descriptionCloneElements.forEach((elem, i) => {
        if (nextPageElement) {
            nextPage.push(elem);
            currentPageHeight += descriptionElementsHeights[i];
            nextPageElement = null;
        }
        nextPage.push(elem);
        currentPageHeight += descriptionElementsHeights[i];
        if (currentPageHeight > targetPageHeight) {
            nextPageElement = nextPage.pop();
            currentPageHeight = currentPageHeight - descriptionElementsHeights[i]
            pages.push([nextPage, currentPageHeight]);
            currentPageHeight = initialCurrentPageHeight;
            nextPage = [];
        }
    });
    if (nextPage.length > 0) {
        pages.push([nextPage, currentPageHeight]);
    }
    return pages;
}

{/**
 constructs the html header component
 if is first page we add the original position and date
 if not first page we will add empty position header and date p
 */
}

const constructWorkPositionHeader = (isFirstPage, componentElements) => {
    if (isFirstPage) {
        componentElements.componentContentEmpty.appendChild(componentElements.workDateAndPositionContainer);
    } else {
        componentElements.workDateAndPositionContainerEmpty.appendChild(componentElements.positionTitleEmpty);
        componentElements.workDateAndPositionContainerEmpty.appendChild(componentElements.positionDateEmpty);
        componentElements.componentContentEmpty.appendChild(componentElements.workDateAndPositionContainerEmpty);
    }
    return false;
}

const constructDescription = (elements, {workDescriptionContainerEmpty}) => {
    elements.forEach((elem) => {
        workDescriptionContainerEmpty.appendChild(elem);
    });
}

const constructAndGetWorkComponentAndHeight = (page, index, componentToSplit) => {
    const workComponents = destructureWorkComponentAndGetDOMEElements(componentToSplit);
    if (index === 0) {
        constructWorkPositionHeader(true, workComponents);
    }
    constructWorkPositionHeader(false, workComponents);
    constructDescription(page[0], workComponents);

    workComponents.componentContentEmpty.appendChild(workComponents.workDescriptionContainerEmpty);
    workComponents.componentEmpty.appendChild(workComponents.componentContentEmpty);

    return [workComponents.componentEmpty, page[1]];
}

const destructureWorkComponentAndGetDOMEElements = (component) => {
    // the order of initialization matters!
    const componentHeight = component.offsetHeight;
    const componentContent = component.children[0];
    const workDateAndPositionContainer = componentContent.children[0].cloneNode(true);
    const positionTitleEmpty = getEmptyHtmlContainer(workDateAndPositionContainer.children[0]);
    const positionDateEmpty = getEmptyHtmlContainer(workDateAndPositionContainer.children[1]);
    const workDateAndPositionContainerEmpty = getEmptyHtmlContainer(workDateAndPositionContainer);
    const workDescriptionContainer = componentContent.children[1];
    const descriptionElements = workDescriptionContainer.children;
    const workDescriptionContainerEmpty = getEmptyHtmlContainer(workDescriptionContainer);
    const componentEmpty = getEmptyHtmlContainer(component);
    const componentContentEmpty = getEmptyHtmlContainer(componentContent);
    const [descriptionCloneElements, descriptionElementsHeights] = getHeightAndCloneOfElement(descriptionElements);

    return {
        componentContent,
        componentContentEmpty,
        componentEmpty,
        componentHeight,
        descriptionCloneElements,
        descriptionElementsHeights,
        positionTitleEmpty,
        positionDateEmpty,
        workDateAndPositionContainer,
        workDateAndPositionContainerEmpty,
        workDescriptionContainerEmpty
    }
}