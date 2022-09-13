import {getDimensionInMM, getEmptyHtmlContainer, getHeightAndCloneOfElement} from "./splitTemplateUtils";

{/**
 deconstructs and reconstructs the additional data html component
 with values from the listOfElements.
 if it is the first page we will need to add also the old title and languages
 the order of component initialization matters!!
 */
}

export const splitAdditionalData = (additionalData, remainingPageHeight, pageTargetHeight) => {
    let additionalDataHeight = getDimensionInMM(additionalData.offsetHeight);
    let additionalDataLangSectionHeight = getDimensionInMM(additionalData.children[0].children[1].children[0].offsetHeight);
    const listElements = additionalData.children[0].children[1].children[1].children[1].children;
    let [liElements, listOfElemHeights] = getHeightAndCloneOfElement(listElements)
    const cloneOfAdditionalData = additionalData.cloneNode(true);

    let elementsToAddToNextPage = [];
    let numberOfItems = liElements.length;
    let index = numberOfItems - 1;
    let isEvenNumberOfElem = liElements.length % 2 === 0;
    let nextComponentHeight = additionalDataHeight - additionalDataLangSectionHeight;
    let currentPageHeight = 0;

    while (remainingPageHeight < additionalDataHeight) {
        if (isEvenNumberOfElem) {
            //    take 2 elements at a time from the end of the array
            elementsToAddToNextPage.push(liElements[index].cloneNode(true));
            additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
            currentPageHeight += listOfElemHeights[index];
            index--;
            elementsToAddToNextPage.push(liElements[index].cloneNode(true));
            index--;
        } else {
            // if a number of odd values then add only one elem
            isEvenNumberOfElem = true;
            elementsToAddToNextPage.push(listElements[index].cloneNode(true));
            index--;
            additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
            numberOfItems--;
        }
    }
    nextComponentHeight = nextComponentHeight - additionalDataHeight;

    // what is about this one?
    const elementsToAddToCurrentPage = [];

    // add to first page
    for (let i = 0; i <= index; i++) {
        elementsToAddToCurrentPage.push(listElements[i]);
    }
    const firstPageAdditionalData = getAdditionalDataHtml(cloneOfAdditionalData, elementsToAddToCurrentPage, true);

    elementsToAddToNextPage.reverse();
    listOfElemHeights.reverse();
    const additionalDataPagesAndHeights = getNextAdditionalComponents(elementsToAddToNextPage, pageTargetHeight, nextComponentHeight, additionalData, listOfElemHeights);
    return {
        firstPageAdditionalData: firstPageAdditionalData,
        additionalDataPagesAndHeights: additionalDataPagesAndHeights,
    }
}

{/**
 gets html additional data component for elements that don't fit on first page
 checks if the remaining elements fit on a single page - if not we split further
 returns a Tuple with component and its height
 */
}
const getNextAdditionalComponents = (elements, pageTargetHeight, nextComponentHeight, additionalData, listElementsHeights) => {
    const nextAdditionalComponentsAndHeights = [];
    let currentPageElements = [];
    let currentHeight = 0;
    let remainingElement = null;
    elements.forEach((elem, index) => {
        currentPageElements.push(elem);
        currentHeight += listElementsHeights[index];

        if (currentHeight > pageTargetHeight) {
            remainingElement = currentPageElements.pop();
            const componentToBeAdded = getAdditionalDataHtml(additionalData, currentPageElements);
            const componentHeight = currentHeight - listElementsHeights[index];
            nextAdditionalComponentsAndHeights.push([componentToBeAdded, componentHeight]);
            currentPageElements = [];
            currentHeight = 0;
            console.log('Adding extra add page number: ', nextAdditionalComponentsAndHeights.length);
        }

        if (remainingElement) {
            currentPageElements.push(remainingElement);
            remainingElement = null;
        }
    });

    const componentToBeAdded = getAdditionalDataHtml(additionalData, currentPageElements);
    nextAdditionalComponentsAndHeights.push([componentToBeAdded, currentHeight]);
    console.log('Adding extra add page number: ', nextAdditionalComponentsAndHeights.length);

    return nextAdditionalComponentsAndHeights;
}

{/**
 deconstructs and reconstructs the additional data html component
 with values from the listOfElements.
 if it is the first page we will need to add also the old title and languages
 the order of component initialization matters!!
 */
}

const getAdditionalDataHtml = (additionalData, listOfElements, isFirstPage) => {
    // deconstructs the additional component
    let additionalDataHtml = additionalData.cloneNode(true);
    const additionalDataHeader = additionalDataHtml.children[0].children[0];
    const additionalDataListsContainer = additionalData.children[0].children[1].cloneNode(true);
    const additionalDataListsContainerEmpty = getEmptyHtmlContainer(additionalDataListsContainer);
    const languageListContainer = additionalDataListsContainer.children[0];
    const techSkillTitle = additionalDataListsContainer.children[1].children[0];
    const ulEmpty = getEmptyHtmlContainer(additionalDataListsContainer.children[1].children[1]);
    const techSkillEmptyListContainer = getEmptyHtmlContainer(additionalDataListsContainer.children[1]);

    const additionalDataEmpty = getEmptyHtmlContainer(additionalDataHtml.children[0]);

    // reconstructs the additional component
    if (isFirstPage) {
        techSkillEmptyListContainer.appendChild(techSkillTitle);
        additionalDataListsContainerEmpty.appendChild(languageListContainer);
        additionalDataEmpty.appendChild(additionalDataHeader);
    } else {
        // creates an empty h2 element to keep the same structure for additional comp
        additionalDataEmpty.appendChild(document.createElement('h2'));
    }

    for (let elem of listOfElements) {
        ulEmpty.appendChild(elem.cloneNode(true));
    }

    techSkillEmptyListContainer.appendChild(ulEmpty);
    additionalDataListsContainerEmpty.appendChild(techSkillEmptyListContainer);
    additionalDataEmpty.appendChild(additionalDataListsContainerEmpty);

    const additionalDataContainerEmpty = getEmptyHtmlContainer(additionalDataHtml);
    additionalDataContainerEmpty.appendChild(additionalDataEmpty);

    return additionalDataContainerEmpty;
}