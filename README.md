# MarkdownParser

MarkdownParser是一个Javascript实现的Markdown解析器.

MarkdownParser可以嵌入静态网页中，以解析Markdown文档.

## 使用

直接复制 `compressed.min.js` 文件即可，大小约7.4kb.

在页面中使用 :

```javascript
let doc = new MarkdownDoc(content) // content: Markdown文档内容
document.write(doc.parseDocument()) // 输出内容
```

目前可能有某些bug，但是正常的文档可以流畅解析，在测试中尚未发现bug.

## 缺陷

MarkdownParser可能无法正常解析一些语法，这些语法未经过测试，可能会导致整个页面无响应.

以下列出了所有不受支持的内容：

| 不受支持的内容 | 使用导致的后果 |
| :--- | :--- |
| 列表镶嵌代码块 | 无效果 |
| 列表镶嵌引用 | 无效果 |
| 列表镶嵌标题 | 无效果 |
| 不空行的不标准文档 | 页面无响应 |
| 定义列表 | 无效果 |
| 任务列表 | 无效果 |
| 标题编号 | 无效果 |

此外，不要大规模使用引用块镶嵌，引用块镶嵌使用递归实现，会严重拖慢速度.

---------

QQ: 2820795095

欢迎 Pull Request.
