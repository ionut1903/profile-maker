{/**
 transforms px in millimeters
 */
}

export const getDimensionInCM = (dimensionInPX) => {
    return dimensionInPX * 2.54 / 96;
}

{/**
 clones an html element and deletes all children from the clone
 return value: empty cloned html element
 */
}
export const getEmptyHtmlContainer = (htmlElem) => {
    let htmlElemClone = htmlElem.cloneNode(true)
    while (htmlElemClone.hasChildNodes()) {
        htmlElemClone.removeChild(htmlElemClone.lastChild);
    }
    return htmlElemClone;
}


{/**
 gets the height of the element list and returns the cloned elements
 used to calculate the space that is left from the page
 */
}
export const getHeightAndCloneOfElement = (elements) => {
    const pageElements = [];
    let listOfElemHeights = []
    for (let elem of elements) {
        pageElements.push(elem.cloneNode(true));
        listOfElemHeights.push(getDimensionInCM(elem.offsetHeight));
    }
    return [pageElements, listOfElemHeights];
}


export const appendToPageIfComponentFitsAndReturnNewHeights = (currentPageHeightWithNextComp, targetPageHeight, heightLeftFromPage, elemHeight, container, elem) => {
    if (currentPageHeightWithNextComp <= targetPageHeight && heightLeftFromPage >= elemHeight) {
        container.appendChild(elem);
        const currentPageHeight = currentPageHeightWithNextComp;
        const heightLeft = targetPageHeight - currentPageHeight;
        return [currentPageHeight, heightLeft];
    }
    return [null, null];
}

{/**
 if there are no other elements to be added then the method will
 add footer as the last element to the page
 */
}
export const isFooterLastElementToBeAdded = (elem, content, container, footer) => {
    if (!elem) {
        content.appendChild(footer);
        container.appendChild(content);
        return true;
    }
    return false;
}