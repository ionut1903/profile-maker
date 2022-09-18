import {
    appendToPageIfComponentFitsAndReturnNewHeights, getDimensionInMM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

let targetPageHeight = 28.9;
const initialTargetPageHeight = 28.9;
const initialCurrentPageHeight = 3.4;

export const splitWorkComponents = (work, footer) => {
    const workPages = [];
    let currentPageHeight = initialCurrentPageHeight;
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(work.children);
    let workEmptyContainer = getEmptyHtmlContainer(work);
    let heightLeftFromPage = targetPageHeight - currentPageHeight;
    const [currentHeight, leftHeight] = appendWorkPageHeaderAndGetUpdatedPageHeight(workEmptyContainer, listOfElemHeights[0], pageElements[0], currentPageHeight, heightLeftFromPage);
    currentPageHeight = currentHeight;
    heightLeftFromPage = leftHeight;

    for (let i = 1; i < pageElements.length; i++) {
        let currentPageWithNextCompHeight = currentPageHeight + listOfElemHeights[i];
        debugger;

        // adds component that fits the page
        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageWithNextCompHeight,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            workEmptyContainer,
            pageElements[i]);

        // if we added a component we go to the next one!
        if (changeHeights[0]) {
            debugger;
            currentPageHeight = changeHeights[0];
            heightLeftFromPage = changeHeights[1];
            continue;
        }

        // if current component does not fit the remaining height from page
        if (listOfElemHeights[i] > heightLeftFromPage) {
            const headerHeight = getPositionHeaderHeight(work.children[i]);
            // if the header of the work component fits the page we add the split component to
            if (headerHeight < heightLeftFromPage) {
                debugger
                console.log('Header less than height left => split component from page for index is: ', i);

                // split component by remaining height
                // and add comp to current page
                // add next components to pageElements!
                continue;
            }
            i--;
            console.log('Reset index to: ', i);

            // we will decrease the index with one? and continue
            // reset values
            // if component header > heightLeftFromPage we create a new page and reset the values component will be moved one index further
            // or, we will decrease the index with one?


            // workEmptyContainer.appendChild(footer);
            // workPages.push(workEmptyContainer.cloneNode(true));
            // // reset to initial values
            // workEmptyContainer = getEmptyHtmlContainer(work);
            // currentPageHeight = initialCurrentPageHeight;
            // heightLeftFromPage = targetPageHeight - currentPageHeight
            console.log('Split component that is bigger than the page on index: ', i);
        }

    }
    return workPages;
}

// if (work.children[i]) {
//             //     console.log(`work component from index: ${i} is bigger than the page`);
//             //
//             //     const splitComponentAndHeights = splitDescriptionAndGetComponents(work.children[i], heightLeftFromPage);
//             //     const {
//             //         newPageElements,
//             //         newListOfElemHeights
//             //     } = addSplitComponentToCurrentWorkComponentList(pageElements, listOfElemHeights, i, splitComponentAndHeights);
//             //
//             //     pageElements = newPageElements;
//             //     console.log('New pageElements length: ', newPageElements.length);
//             //     console.log('New pageElements: ', newPageElements);
//             //     listOfElemHeights = newListOfElemHeights;
//             //     currentPageHeightAndNextComp = listOfElemHeights[i];
//             // } else {
//             //     console.log('Work component on index is undefined - why? : ', i);
//             // }

const addSplitComponentToCurrentWorkComponentList = (pageElements, listOfElemHeights, index, splitComponents) => {
    let parsedComponents = pageElements.slice(0, index);
    const componentsThatNeedToBeParsed = pageElements.slice(index + 1, pageElements.length);
    let parsedHeights = listOfElemHeights.slice(0, index);
    const heightsThatNeedToBeAdded = listOfElemHeights.slice(index + 1, listOfElemHeights.length);
    parsedComponents = parsedComponents.concat(splitComponents[0]);
    parsedComponents = parsedComponents.concat(componentsThatNeedToBeParsed);
    parsedHeights = parsedHeights.concat(splitComponents[1]);
    parsedHeights = parsedHeights.concat(heightsThatNeedToBeAdded);
    return {newPageElements: parsedComponents, newListOfElemHeights: parsedHeights};
}

const appendWorkPageHeaderAndGetUpdatedPageHeight = (workEmptyContainer, workHeaderHeight, header, currentPageHeight, heightLeftFromPage) => {
    workEmptyContainer.appendChild(header);
    currentPageHeight += workHeaderHeight;
    heightLeftFromPage = targetPageHeight - currentPageHeight;
    return [currentPageHeight, heightLeftFromPage];
}

{/**
 gets work description elements split in multiple pages
 */
}
const splitDescriptionAndGetComponents = (componentToSplit, heightLeftOnPage) => {
    const destructuredWorkComponents = destructureWorkComponentAndGetDOMEElements(componentToSplit);

    const pages = getDescriptionPages(destructuredWorkComponents, heightLeftOnPage);
    const workComponents = [];
    const componentHeights = [];

    pages.forEach((page, i) => {
        const splitComponent = constructAndGetWorkComponentAndHeight(page, i, componentToSplit);
        workComponents.push(splitComponent[0]);
        componentHeights.push(splitComponent[1])
    });
    return [workComponents, componentHeights];
}


{/**
 gets work description elements split in multiple pages
 */
}
const getDescriptionPages = ({
                                 descriptionCloneElements,
                                 descriptionElementsHeights,
                                 workDateAndPositionContainerHeight
                             },
                             heightLeftOnPage) => {

    let currentPageHeight = initialCurrentPageHeight;
    let nextPage = [];
    let pages = [];
    let nextPageElement = null;
    if (workDateAndPositionContainerHeight < heightLeftOnPage) {
        targetPageHeight = heightLeftOnPage;
    }

    descriptionCloneElements.forEach((elem, i) => {
        if (nextPageElement) {
            nextPage.push(nextPageElement);
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
            targetPageHeight = initialTargetPageHeight;
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
        componentElements.componentContentEmpty = getEmptyHtmlContainer(componentElements.componentContentEmpty)
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
    } else {
        constructWorkPositionHeader(false, workComponents);
    }

    constructDescription(page[0], workComponents);

    workComponents.componentContentEmpty.appendChild(workComponents.workDescriptionContainerEmpty);
    workComponents.componentEmpty.appendChild(workComponents.componentContentEmpty);

    return [workComponents.componentEmpty, page[1]];
}

const destructureWorkComponentAndGetDOMEElements = (component) => {
    // the order of initialization matters!
    const componentHeight = getDimensionInMM(component.offsetHeight);
    debugger;
    const componentContent = component.children[0]
    const positionHeaderHeight = componentContent.children[0].children[0].offsetHeight;
    const dateHeaderHeight = componentContent.children[0].children[1].offsetHeight;
    const workDateAndPositionContainerHeight = getDimensionInMM(positionHeaderHeight + dateHeaderHeight);
    const workDateAndPositionContainer = componentContent.children[0].cloneNode(true);
    const positionTitleEmpty = getEmptyHtmlContainer(workDateAndPositionContainer.children[0]);
    const positionDateEmpty = getEmptyHtmlContainer(workDateAndPositionContainer.children[1]);
    const workDateAndPositionContainerEmpty = getEmptyHtmlContainer(workDateAndPositionContainer);
    const workDescriptionContainer = componentContent.children[1];
    const descriptionElements = workDescriptionContainer.children;
    const workDescriptionContainerEmpty = getEmptyHtmlContainer(workDescriptionContainer);
    const componentEmpty = getEmptyHtmlContainer(component);
    const componentEmptyWithNoBorderBottom = getEmptyHtmlContainer(component);
    componentEmptyWithNoBorderBottom.style.borderBottom = 'none';
    const componentContentEmpty = getEmptyHtmlContainer(componentContent);
    const [descriptionCloneElements, descriptionElementsHeights] = getHeightAndCloneOfElement(descriptionElements);

    return {
        componentContent,
        componentContentEmpty,
        componentEmpty,
        componentEmptyWithNoBorderBottom,
        componentHeight,
        descriptionCloneElements,
        descriptionElementsHeights,
        positionTitleEmpty,
        positionDateEmpty,
        workDateAndPositionContainer,
        workDateAndPositionContainerEmpty,
        workDateAndPositionContainerHeight,
        workDescriptionContainerEmpty
    }
}


{/**
 @defaultWorkDateAndPositionContainerHeight - default value in mm for 2 rows of data
 gets the position header height
 */
}
const getPositionHeaderHeight = (component) => {
    let defaultWorkDateAndPositionContainerHeight = 1.5;
    const componentContent = component.children[0]
    let positionHeaderHeight = componentContent.children[0].children[0].offsetHeight;
    const dateHeaderHeight = componentContent.children[0].children[1].offsetHeight;
    let workDateAndPositionContainerHeight = getDimensionInMM(positionHeaderHeight + dateHeaderHeight);
    if (defaultWorkDateAndPositionContainerHeight > workDateAndPositionContainerHeight) {
        workDateAndPositionContainerHeight = defaultWorkDateAndPositionContainerHeight;
    }
    return workDateAndPositionContainerHeight;
}