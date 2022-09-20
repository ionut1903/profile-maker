import {
    appendToPageIfComponentFitsAndReturnNewHeights, getDimensionInCM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement
} from "./splitTemplateUtils";

//A4 page = 29.7cm, and we have a 0.529166 padding top and bottom in the pdf
// 29.171 A4 page content without padding
const initialTargetPageHeight = 29;
let targetPageHeight = initialTargetPageHeight;
const initialCurrentPageHeight = 3.4;
const initialHeightLeftFromPage = initialTargetPageHeight - initialCurrentPageHeight;


export const splitWorkComponents = (work, footer) => {
    let workPages = [];
    let currentPageHeight = initialCurrentPageHeight;
    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(work.children);
    let workEmptyContainer = getEmptyHtmlContainer(work);
    console.log(`Current page height is before loop: `, currentPageHeight);

    const [currentHeight, leftHeight] = appendWorkPageHeaderAndGetUpdatedPageHeight(workEmptyContainer, listOfElemHeights[0], pageElements[0], currentPageHeight, initialHeightLeftFromPage);
    currentPageHeight = currentHeight;
    console.log(`Current page height after adding the header is: `, currentPageHeight);
    let heightLeftFromPage = leftHeight;
    let workSplitComponents, componentSplitHeights = null;

    for (let i = 1; i < pageElements.length; i++) {
        let currentPageWithNextCompHeight = currentPageHeight + listOfElemHeights[i];
        console.log(`Current page height is: `, currentPageHeight);
        console.log(`Component height is: `, listOfElemHeights[i]);
        // adds component that fits the page
        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(currentPageWithNextCompHeight,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            workEmptyContainer,
            pageElements[i]);

        // if we added a component we go to the next one!
        if (changeHeights[0]) {
            console.log(`Add component from index ${i} to page number ${workPages.length ? workPages.length : workPages.length + 1}`);
            currentPageHeight = changeHeights[0];
            heightLeftFromPage = changeHeights[1];
            continue;
        }

        // if current component does not fit the remaining height from page
        if (listOfElemHeights[i] > heightLeftFromPage) {
            const headerHeight = getPositionHeaderHeight(work.children[i]);
            // if the header of the work component fits the page we add the split component to
            if (headerHeight < heightLeftFromPage) {
                [workSplitComponents, componentSplitHeights] = splitDescriptionAndGetComponents(work.children[i], heightLeftFromPage);
                console.log(`Split component from index ${i} and add it at the end of work page ${workPages.length ? workPages.length : workPages.length + 1}`)
                workEmptyContainer.appendChild(workSplitComponents[0]);
                console.log(`Page ${workPages.length ? workPages.length : workPages.length + 1} height after adding split component is: `, currentPageHeight + componentSplitHeights[0]);
                workSplitComponents.shift();
                componentSplitHeights.shift();
            } else {
                i--;
                console.log(`Move component from index ${i} to page ${workPages.length + 1}`);
            }
            // close current page and reset to initial values

            workEmptyContainer.appendChild(footer);
            workPages.push(workEmptyContainer.cloneNode(true));
            console.log(`Create work page ${workPages.length}`);
            targetPageHeight = initialTargetPageHeight;
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = initialHeightLeftFromPage;
            console.log(`Reset current page height to: ${currentPageHeight}`);
            workEmptyContainer = getEmptyHtmlContainer(work);
        }

        if (workSplitComponents) {
            const lastIndex = workSplitComponents.length - 1;
            workSplitComponents.forEach((comp, index) => {
                if (index === lastIndex) {
                    workEmptyContainer.appendChild(workSplitComponents[lastIndex]);
                    currentPageHeight = componentSplitHeights[lastIndex];
                    console.log(`Height after adding last extra component is ${currentPageHeight}`);
                    heightLeftFromPage = targetPageHeight - currentPageHeight;
                    workSplitComponents = null;
                    componentSplitHeights = null;
                } else {
                    workEmptyContainer.appendChild(comp);
                    workEmptyContainer.appendChild(footer);
                    workPages.push(workEmptyContainer.cloneNode(true));
                    console.log(`Add ${index + 1} extra page`);
                    console.log(`Create work page with number ${workPages.length}`);
                    workEmptyContainer = getEmptyHtmlContainer(work);
                }
            });
        }
    }

    if (workEmptyContainer.children.length > 0) {
        console.log(`Add last component`);
        workEmptyContainer.appendChild(footer);
        workPages.push(workEmptyContainer.cloneNode(true));
    }
    console.log('Create work page with number: ', workPages.length);

    return workPages;
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

    let currentPageHeight = 0;
    let nextPage = [];
    let pages = [];
    let nextPageElements = [];
    let targetPageHeight = heightLeftOnPage;
    descriptionCloneElements.forEach((elem, i) => {
        if (nextPageElements && nextPageElements.length > 0) {
            nextPageElements.forEach(elems => {
                nextPage.push(elems[0]);
                currentPageHeight += elems[1];
            });
            nextPageElements = [];
        }

        nextPage.push(elem);
        currentPageHeight += descriptionElementsHeights[i];

        if (currentPageHeight > targetPageHeight) {
            nextPageElements.push([nextPage.pop(), descriptionElementsHeights[i]]);
            currentPageHeight = currentPageHeight - descriptionElementsHeights[i]
            if (currentPageHeight + 0.2 > targetPageHeight) {
                currentPageHeight = currentPageHeight - descriptionElementsHeights[i - 1];
                nextPageElements.push([nextPage.pop(), descriptionElementsHeights[i - 1]]);
            }
            console.log(`Split component full page height: ${currentPageHeight}`);
            pages.push([nextPage, currentPageHeight]);
            currentPageHeight = initialCurrentPageHeight;
            nextPage = [];
            targetPageHeight = initialTargetPageHeight;
        }
    });

    if (nextPageElements && nextPageElements.length > 0) {
        nextPageElements.forEach(elems => {
            nextPage.push(elems[0]);
            currentPageHeight += elems[1];
        });
        nextPageElements = [];
    }

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
    const componentHeight = getDimensionInCM(component.offsetHeight);
    const componentContent = component.children[0]
    const positionHeaderHeight = componentContent.children[0].children[0].offsetHeight;
    const dateHeaderHeight = componentContent.children[0].children[1].offsetHeight;
    const workDateAndPositionContainerHeight = getDimensionInCM(positionHeaderHeight + dateHeaderHeight);
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
    let workDateAndPositionContainerHeight = getDimensionInCM(positionHeaderHeight + dateHeaderHeight);
    if (defaultWorkDateAndPositionContainerHeight > workDateAndPositionContainerHeight) {
        workDateAndPositionContainerHeight = defaultWorkDateAndPositionContainerHeight;
    }
    return workDateAndPositionContainerHeight;
}