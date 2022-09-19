import {
    appendToPageIfComponentFitsAndReturnNewHeights, getDimensionInMM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

const initialTargetPageHeight = 28.9;
let targetPageHeight = initialTargetPageHeight;
const initialCurrentPageHeight = 3.4;
const initialHeightLeftFromPage = initialTargetPageHeight - initialCurrentPageHeight;

export const splitWorkComponents = (work, footer) => {
    let workPages = [];
    let currentPageHeight = initialCurrentPageHeight;
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(work.children);
    let workEmptyContainer = getEmptyHtmlContainer(work);
    const [currentHeight, leftHeight] = appendWorkPageHeaderAndGetUpdatedPageHeight(workEmptyContainer, listOfElemHeights[0], pageElements[0], currentPageHeight, initialHeightLeftFromPage);
    currentPageHeight = currentHeight;
    let heightLeftFromPage = leftHeight;
    let workSplitComponents, componentSplitHeights = null;

    for (let i = 1; i < pageElements.length; i++) {
        let currentPageWithNextCompHeight = currentPageHeight + listOfElemHeights[i];
        // adds component that fits the page
        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageWithNextCompHeight,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            workEmptyContainer,
            pageElements[i]);

        // if we added a component we go to the next one!
        if (changeHeights[0]) {
            console.log('Component fits and we add it to the page ', i);
            currentPageHeight = changeHeights[0];
            heightLeftFromPage = changeHeights[1];
            continue;
        }

        // if current component does not fit the remaining height from page
        if (listOfElemHeights[i] > heightLeftFromPage) {
            const headerHeight = getPositionHeaderHeight(work.children[i]);
            // if the header of the work component fits the page we add the split component to
            if (headerHeight < heightLeftFromPage) {
                console.log('Header less than height left => split component from page for index is: ', i);
                [workSplitComponents, componentSplitHeights] = splitDescriptionAndGetComponents(work.children[i], heightLeftFromPage);
                workEmptyContainer.appendChild(workSplitComponents[0]);
                workSplitComponents.shift();
                componentSplitHeights.shift();
            } else {
                i--;
                console.log('Header bigger than height left => decrease index and reset values: ', i);
            }
            debugger
            // close current page and reset to initial values
            workEmptyContainer.appendChild(footer);
            workPages.push(workEmptyContainer.cloneNode(true));
            console.log('Create work page with number: ', workPages.length);
            targetPageHeight = initialTargetPageHeight;
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = initialHeightLeftFromPage;
            workEmptyContainer = getEmptyHtmlContainer(work);
        }

        if (workSplitComponents) {
            const splitPages = getAndCreatePagesFromSplitComponent(workSplitComponents, componentSplitHeights, footer, workEmptyContainer);
            workPages = workPages.concat(splitPages);
            currentPageHeight = initialCurrentPageHeight + componentSplitHeights[componentSplitHeights.length - 1];
            heightLeftFromPage = targetPageHeight - currentPageHeight;
            workSplitComponents = null;
            componentSplitHeights = null;

            if (i === pageElements.length - 1) {
                return workPages;
            }
        }
    }

    if (workEmptyContainer.children.length > 0) {
        workEmptyContainer.appendChild(footer);
        workPages.push(workEmptyContainer.cloneNode(true));
    }
    console.log('Create work page with number: ', workPages.length);
    return workPages;
}

const getAndCreatePagesFromSplitComponent = (components, componentHeights, footer, container) => {
    const pages = [];
    components.forEach((comp) => {
        container.appendChild(comp);
        container.appendChild(footer);
        pages.push(container);
        container = getEmptyHtmlContainer(container);
    });

    return pages;
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
                             },
                             heightLeftOnPage) => {

    let currentPageHeight = initialCurrentPageHeight;
    let nextPage = [];
    let pages = [];
    let nextPageElement = null;
    let targetPageHeight = heightLeftOnPage;

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

const constructAndGetWorkComponentAndHeight = (pageAndHeight, index, componentToSplit) => {
    const workComponents = destructureWorkComponentAndGetDOMEElements(componentToSplit);
    const page = pageAndHeight[0];
    const height = pageAndHeight[1];
    if (index === 0) {
        constructWorkPositionHeader(true, workComponents);
        workComponents.componentEmpty.style.borderBottom = 'none';
    } else {
        constructWorkPositionHeader(false, workComponents);
    }

    constructDescription(page, workComponents);
    workComponents.componentContentEmpty.appendChild(workComponents.workDescriptionContainerEmpty);
    workComponents.componentEmpty.appendChild(workComponents.componentContentEmpty);

    return [workComponents.componentEmpty, height];
}

const destructureWorkComponentAndGetDOMEElements = (component) => {
    // the order of initialization matters!
    const componentHeight = getDimensionInMM(component.offsetHeight);
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