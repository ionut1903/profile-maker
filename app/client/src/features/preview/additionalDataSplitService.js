import {getDimensionInMM, getEmptyHtmlContainer, getHeightAndCloneOfElement} from "./splitTemplateUtils";

{/**
 deconstructs and reconstructs the additional data html component
 with values from the listOfElements.
 if it is the first page we will need to add also the old title and languages
 the order of component initialization matters!!
 */}

export const splitAdditionalData = (additionalData, remainingPageHeight) => {
    let additionalDataHeight = getDimensionInMM(additionalData.offsetHeight);
    const listElements = additionalData.children[0].children[0].children[1].children[1].children[1].children;
    const [liElements, listOfElemHeights] = getHeightAndCloneOfElement(listElements)
    const cloneOfAdditionalData = additionalData.cloneNode(true);

    const elementsToAddToNextPage = [];
    let numberOfItems = liElements.length;
    let index = numberOfItems - 1;
    let isOddNumberOfElem = false;
    let secondComponentHeight = additionalDataHeight;

    while (remainingPageHeight < additionalDataHeight) {
        if (numberOfItems % 2 === 0 || isOddNumberOfElem) {
            //    take 2 elements at a time from the end of the array
            elementsToAddToNextPage.push(liElements[index].cloneNode(true));
            index--;
            elementsToAddToNextPage.push(liElements[index].cloneNode(true));
            index--;
            additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
        } else {
            // if a number of odd values then add only one elem
            isOddNumberOfElem = true;
            elementsToAddToNextPage.push(listElements[index].cloneNode(true));
            index--;
            additionalDataHeight = additionalDataHeight - listOfElemHeights[index];
            numberOfItems--;
        }
    }
    secondComponentHeight = secondComponentHeight - additionalDataHeight;
    const elementsToAddToCurrentPage = [];

    for (let i = 0; i <= index; i++) {
        elementsToAddToCurrentPage.push(listElements[i]);
    }

    const firstPageAdditionalData = getAdditionalDataHtml(cloneOfAdditionalData, elementsToAddToCurrentPage, true);
    const secondPageAdditionalData = getAdditionalDataHtml(additionalData.cloneNode(true), elementsToAddToNextPage);
    return [firstPageAdditionalData, secondPageAdditionalData, secondComponentHeight];
}

{/**
    deconstructs and reconstructs the additional data html component
    with values from the listOfElements.
    if it is the first page we will need to add also the old title and languages
    the order of component initialization matters!!
*/}

const getAdditionalDataHtml = (additionalData, listOfElements, isFirstPage) => {
    // deconstructs the additional component
    let additionalDataHtml = additionalData.cloneNode(true);
    const additionalDataHeader = additionalDataHtml.children[0].children[0].children[0];
    const additionalDataListsContainer = additionalData.children[0].children[0].children[1].cloneNode(true);
    const additionalDataListsContainerEmpty = getEmptyHtmlContainer(additionalDataListsContainer);
    const languageListContainer = additionalDataListsContainer.children[0];
    const techSkillTitle = additionalDataListsContainer.children[1].children[0];
    const ulEmpty = getEmptyHtmlContainer(additionalDataListsContainer.children[1].children[1]);
    const techSkillEmptyListContainer = getEmptyHtmlContainer(additionalDataListsContainer.children[1]);

    const additionalDataEmpty = getEmptyHtmlContainer(additionalDataHtml.children[0].children[0]);

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

    const additionalDataContentEmpty = getEmptyHtmlContainer(additionalDataHtml.children[0].children[0]);
    const additionalDataContainerEmpty = getEmptyHtmlContainer(additionalDataHtml.children[0]);
    additionalDataContentEmpty.appendChild(additionalDataEmpty);
    additionalDataContainerEmpty.appendChild(additionalDataContentEmpty);

    return additionalDataContainerEmpty;
}