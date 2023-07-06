export function getHTMLWrapper () {
    const html = document.implementation.createHTMLDocument(`resume`);
    html.head.innerHTML = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;750" rel="stylesheet" type="text/css">`
    const clone = html.cloneNode(true);
    return clone
}

export function getWrappedElement (body: Node, wrapper: Node ) {
    wrapper.body.appendChild(body)
    return `<html>${wrapper.documentElement.innerHTML}</html>`
}