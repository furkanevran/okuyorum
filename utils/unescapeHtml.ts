export default function decodeHtml(html: string) {
    html = html.replace(/&lt;/g,'<')
    html = html.replace(/&gt;/g,'>')
    html = html.replace(/\\"/g,'"')

    return html
}