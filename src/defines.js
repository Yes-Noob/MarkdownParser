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
const BLOCKQUOTE = /^(>+.+\n)((> )?.+\n)*/g
const HR = /^(-{3,}|={3,}|\*{3,})(?!.)/g
const LIST = /^(( *(-|\+|\*|\d\.) .+(\n(?!(-|\+|\*) ).+)*)\n)+/g
const CODECHUNK = /^(```.+?```)/gs
const TABLE = /^(((\|[^\|\n]+)+\|\n)(( |\||:|-)+)\n((\|[^\|\n]+)+\|\n)+)/g
const INLINECODECHUNK = /^(    .+\n)+/g
const ESCAPE = "<ESCAPE\t\s\b\u3000>"
