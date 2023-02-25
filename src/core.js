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
        }
    }

    /** 解析这个Markdown文档为HTML格式
     * @return {string} 解析后的html格式
     */
    parseDocument() {
        let doc = this.parseKeywords(this.doc)
        let tokens = this.parseMarkdownToken(doc)
        // 解析token
        // pass
    }

    /** 解析markdown文档的所有关键词汇
     * @param {string} doc this.doc
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
     * @param {string} doc this.doc
     * @return {Array} token集合
     */
    parseMarkdownToken(doc) {
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
                token = { type: "blockquote", string: token }
                tokens.push(token)
            }
            else if (HR.test(doc)) { // 水平线
                let token = doc.match(HR)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "hr", string: "" }
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
            else if (UL.test(doc)) { // 无序列表
                let token = doc.match(UL)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "ul", string: token }
                tokens.push(token)
            }
            else if (OL.test(doc)) { // 有序列表
                let token = doc.match(OL)[0]
                doc = doc.replace(token, SPACE) // 删除
                token = { type: "ol", string: token }
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
        // pass
    }
}

