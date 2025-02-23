# markdownlint

以下是对 `.markdownlint.json` 文件中各个设置的详细解释：

```json
{
 "code-block-style": {
  "style": "fenced"
 },
 "code-fence-style": {
  "style": "backtick"
 },
 "emphasis-style": {
  "style": "asterisk"
 },
 "fenced-code-language": {
  "allowed_languages": [
   "ini",
   "json",
   "jsonc",
   "markdown"
  ],
  "language_only": true
 },
 "heading-style": {
  "style": "atx"
 },
 "hr-style": {
  "style": "---"
 },
 "line-length": false,
 "link-image-style": {
  "autolink": false,
  "collapsed": false,
  "shortcut": false,
  "url_inline": false
 },
 "no-duplicate-heading": {
  "siblings_only": true
 },
 "ol-prefix": {
  "style": "ordered"
 },
 "proper-names": {
  "code_blocks": false,
  "names": [
   "CommonMark",
   "Ctrl",
   "JavaScript",
   "Markdown",
   "markdown-it",
   "markdownlint",
   "Node.js",
   "Shift",
   "Visual Studio Code"
  ] 
 },
 "required-headings": {
  "headings": [
   "# markdownlint",
   "## Introduction",
   "## Install",
   "## Use",
   "## Rules",
   "## Commands",
   "### Fix",
   "### Workspace",
   "### Disable",
   "## Configure",
   "### markdownlint.config",
   "### markdownlint.focusMode",
   "### markdownlint.run",
   "### markdownlint.customRules",
   "### markdownlint.lintWorkspaceGlobs",
   "## Suppress",
   "## Snippets",
   "## Security",
   "## History"
  ]
 },
 "strong-style": {
  "style": "asterisk"
 },
 "table-pipe-style": {
  "style": "leading_and_trailing"
 },
 "ul-style": {
  "style": "asterisk"
 }
}
```

## 各设置解释

1. **`code-block-style`**:
   * **`style`**: 设置代码块的样式为“fenced”，即使用三重反引号（```）来定义代码块。

2. **`code-fence-style`**:
   * **`style`**: 指定代码围栏的样式为“backtick”，即使用反引号（`）作为代码块的边界。

3. **`emphasis-style`**:
   * **`style`**: 设置强调文本的样式为“asterisk”，即使用星号（*）来表示强调文本。

4. **`fenced-code-language`**:
   * **`allowed_languages`**: 指定允许的代码语言，包括 `ini`、`json`、`jsonc` 和 `markdown`。
   * **`language_only`**: 设置为 `true`，表示只允许语言标识符，不允许其他内容。

5. **`heading-style`**:
   * **`style`**: 设置标题的样式为“atx”，即使用井号（#）来表示标题。

6. **`hr-style`**:
   * **`style`**: 设置水平线的样式为“---”，即使用三个连字符表示水平线。

7. **`line-length`**:
   * **`false`**: 禁用行长度检查，允许行长度超过默认限制。

8. **`link-image-style`**:
   * **`autolink`**: 设置为 `false`，表示不自动链接 URL。
   * **`collapsed`**: 设置为 `false`，表示不使用折叠链接。
   * **`shortcut`**: 设置为 `false`，表示不使用快捷链接。
   * **`url_inline`**: 设置为 `false`，表示不使用内联 URL。

9. **`no-duplicate-heading`**:
   * **`siblings_only`**: 设置为 `true`，表示只检查同级标题的重复性。

10. **`ol-prefix`**:
    * **`style`**: 设置有序列表的前缀样式为“ordered”，即使用数字作为前缀。

11. **`proper-names`**:
    * **`code_blocks`**: 设置为 `false`，表示不检查代码块中的专有名词。
    * **`names`**: 列出允许的专有名词，包括 `CommonMark`、`Ctrl`、`JavaScript`、`Markdown`、`markdown-it`、`markdownlint`、`Node.js`、`Shift` 和 `Visual Studio Code`。

12. **`required-headings`**:
    * **`headings`**: 列出文档中必须存在的标题，以确保文档结构的完整性。

13. **`strong-style`**:
    * **`style`**: 设置强烈强调文本的样式为“asterisk”，即使用星号（**）来表示强烈强调文本。

14. **`table-pipe-style`**:
    * **`style`**: 设置表格的管道样式为“leading_and_trailing”，即在表格的每一行前后都使用管道符号（|）。

15. **`ul-style`**:
    * **`style`**: 设置无序列表的样式为“asterisk”，即使用星号（*）作为列表项的标记。

### 总结

这个 `.markdownlint.json` 文件定义了一系列规则和样式，以确保 Markdown 文档的一致性和可读性。通过这些设置，您可以控制代码块、标题、列表、链接等的格式，从而提高文档的质量。
