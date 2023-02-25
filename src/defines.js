const H1 = "<h1>%c</h1>"
const H2 = "<h2>%c</h2>"
const H3 = "<h3>%c</h3>"
const H4 = "<h4>%c</h4>"
const H5 = "<h5>%c</h5>"
const H6 = "<h6>%c</h6>"
const DEL = "<del>$content</del>"
const IMG = "<img src='$src' alt='$alt' title='$title' />"
const A = "<a href='$href'>$content</a>"
const B = "<b>$content</b>"
const I = "<i>$content</i>"
const CODE = "<code>$content</code>"
const FOOTNOTE = "<sup><small>$content</small></sup>"
const SPACE = ""
const ENTER = /^\n/
const HEADER = /^(#{1,6} .+(?=\n))/g
const HEADER2 = /^(.+\n(={3,}|-{3,}))/g
const PARAGHAPH = /^(.+\n)+/g
const BLOCKQUOTE = /^(> ?(.|\n)+(?=\n\n))/g
const HR = /^(-{3,}|={3,}|\*{3,})(?!.)/g
const UL = /^( *(-|\+|\*) .+\n)+(?=\n)/g
const OL = /^( *(\d\.) .+\n)+(?=\n)/g
const CODECHUNK = /^(```.+?```)/gs
const TABLE = /^((\|[^\|\n]+)+\|\n)+/g
