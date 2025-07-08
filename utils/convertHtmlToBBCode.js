export function convertHtmlToBBCode(html) {
  return html
    .replace(/<b>(.*?)<\/b>/g, '[b]$1[/b]')
    .replace(/<i>(.*?)<\/i>/g, '[i]$1[/i]')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[URL=$1]$2[/URL]')
    .replace(/<br\s*\/?>(\n)?/g, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '') // remove other tags
}
