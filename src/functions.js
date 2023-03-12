// 解析标题
function parseHeader(v_string) {
    let result = ""
    /** 将标题内容放进标签里
     * @param {string} str v_string
     * @param {int} level 标题等级
     * @return {string} 标题的html标签形式
     */
    let setHeaderInTag = function (str, level) {
        str = str.substring(level + 1, v_string.length)
        return "<h" + level + ">" + str + "</h" + level + ">"
    }
    if (/^######/.test(v_string)) {
        result = setHeaderInTag(v_string, 6)
    }
    else if (/^#####/.test(v_string)) {
        result = setHeaderInTag(v_string, 5)
    }
    else if (/^####/.test(v_string)) {
        result = setHeaderInTag(v_string, 4)
    }
    else if (/^###/.test(v_string)) {
        result = setHeaderInTag(v_string, 3)
    }
    else if (/^##/.test(v_string)) {
        result = setHeaderInTag(v_string, 2)
    }
    else if (/^#/.test(v_string)) {
        result = setHeaderInTag(v_string, 1)
    }
    return result
}

// 解析引用块
function parseBlockquote(self, v_string) {
    v_string = v_string.replaceAll(/^>/gm, "") // 减少一个层次
    let htmlContent = self.parseMarkdownTokens(v_string)
    return "<blockquote>" + htmlContent + "</blockquote>"
}

// 解析水平线标题
function parseHeaderByLine(v_string) {
    let result = ""
    if (/(-)$/.test(v_string)) {
        v_string = v_string.substring(0, v_string.indexOf("\n"))
        result = "<h1>" + v_string + "</h1>"
    }
    else {
        v_string = v_string.substring(0, v_string.indexOf("\n"))
        result = "<h2>" + v_string + "</h2>"
    }
    return result
}

// 解析代码块
function parseCodechunk(v_string, v_lang) {
    let result = ""
    v_string = v_string.substring(v_string.indexOf("\n") + 1, v_string.length - 4)
    if (v_lang !== "") {
        result = "<pre><code class='language-" + v_lang + "'>" + v_string + "</code></pre>"
    }
    else {
        result = "<pre><code class='nohighlight'>" + v_string + "</code></pre>"
    }
    return result
}

// 解析列表
function parseList(self, v_string) {
    let result = "" // 结果
    let all = v_string.match(/^( *(-|\d\.) .+(\n(?! *(-|\d\.) ).+)*)/gm) // 列表每个token行的内容
    let level = -1 // 缩进等级
    let last_list_type = [] // 之前的列表类型（无序列表或有序列表）
    for (let content of all) { // 遍历列表所有行
        let indentNumber = content.match(/^ */g)[0].length / self.indent // 当前行缩进数量
        let d = "<li>" + content.match(/(?<=^( *(-|\d\.) )).+(\n(?! *(-|\d\.) ).+)*/)[0] + "</li>" // 列表文字内容
        if (indentNumber > level) { // 如果缩进量大于上一个列表缩进量
            let isUlList = /(?<=^( *))- /.test(content) // 是否是无序列表
            let tag = (isUlList ? "<ul>" : "<ol>") // html标签（<ul>或<ol>）
            last_list_type.push(tag) // 将本次列表类型记录
            d = tag + d // 在内容前方添加标签
            level++
        }
        else if (indentNumber < level) { // 如果缩进量小于上一个列表缩进量
            let number = level - indentNumber // 相差的缩进量
            let k = last_list_type.length - 1 // 复制当前索引
            while (number !== 0) { // 循环直到number为0
                let tag = (last_list_type[k] === "<ul>") ? "</ul>" : "</ol>"
                d = tag + d // 追加闭合标签
                last_list_type.length--
                number--
                level--
                k--
            }
        }
        result += d // 在末尾添加内容
    }
    for (let v of last_list_type) {// 结尾处追加上结束标签
        result += (v === "<ul>") ? "</ul>" : "</ol>"
    }
    return result
}

// 解析段落
function parseParagraph(v_string) {
    v_string = v_string.replaceAll(/  $/gm, "<br>").replaceAll("\n", "")
    result = "<p>" + v_string + "</p>"
    return result
}

// 解析表格
function parseTable(v_string) {
    let alignment = []
    // 获取对齐方式
    let aligns = v_string.match(/(?<=^.+\n).+/g)[0]
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
    v_string = v_string.replace(aligns + "\n", "") // 删除
    // 捕获表格内容
    let result = "<table>"
    let lineNumber = 0
    while (v_string !== "") {
        let content = v_string.match(/^.+/)[0].match(/((?<=\|).+?(?=\|))/)
        let html = ""
        if (lineNumber === 0) { // 如果是表头
            for (let k = 0; k < content.length; k++) {
                html += "<th style='text-align: " + alignment[k] + ";'>" + content[k] + "</th>"
            }
            v_string = v_string.replace(/^.+\n?/g, "")
            html = "<thead><tr>" + html + "</tr></thead><tbody>"
        }
        else {
            for (let k = 0; k < content.length; k++) {
                html += "<td style='text-align: " + alignment[k] + ";'>" + content[k] + "</td>"
            }
            v_string = v_string.replace(/^.+\n?/g, "")
            html = "<tr>" + html + "</tr>"
        }
        lineNumber++
        result += html
    }
    result += "</tbody></table>"
    return result
}

// 解析内联代码块
function parseInlineCodechunk(v_string) {
    let content = v_string.replaceAll(/^    /gm, SPACE)
    return "<pre><code>" + content + "</code></pre>"
}
