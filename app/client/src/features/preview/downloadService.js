import {
    appendToPageIfComponentFitsAndReturnNewHeights, getDimensionInCM,
    getEmptyHtmlContainer,
    getHeightAndCloneOfElement, isFooterLastElementToBeAdded
} from "./splitTemplateUtils";
import {splitAdditionalData} from "./additionalDataSplitService";
import {splitWorkComponents} from "./workSplitService";

export const splitResumeToA4Pages = (htmlElem) => {
    const pdfPadding = getDimensionInCM(20);
    const targetPageHeight = 28.9 - pdfPadding;
    const templateContainer = htmlElem.children[0];
    let pagesToPrint = [];
    let workIndex = 5;
    const work = templateContainer.children[workIndex];
    const additionalDataIndex = 3;
    const additionalData = templateContainer.children[additionalDataIndex];

    let [pageElements, listOfElemHeights] = getHeightAndCloneOfElement(templateContainer.children);
    const footer = pageElements.pop();
    setFooterStyle(footer);
    // todo refactor to remove all references of components!


    let newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
    let newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
    const initialCurrentPageHeight = 3.4;
    let currentPageHeight = initialCurrentPageHeight;
    let heightLeftFromPage = targetPageHeight - currentPageHeight;
    let workHistoryPages = [];
    let isAdditionalComponentSplit = false;
    let isWorkSplit = false;

    for (let i = 0; i < pageElements.length; i++) {
        if (i === additionalDataIndex && isAdditionalComponentSplit) {
            continue;
        }

        if (isWorkSplit) {
            continue;
        }

        if (listOfElemHeights[i] + currentPageHeight > targetPageHeight && i === workIndex) {
            workHistoryPages = splitWorkComponents(work, footer);
            isWorkSplit = true;
        }

        const currentPageHeightWithNextComp = currentPageHeight + listOfElemHeights[i];

        const changeHeights = appendToPageIfComponentFitsAndReturnNewHeights(
            currentPageHeightWithNextComp,
            targetPageHeight,
            heightLeftFromPage,
            listOfElemHeights[i],
            newHtmlTemplateContainer,
            pageElements[i]);

        currentPageHeight = changeHeights[0] ? changeHeights[0] : currentPageHeight;
        heightLeftFromPage = changeHeights[1] ? changeHeights[1] : heightLeftFromPage;

        //if there exists another element, and it does not enter into the current page
        // add footer to the current page and reset data to initial values and go again
        if (pageElements[i + 1] && heightLeftFromPage < listOfElemHeights[i + 1]) {
            // split additional data into multiple parts
            let nextSkillsPagesAndHeights = null
            if (i + 1 === additionalDataIndex && heightLeftFromPage < listOfElemHeights[i + 1]) {
                const skillPages = splitAdditionalData(additionalData, heightLeftFromPage, targetPageHeight - initialCurrentPageHeight);
                newHtmlTemplateContainer.appendChild(skillPages[0][0]);
                currentPageHeight += heightLeftFromPage;
                isAdditionalComponentSplit = true;
                nextSkillsPagesAndHeights = skillPages.slice(1);
            }

            // add footer to the end of the page
            newHtmlTemplateContainer.appendChild(footer);
            newHtmlTemplate.appendChild(newHtmlTemplateContainer.cloneNode(true));
            pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
            // reset to initial values

            newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
            newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
            currentPageHeight = initialCurrentPageHeight;
            heightLeftFromPage = targetPageHeight - currentPageHeight

            if (nextSkillsPagesAndHeights && nextSkillsPagesAndHeights.length > 0) {
                const lastIndex = nextSkillsPagesAndHeights.length - 1;
                nextSkillsPagesAndHeights.forEach((skillsAndHeights, i) => {
                    newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
                    newHtmlTemplateContainer.appendChild(skillsAndHeights[0]);
                    if (i === lastIndex) {
                        currentPageHeight = skillsAndHeights[1];
                        heightLeftFromPage = targetPageHeight - currentPageHeight
                        return;
                    } else {
                        newHtmlTemplateContainer.appendChild(footer);
                        currentPageHeight = initialCurrentPageHeight;
                        heightLeftFromPage = targetPageHeight - currentPageHeight
                    }

                    newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
                    newHtmlTemplate.appendChild(newHtmlTemplateContainer.cloneNode(true));
                    pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
                    newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
                    newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
                });
            }
        }
    }

    if (newHtmlTemplateContainer.children.length > 0) {
        newHtmlTemplateContainer.appendChild(footer);
        newHtmlTemplate.appendChild(newHtmlTemplateContainer);
        pagesToPrint.push(newHtmlTemplate.cloneNode(true).innerHTML);
    }

    const workPages = getWorkHistoryPages(workHistoryPages, htmlElem, templateContainer);
    pagesToPrint = pagesToPrint.concat(workPages);
    return pagesToPrint;
}

const getWorkHistoryPages = (workHistoryPages, htmlElem, templateContainer) => {
    const pagesToPrint = [];
    for (let elem of workHistoryPages) {
        const newHtmlTemplate = getEmptyHtmlContainer(htmlElem);
        const newHtmlTemplateContainer = getEmptyHtmlContainer(templateContainer);
        newHtmlTemplateContainer.appendChild(elem);
        newHtmlTemplate.appendChild(newHtmlTemplateContainer);
        pagesToPrint.push(newHtmlTemplate.innerHTML);
    }
    return pagesToPrint;
}

// to display footer always on the bottom of the page
const setFooterStyle = (footer) => {
    footer.style.position = 'fixed'
    footer.style.bottom = 0;
}