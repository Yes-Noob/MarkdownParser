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
        // 获取转义字符并替换为保留转义符
        let escapeChar = this.doc.match(/\\./g) || []
        let doc = this.doc.replaceAll(/\\./g, ESCAPE)
        // 解析token
        let html = this.parseMarkdownTokens(doc)
        // 解析关键字
        html = this.parseKeywords(html)
        // 替换转义字符
        for (let v of escapeChar) {
            html = html.replace(ESCAPE, v[1])
        }
        // 返回
        return html
    }

    /** 解析markdown文档的所有关键词汇
     * @param {string} doc
     * @param {string} 解析后的文档
     */
    parseKeywords(doc) {
        // 图片
        {
            let text = doc.match(/!\[.*?\]\(.*( ".*?")?\)/g) || []
            for (let v of text) {
                let alt = v.match(/(?<=!\[).*?(?=\])/)[0]
                let src = v.match(/(?<=\().+?(?= |\))/)[0]
                let title = v.match(/((?<=").*?(?="))?/)[0]
                let html = IMG.replace("$alt", alt)
                    .replace("$src", src)
                    .replace("$title", title)
                doc = doc.replace(/!\[.*?\]\(.*( ".*?")?\)/, html)
            }
        }
        // 链接1
        {
            let text = doc.match(/(?<!!)\[.*?\]\(.*\)/g) || []
            for (let v of text) {
                let content = v.match(/(?<=\[).*?(?=\])/)[0]
                let href = v.match(/(?<=\().+?(?=\))/)[0]
                let html = A.replace("$href", href)
                    .replace("$content", content)
                doc = doc.replace(/(?<!!)\[.*?\]\(.*\)/, html)
            }
        }
        // 链接2
        {
            let text = doc.match(/(?<=<)https?:.+?(?=>)/g) || []
            for (let v of text) {
                let html = "<a href='" + v + "'>" + v + "</a>"
                doc = doc.replace(/<https?:.+?>/, html)
            }
        }
        // 粗斜体
        {
            let text = doc.match(/(?<=\*\*\*).+?(?=\*\*\*)/g) || []
            for (let v of text) {
                let html = BI.replace("$content", v)
                doc = doc.replace(/\*\*\*.+?\*\*\*/, html)
            }
        }
        // 粗斜体2
        {
            let text = doc.match(/(?<=___).+?(?=___)/g) || []
            for (let v of text) {
                let html = BI.replace("$content", v)
                doc = doc.replace(/___.+?___/, html)
            }
        }
        // 粗体
        {
            let text = doc.match(/(?<=\*\*).+?(?=\*\*)/g) || []
            for (let v of text) {
                let html = B.replace("$content", v)
                doc = doc.replace(/\*\*.+?\*\*/, html)
            }
        }
        // 粗体2
        {
            let text = doc.match(/(?<=__).+?(?=__)/g) || []
            for (let v of text) {
                let html = B.replace("$content", v)
                doc = doc.replace(/__.+?__/, html)
            }
        }
        // 斜体
        {
            let text = doc.match(/(?<=\*).+?(?=\*)/g) || []
            for (let v of text) {
                let html = I.replace("$content", v)
                doc = doc.replace(/\*.+?\*/, html)
            }
        }
        // 斜体2
        {
            let text = doc.match(/(?<=_).+?(?=_)/g) || []
            for (let v of text) {
                let html = I.replace("$content", v)
                doc = doc.replace(/_.+?_/, html)
            }
        }
        // 删除线
        {
            let text = doc.match(/(?<=~~).+?(?=~~)/g) || []
            for (let v of text) {
                let html = DEL.replace("$content", v)
                doc = doc.replace(/~~.+?~~/, html)
            }
        }
        // 小代码块
        {
            let text = doc.match(/(?<=`).+?(?=`)/g) || []
            for (let v of text) {
                let html = CODE.replace("$content", v)
                doc = doc.replace(/`.+?`/, html)
            }
        }
        // 脚注
        {
            let text = doc.match(/(?<=\[\^).+(?=\])/g) || []
            for (let v of text) {
                let html = FOOTNOTE.replace("$content", v)
                doc = doc.replace(/\[\^.+\]/, html)
            }
        }
        return doc
    }

    /** 解析一个Markdown文档的token元素
     * @param {string} doc 
     * @return {Array} token集合
     */
    parseMarkdownTokens(doc) {
        let ret = ""
        while (doc !== "") { // 开始解析全部token
            // 从头开始匹配token字符
            if (ENTER.test(doc)) { // 空行
                doc = doc.replace(ENTER, SPACE)
            }
            else if (HEADER.test(doc)) { // 标题
                let token = doc.match(HEADER)[0]
                doc = doc.replace(token, SPACE) // 删除
                // 解析
                ret += parseHeader(token)
            }
            else if (BLOCKQUOTE.test(doc)) { // 引用块
                let token = doc.match(BLOCKQUOTE)[0]
                doc = doc.replace(token, SPACE) // 删除
                // 将引用块前缀的空格删去
                token = token.replaceAll("> ", ">")
                token = token.replaceAll(/^(?=[^>])/gm, ">")
                // 解析
                ret += parseBlockquote(this, token)
            }
            else if (HR.test(doc)) { // 水平线
                doc = doc.replace(HR, SPACE) // 删除
                ret += "<hr>"
            }
            else if (HEADER2.test(doc)) { // 水平线风格标题
                let token = doc.match(HEADER2)[0]
                doc = doc.replace(token, SPACE) // 删除
                // 解析
                ret += parseHeaderByLine(token)
            }
            else if (CODECHUNK.test(doc)) { // 代码块
                let token = doc.match(CODECHUNK)[0]
                doc = doc.replace(token, SPACE) // 删除
                let lang = token.match(/(?<=```).*/)[0]
                // 解析
                ret += parseCodechunk(token, lang)
            }
            else if (LIST.test(doc)) { // 无序列表或有序列表
                let token = doc.match(LIST)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = token.replaceAll(/(?<=^ *)(\+|\*) /gm, "- ")
                token = token.replaceAll(/(  )$/gm, "<br>")
                // 解析
                ret += parseList(this, token)
            }
            else if (TABLE.test(doc)) { // 表格
                let token = doc.match(TABLE)[0]
                doc = doc.replace(token, SPACE) // 删除
                // 解析
                ret += parseTable(token)
            }
            else if (INLINECODECHUNK.test(doc)) { // 内联代码块
                let token = doc.match(INLINECODECHUNK)[0]
                doc = doc.replace(token, SPACE)
                // 解析
                ret += parseInlineCodechunk(token)
            }
            else if (PARAGHAPH.test(doc)) { // 段落
                let token = doc.match(PARAGHAPH)[0]
                if (/^((-|\*|\+|!|    |\d\.) .+)/gm.test(token)) { // 兼容不标准的段落
                    token = token.substring(0, token.indexOf(token.match(/^(-|\*|\+|!|    |\d\. .+)/gm)[0]))
                }
                doc = doc.replace(token, SPACE) // 删除
                token = token.replaceAll(/(  )$/gm, "<br>")
                // 解析
                ret += parseParagraph(token)
            }
        }
        return ret
    }

}

