import {getDimensionInCM, getEmptyHtmlContainer, getHeightAndCloneOfElement} from "./splitTemplateUtils";

{/**
 deconstructs and reconstructs the additional data html component
 with values from the listOfElements.
 if it is the first page we will need to add also the old title and languages
 the order of component initialization matters!!
 */
}

export const splitSkillsData = (skillsElem, remainingPageHeight) => {
    const listElements = skillsElem.children[0].children[1].children[0].children;
    let [liElements, listOfElemHeights] = getHeightAndCloneOfElement(listElements);
    const pagesWithElements = getSkillsPages(liElements, listOfElemHeights, remainingPageHeight);

    const skillComponentList = [];
    pagesWithElements.forEach((elemsAndHeights) => {
        let skillComponent;
        if (skillComponentList.length === 0) {
            skillComponent = constructSkillsContainer(skillsElem, elemsAndHeights[0], true);
        } else {
            skillComponent = constructSkillsContainer(skillsElem, elemsAndHeights[0]);
        }
        skillComponentList.push([skillComponent, elemsAndHeights[1]]);
    })
    return skillComponentList;
}

{/**
 split list of elements into multiple pages
 */
}
const getSkillsPages = (listOfElements, listOfElementsHeights, remainingPageHeight) => {
    let elementsToAddToNextPage = [];
    const pages = [];
    let numberOfItems = listOfElements.length;
    const initialCurrentPageHeight = 3.4;
    let currentPageHeight = 0;
    let pageTargetHeight = remainingPageHeight;
    const pdfPadding = getDimensionInCM(20);
    const initialPageTargetHeight = 28.9 - pdfPadding;

    for (let i = 0; i < numberOfItems; i += 2) {
        elementsToAddToNextPage.push(listOfElements[i]);
        currentPageHeight += listOfElementsHeights[i];

        if (listOfElements[i + 1]) {
            elementsToAddToNextPage.push(listOfElements[i + 1]);
        }

        if (currentPageHeight > pageTargetHeight - 0.8) {
            elementsToAddToNextPage.pop();
            currentPageHeight = currentPageHeight - listOfElementsHeights[i];
            i--;

            if (!elementsToAddToNextPage.length % 2 === 0) {
                elementsToAddToNextPage.pop();
                i--;
            }
            console.log('Added a number of elements: ', elementsToAddToNextPage.length);
            pages.push([elementsToAddToNextPage, currentPageHeight]);
            elementsToAddToNextPage = [];
            currentPageHeight = initialCurrentPageHeight;
            pageTargetHeight = initialPageTargetHeight;
        }
    }

    if (elementsToAddToNextPage.length > 0) {
        console.log('Added a number of elements: ', elementsToAddToNextPage.length);
        pages.push([elementsToAddToNextPage, currentPageHeight]);
    }

    return pages;
}

{/**
 deconstructs and reconstructs the skills html component
 with values from the listOfElements.
 if it is the first page we will need to add also the old title and languages
 the order of component initialization matters!!
 */
}

const constructSkillsContainer = (skillsElem, listOfElements, isFirstPage) => {
    // deconstructs the skills component
    const skillElements = deconstructSkillsComponentAndGetEmptyContainer(skillsElem);

    // reconstructs the skills component
    if (isFirstPage) {
        skillElements.skillsContentEmpty.appendChild(skillElements.skillsDataHeader);
    } else {
        // creates an empty h2 element to keep the same structure for additional comp
        skillElements.skillsContentEmpty.appendChild(skillElements.skillsDataHeaderEmpty);
    }

    for (let elem of listOfElements) {
        skillElements.ulEmpty.appendChild(elem.cloneNode(true));
    }

    skillElements.skillsListsContainerEmpty.appendChild(skillElements.ulEmpty);
    skillElements.skillsContentEmpty.appendChild(skillElements.skillsListsContainerEmpty);
    skillElements.skillsContainerEmpty.appendChild(skillElements.skillsContentEmpty);

    return skillElements.skillsContainerEmpty;
}

{/**
 gets every component from the skills element and empties its content
 */
}
const deconstructSkillsComponentAndGetEmptyContainer = (skillsElem) => {
    let skillsHtml = skillsElem.cloneNode(true);
    const skillsDataHeader = skillsHtml.children[0].children[0];
    const skillsDataHeaderEmpty = getEmptyHtmlContainer(skillsHtml.children[0].children[0]);
    const skillsListsContainerEmpty = getEmptyHtmlContainer(skillsHtml.children[0].children[1]);
    const ulEmpty = getEmptyHtmlContainer(skillsHtml.children[0].children[1].children[0]);
    const skillsContentEmpty = getEmptyHtmlContainer(skillsHtml.children[0]);
    const skillsContainerEmpty = getEmptyHtmlContainer(skillsHtml);

    return {
        skillsHtml,
        skillsDataHeader,
        skillsDataHeaderEmpty,
        skillsListsContainerEmpty,
        ulEmpty,
        skillsContentEmpty,
        skillsContainerEmpty
    }
}