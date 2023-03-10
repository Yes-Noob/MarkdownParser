/** Markdown文档类
 * @version v1.0
 * @author create by Yes-Noob
 */
class MarkdownDoc {

    /** 实例化一个Markdown文档
     * @param {string} doc Markdown文档内容
     */
    constructor(doc) {
        if (! /\n\n$/.test(doc)) {
            doc += "\n"
            return new MarkdownDoc(doc)
        }
        else {
            this.doc = doc
            this.indent = 4
        }
    }

    /** 解析这个Markdown文档为HTML格式
     * @return {string} 解析后的html格式
     */
    parseDocument() {
        let escapeChar = this.doc.match(/\\./g)
        let doc = this.doc.replaceAll(/\\./g, ESCAPE)
        doc = this.parseKeywords(doc)
        let tokens = this.getMarkdownTokens(doc)
        // 解析token
        let html = this.parseToken(tokens)
        for (let v of escapeChar) {
            html = html.replace(ESCAPE, v[1])
        }
        return html
    }

    /** 解析markdown文档的所有关键词汇
     * @param {string} doc
     * @param {string} 解析后的文档
     */
    parseKeywords(doc) {
        // 图片
        {
            let imageRegExp = /!\[.*?\]\(.*( ".*?")?\)/
            while (imageRegExp.test(doc)) {
                let img = doc.match(imageRegExp)[0]
                let alt = img.match(/(?<=!\[).*?(?=\])/)[0]
                let src = img.match(/(?<=\().+?(?= |\))/)[0]
                let title = img.match(/((?<=").*?(?="))?/)[0]
                let html = IMG.replace("$alt", alt)
                    .replace("$src", src)
                    .replace("$title", title)
                doc = doc.replace(img, html)
            }
        }
        // 链接1
        {
            let hrefRegExp = /(?<!!)\[.*?\]\(.*\)/
            while (hrefRegExp.test(doc)) {
                let a = doc.match(hrefRegExp)[0]
                let content = a.match(/(?<=\[).*?(?=\])/)[0]
                let href = a.match(/(?<=\().+?(?=\))/)[0]
                let html = A.replace("$href", href)
                    .replace("$content", content)
                doc = doc.replace(a, html)
            }
        }
        // 链接2
        {
            let hrefRegExp = /(?<=<)https?.+?(?=>)/
            while (hrefRegExp.test(doc)) {
                let href = doc.match(hrefRegExp)[0]
                let html = A.replace("$href", href)
                    .replace("$content", href)
                doc = doc.replace(/(<)https?.+?(>)/, html)
            }
        }
        // 粗体
        {
            let bRegExp = /(?<=\*\*).+?(?=\*\*)/
            while (bRegExp.test(doc)) {
                let content = doc.match(bRegExp)[0]
                let html = B.replace("$content", content)
                doc = doc.replace(/(\*\*).+?(\*\*)/, html)
            }
        }
        // 粗体2
        {
            let bRegExp = /(?<=__).+?(?=__)/m
            while (bRegExp.test(doc)) {
                let content = doc.match(bRegExp)[0]
                let html = B.replace("$content", content)
                doc = doc.replace(/(__).+?(__)/, html)
            }
        }
        // 斜体
        {
            let iRegExp = /(?<=\*).+?(?=\*)/
            while (iRegExp.test(doc)) {
                let content = doc.match(iRegExp)[0]
                let html = I.replace("$content", content)
                doc = doc.replace(/(\*).+?(\*)/, html)

            }
        }
        // 斜体2
        {
            let iRegExp = /(?<=_).+?(?=_)/m
            while (iRegExp.test(doc)) {
                let content = doc.match(iRegExp)[0]
                let html = I.replace("$content", content)
                doc = doc.replace(/(_).+?(_)/, html)
            }
        }
        // 删除线
        {
            let delRegExp = /(?<=~~).+?(?=~~)/
            while (delRegExp.test(doc)) {
                let content = doc.match(delRegExp)[0]
                let html = U.replace("$content", content)
                doc = doc.replace(/(~~).+?(~~)/, html)
            }
        }
        // 小代码块
        {
            let codeRegExp = /`.+?`/
            while (codeRegExp.test(doc)) {
                let content = doc.match(codeRegExp)[0]
                let html = U.replace("$content", content)
                doc = doc.replace(/`.+?`/, html)
            }
        }
        // 脚注
        {
            let footnoteRegExp = /\[\^.+\]/
            while (footnoteRegExp.test(doc)) {
                let content = doc.match(footnoteRegExp)[0]
                let html = U.replace("$content", content)
                doc = doc.replace(/\[\^.+\]/, html)
            }
        }
        return doc
    }

    /** 解析一个Markdown文档的token元素
     * @param {string} doc 
     * @return {Array} token集合
     */
    getMarkdownTokens(doc) {
        let tokens = [] // 用于存储所有解析出来的token
        while (doc !== "") { // 开始解析全部token
            // 从头开始匹配token字符
            if (ENTER.test(doc)) { // 空行
                doc = doc.replace(ENTER, SPACE)
            }
            else if (HEADER.test(doc)) { // 标题
                let token = doc.match(HEADER)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "header", string: token }
                tokens.push(token)
            }
            else if (BLOCKQUOTE.test(doc)) { // 引用块
                let token = doc.match(BLOCKQUOTE)[0]
                doc = doc.replace(token, SPACE) // 删除
                // 将引用块前缀的空格删去
                token = token.replaceAll("> ", ">")
                console.log("$$$", token)
                token = token.replaceAll(/^(?=[^>])/gm, ">")
                token = { type: "blockquote", string: token }
                tokens.push(token)
            }
            else if (HR.test(doc)) { // 水平线
                let token = doc.match(HR)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "hr" }
                tokens.push(token)
            }
            else if (HEADER2.test(doc)) { // 水平线风格标题
                let token = doc.match(HEADER2)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "header2", string: token }
                tokens.push(token)
            }
            else if (CODECHUNK.test(doc)) { // 代码块
                let token = doc.match(CODECHUNK)[0]
                doc = doc.replace(token, SPACE) // 删除
                let lang = token.match(/(?<=```).+/)[0]
                token = { type: "codechunk", string: token, lang: ((lang !== "\n") ? lang : "") }
                tokens.push(token)
            }
            else if (LIST.test(doc)) { // 无序列表或有序列表
                let token = doc.match(LIST)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = token.replaceAll(/(?<=^ *)(\+|\*) /gm, "- ")
                token = token.replaceAll(/(  )$/gm, "<br>")
                token = { type: "list", string: token }
                tokens.push(token)
            }
            else if (TABLE.test(doc)) { // 表格
                let token = doc.match(TABLE)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "table", string: token }
                tokens.push(token)
            }
            else if (PARAGHAPH.test(doc)) { // 段落
                let token = doc.match(PARAGHAPH)[0]
                if (/^(-|\*|\+|!|    |\d\. .+)/gm.test(token)) { // 兼容不标准的段落
                    token = token.substring(0, token.indexOf(token.match(/^(-|\*|\+|!|    |\d\. .+)/gm)[0]))
                }
                doc = doc.replace(token, SPACE) // 删除
                token = token.replaceAll(/(  )$/gm, "<br>")
                token = { type: "paragraph", string: token }
                tokens.push(token)
            }
        }
        return tokens
    }

    /** 解析token集合，返回html字符串
     * @param {Array} tokens token集合
     * @return {string} html字符串
     */
    parseToken(tokens) {
        let ret = ""
        for (let v of tokens) {
            let result = ""
            if (v.type === "header") { // 标题
                /** 将标题内容放进标签里
                 * @param {string} str v.string
                 * @param {int} level 标题等级
                 * @return {string} 标题的html标签形式
                 */
                let setHeaderInTag = function (str, level) {
                    str = str.substring(level + 1, v.string.length)
                    return "<h" + level + ">" + str + "</h" + level + ">"
                }
                if (/^######/.test(v.string)) {
                    result = setHeaderInTag(v.string, 6)
                }
                else if (/^#####/.test(v.string)) {
                    result = setHeaderInTag(v.string, 5)
                }
                else if (/^####/.test(v.string)) {
                    result = setHeaderInTag(v.string, 4)
                }
                else if (/^###/.test(v.string)) {
                    result = setHeaderInTag(v.string, 3)
                }
                else if (/^##/.test(v.string)) {
                    result = setHeaderInTag(v.string, 2)
                }
                else if (/^#/.test(v.string)) {
                    result = setHeaderInTag(v.string, 1)
                }
            }
            else if (v.type === "blockquote") { // 引用块
                console.log("STR = ", v.string)
                v.string = v.string.replaceAll(/^>/gm, "") // 减少一个层次
                
                let tokens = this.getMarkdownTokens(v.string)
                console.log("tokes = ", tokens)
                let htmlContent = this.parseToken(tokens)
                result = "<div class='blockquote'>" + htmlContent + "</div>"
            }
            else if (v.type === "header2") { // 水平线标题
                if (/(-)$/.test(v.string)) {
                    v.string = v.string.substring(0, v.string.indexOf("\n"))
                    result = "<h1>" + v.string + "</h1>"
                }
                else {
                    v.string = v.string.substring(0, v.string.indexOf("\n"))
                    result = "<h2>" + v.string + "</h2>"
                }
            }
            else if (v.type === "hr") { // 水平线
                result = "<hr>"
            }
            else if (v.type === "codechunk") { // 代码块
                v.string = v.string.substring(v.string.indexOf("\n") + 1, v.string.length - 4)
                result = "<code lang='" + v.lang + "'>" + v.string + "</code>"
            }
            else if (v.type === "list") { // 无序列表或有序列表
                let all = v.string.match(/^( *(-|\d\.) .+(\n(?! *(-|\d\.) ).+)*)/gm)
                let level = -1
                let last_list_type = []
                console.log("v.string = " + v.string)
                console.log("all = ", all)
                for (let content of all) {
                    let indentNumber = content.match(/^ */g)[0].length / this.indent // 当前缩进数量
                    let d = "<li>" + content.match(/(?<=^( *(-|\d\.) )).+(\n(?! *(-|\d\.) ).+)*/)[0] + "</li>" // 列表文字内容
                    if (indentNumber > level) { // 如果缩进量大于上一个列表缩进量
                        let number = indentNumber - level
                        last_list_type.push(/(?<=^( *))- /.test(content) ? "<ul>" : "<ol>")
                        d = last_list_type[last_list_type.length - 1].repeat(number) + d
                        level += number
                    }
                    else if (indentNumber < level) {
                        let number = level - indentNumber
                        d = (last_list_type[last_list_type.length - 1] === "<ul>"
                            ? "</ul>" : "</ol>").repeat(number) + d
                        last_list_type.length -= number
                        level -= number
                    }
                    result += d
                }
                result += (last_list_type[last_list_type.length - 1] === "<ul>"
                    ? "</ul>" : "</ol>").repeat(level + 1)
            }
            else if (v.type === "paragraph") { // 段落
                v.string = v.string.replaceAll(/  $/gm, "<br>")
                    .replaceAll("\n", "")
                result = "<p>" + v.string + "</p>"
            }
            else if (v.type === "table") { // 表格
                let alignment = []
                // 获取对齐方式
                let aligns = v.string.match(/(?<=^.+\n).+/g)[0]
                let strArray = aligns.match(/((?<=\|).+?(?=\|))/g)
                for (let k = 0; k < strArray.length; k++) {
                    let v = strArray[k]
                    if (v[0] === ":" && v[v.length - 1] === ":") { // 居中
                        alignment.push("center")
                    }
                    else if (v[0] === ":") { // 左对齐
                        alignment.push("left")
                    }
                    else { // 右对齐
                        alignment.push("right")
                    }
                }
                v.string = v.string.replace(aligns + "\n", "") // 删除
                // 捕获表格内容
                let $content = "<table>"
                let lineNumber = 0
                while (v.string !== "") {
                    let content = v.string.match(/^.+/)[0].match(/((?<=\|).+?(?=\|))/)
                    let html = ""
                    if (lineNumber === 0) { // 如果是表头
                        for (let k = 0; k < content.length; k++) {
                            html += "<th style='text-align: " + alignment[k] + ";'>" + content[k] + "</th>"
                        }
                        v.string = v.string.replace(/^.+\n?/g, "")
                        html = "<thead><tr>" + html + "</tr></thead><tbody>"
                    }
                    else {
                        for (let k = 0; k < content.length; k++) {
                            html += "<td style='text-align: " + alignment[k] + ";'>" + content[k] + "</td>"
                        }
                        v.string = v.string.replace(/^.+\n?/g, "")
                        html = "<tr>" + html + "</tr>"
                    }
                    lineNumber++
                    $content += html
                }
                $content += "</tbody></table>"
                result = $content
            }
            ret += result
        }
        return ret
    }
}

