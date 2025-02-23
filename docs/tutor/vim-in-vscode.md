# Vim 在 VSCode 中的使用

![VSCodeVim](https://raw.githubusercontent.com/VSCodeVim/Vim/master/images/icon.png)

**VSCodeVim**

**Vim emulation for Visual Studio Code**

<!-- TODO: use pgns or something; otherwise vsce won't package it
[![](https://vsmarketplacebadge.apphb.com/version/vscodevim.vim.svg)](http://aka.ms/vscodevim)
[![](https://vsmarketplacebadge.apphb.com/installs-short/vscodevim.vim.svg)](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
[![](https://github.com/VSCodeVim/Vim/workflows/build/badge.svg?branch=master)](https://github.com/VSCodeVim/Vim/actions?query=workflow%3Abuild+branch%3Amaster)
-->

VSCodeVim is a Vim emulator for [Visual Studio Code](https://code.visualstudio.com/).

* 🚚有关支持的VIM功能的完整列表，请参考我们[路线图](ROADMAP.md)。
* 📃我们的[变更日志](CHANGELOG.md)列出了版本之间的中断/主要/次要更新。
* 🚚在[GitHub](https://github.com/VSCodeVim/Vim/issues)上报告缺失的功能/错误。

## Table of Contents

* [💾 Installation](#-installation)
  * [Mac](#mac)
  * [Windows](#windows)
* [⚙️ Settings](#️-settings)
  * [Quick Example](#quick-example)
  * [VSCodeVim settings](#vscodevim-settings)
  * [Neovim Integration](#neovim-integration)
  * [Key Remapping](#key-remapping)
    * [`"vim.insertModeKeyBindings"`/`"vim.normalModeKeyBindings"`/`"vim.visualModeKeyBindings"`/`"vim.operatorPendingModeKeyBindings"`](#viminsertmodekeybindingsvimnormalmodekeybindingsvimvisualmodekeybindingsvimoperatorpendingmodekeybindings)
    * [`"vim.insertModeKeyBindingsNonRecursive"`/`"normalModeKeyBindingsNonRecursive"`/`"visualModeKeyBindingsNonRecursive"`/`"operatorPendingModeKeyBindingsNonRecursive"`](#viminsertmodekeybindingsnonrecursivenormalmodekeybindingsnonrecursivevisualmodekeybindingsnonrecursiveoperatorpendingmodekeybindingsnonrecursive)
    * [Debugging Remappings](#debugging-remappings)
    * [Remapping more complex key combinations](#remapping-more-complex-key-combinations)
  * [Vim modes](#vim-modes)
  * [Vim settings](#vim-settings)
* [.vimrc support](#vimrc-support)
* [🖱️ Multi-Cursor Mode](#️-multi-cursor-mode)
* [🔌 Emulated Plugins](#-emulated-plugins)
  * [vim-airline](#vim-airline)
  * [vim-easymotion](#vim-easymotion)
  * [vim-surround](#vim-surround)
  * [vim-commentary](#vim-commentary)
  * [vim-indent-object](#vim-indent-object)
  * [vim-sneak](#vim-sneak)
  * [CamelCaseMotion](#camelcasemotion)
  * [Input Method](#input-method)
  * [ReplaceWithRegister](#replacewithregister)
  * [vim-textobj-entire](#vim-textobj-entire)
  * [vim-textobj-arguments](#vim-textobj-arguments)
* [🎩 VSCodeVim tricks!](#-vscodevim-tricks)
* [📚 F.A.Q.](#-faq)
* [❤️ Contributing](#️-contributing)
  * [Special shoutouts to:](#special-shoutouts-to)

## 💾 Installation

VSCodeVim can be installed via the VS Code [Marketplace](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim).

### Mac

To enable key-repeating, execute the following in your Terminal, log out and back in, and then restart VS Code:

```sh
defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false              # For VS Code
defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false      # For VS Code Insider
defaults write com.vscodium ApplePressAndHoldEnabled -bool false                      # For VS Codium
defaults write com.microsoft.VSCodeExploration ApplePressAndHoldEnabled -bool false   # For VS Codium Exploration users
defaults delete -g ApplePressAndHoldEnabled                                           # If necessary, reset global default
```

We also recommend increasing Key Repeat and Delay Until Repeat settings in *System Preferences -> Keyboard*.

### Windows

Like real vim, VSCodeVim will take over your control keys. This behavior can be adjusted with the [`useCtrlKeys`](#vscodevim-settings) and [`handleKeys`](#vscodevim-settings) settings.

## ⚙️ Settings

The settings documented here are a subset of the supported settings; the full list is described in the `Contributions` tab of VSCodeVim's [extension details page](https://code.visualstudio.com/docs/editor/extension-gallery#_extension-details), which can be found in the [extensions view](https://code.visualstudio.com/docs/editor/extension-gallery) of VS Code.

### Quick Example

Below is an example of a [settings.json](https://code.visualstudio.com/Docs/customization/userandworkspace) file with settings relevant to VSCodeVim:

```json
{
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-f>": false
  },

  "// To improve performance",
  "extensions.experimental.affinity": {
    "vscodevim.vim": 1
  }
}
```

### VSCodeVim settings

These settings are specific to VSCodeVim.

| Setting                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                        | Type    | Default Value                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------- |
| vim.changewordscludeswhitespace |更改单词时包括尾随的空格。这将配置`cw`行动持续为兄弟姐妹（`yw`和`dw`），而不是扮演`ce`。|布尔| false |
| vim.cursorStylePerMode.*{Mode}*  |为*{Mode}*配置特定的光标样式。省略的模式将使用[默认光标类型](https://github.com/VSCodeVim/Vim/blob/4a6fde6dbd4d1fac1f204c0dc27c32883651ef1a/src/mode/mode.ts#L34)。支持的光标：行、块、下划线、行细、块轮廓和下划线细。|字符串| None |
| vim.digraphs.*{shorthand}*       | 设置自定义缩写，可以覆盖默认缩写。条目应将两个字符的缩写映射到描述性字符串和UTF16代码点。示例：`"R!": ["", [55357, 56960]]`                                                                                                                                                                                                                  | Object  | `{"R!": ["🚀", [0xD83D, 0xDE80]]`                             |
| vim.disableExtension |禁用VSCODEVIM扩展。此设置也可以使用`toggleVim`命令面板中的命令 |布尔 |假 |
| vim.handleKeys | Delegate configured keys to be handled by VS Code... | String | `"<C-d>": true`  `"<C-s>": false`  `"<C-z>": false` |
| vim.overrideCopy |使用我们自己的命令覆盖 VS Code 的复制命令，该命令可与 VSCodeVim 一起正常工作。如果 cmd-c/Ctrl-c 给您带来问题，请将其设置为 false 并抱怨[这里](https://github.com/Microsoft/vscode/issues/217)。                                                                                                                                                                                                                   |布尔 |假 |
| vim.usesystemclipboard |使用系统剪贴板寄存器（`*`）作为默认寄存器|布尔| false |
| vim.searchHighlightColor | 非当前搜索匹配的背景颜色 |字符串|`findMatchHighlightBackground`主题颜色 |
| vim.searchHighlightTextColor | 非当前搜索匹配的前景色 |字符串| None |
| vim.searchMatchColor | 当前搜索匹配的背景颜色 | String | `findMatchBackground` ThemeColor |
| vim.searchMatchTextColor | 当前搜索匹配的前景色 | String | None |
| vim.substitutionColor | 当`vim.inccommand`启用时，替换文本的背景颜色 | String | `#50f01080` |
| vim.substitutionTextColor | 当`vim.inccommand`启用时，替换文本的前景色 | String | None |
| vim.startInInsertMode | 在插入模式而不是正常模式开始 |布尔| false |
| vim.useCtrlKeys | 启用 Vim Ctrl 键覆盖常见的 VS Code 操作，如复制、粘贴、查找等。 |布尔| true |
| vim.visualstar | 在可视模式下，使用当前选择开始搜索`*`或`#` |布尔| false |
| vim.highlightedyank.enable | 拉动时启用突出显示 |布尔 |假 |
| vim.highlightedyank.color | 设置高亮显示的颜色 | String | `rgba(250, 240, 170, 0.5)` |
| vim.highlightedyank.duration | 设置高亮显示的持续时间 | Number | 200 |

### Neovim Integration

> ：警告：实验功能。请留下有关Neovim整合的反馈[这里](https://github.com/VSCodeVim/Vim/issues/1735)。

要利用Neovim进行Ex-commands，

1. 安装[neovim](https://github.com/neovim/neovim/wiki/Installing-Neovim)
2. 修改以下配置：

| Setting                 | Description                                                                                                                                            | Type    | Default Value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------- |
| vim.enableneovim |启用Neovim |布尔| false |
| vim.neovimPath          | neovim可执行文件的完整路径。如果为空，则自动检查PATH环境变量以获取neovim路径。|字符串| |
| vim.neovimUseConfigFile | 如果为true，Neovim将加载由`vim.neovimConfigPath`指定的配置文件。这是必要的，如果你想让Neovim能够使用自己的插件。|布尔| false |
| vim.neovimConfigPath    | Neovim将加载为配置文件的路径。如果留空，Neovim将在其默认位置搜索。|字符串| |

以下是一些关于如何使用Neovim整合的想法：

* [The power of g](http://vim.wikia.com/wiki/Power_of_g)
* [The :normal command](https://vi.stackexchange.com/questions/4418/execute-normal-command-over-range)
* Faster search and replace!

### Key Remapping

自定义重新映射是根据每种模式定义的。

#### `"vim.insertModeKeyBindings"`/`"vim.normalModeKeyBindings"`/`"vim.visualModeKeyBindings"`/`"vim.operatorPendingModeKeyBindings"`

* 用于插入、正常、操作和可视模式的键绑定覆盖。
* 键绑定覆盖可以包括`"before"`, `"after"`, `"commands"`, 和`"silent"`.

* 绑定`jj`到`<Esc>`在插入模式：

```json
    "vim.insertModeKeyBindings": [
        {
            "before": ["j", "j"],
            "after": ["<Esc>"]
        }
    ]
```

* 绑定`£`到goto上一个光标下的整个单词：

```json
    "vim.normalModeKeyBindings": [
        {
            "before": ["£"],
            "after": ["#"]
        }
    ]
```

* 绑定`:`显示命令面板，并在状态栏上不显示消息：

```json
    "vim.normalModeKeyBindings": [
        {
            "before": [":"],
            "commands": [
                "workbench.action.showCommands",
            ],
            "silent": true
        }
    ]
```

* 绑定`<leader>m`添加书签，并绑定`<leader>b`打开所有书签列表（使用[书签](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks)扩展）：

```json
    "vim.normalModeKeyBindings": [
        {
            "before": ["<leader>", "m"],
            "commands": [
                "bookmarks.toggle"
            ]
        },
        {
            "before": ["<leader>", "b"],
            "commands": [
                "bookmarks.list"
            ]
        }
    ]
```

* 绑定`ctrl+n`关闭搜索高亮，并绑定`<leader>w`保存当前文件：

```json
    "vim.normalModeKeyBindings": [
        {
            "before":["<C-n>"],
            "commands": [
                ":nohl",
            ]
        },
        {
            "before": ["leader", "w"],
            "commands": [
                "workbench.action.files.save",
            ]
        }
    ]
```

* 绑定`{`到`w`在操作模式下，使`y{`和`d{`像`yw`和`dw`一样工作：

```json
    "vim.operatorPendingModeKeyBindings": [
        {
            "before": ["{"],
            "after": ["w"]
        }
    ]
```

* 绑定`L`到`$`和`H`到`^`在操作模式下，使`yL`和`dH`像`y$`和`d^`一样工作：

```json
    "vim.operatorPendingModeKeyBindings": [
        {
            "before": ["L"],
            "after": ["$"]
        },
        {
            "before": ["H"],
            "after": ["^"]
        }
    ]
```

* 绑定`>`和`<`在可视模式下缩进/缩进行（可重复）：

```json
    "vim.visualModeKeyBindings": [
        {
            "before": [
                ">"
            ],
            "commands": [
                "editor.action.indentLines"
            ]
        },
        {
            "before": [
                "<"
            ],
            "commands": [
                "editor.action.outdentLines"
            ]
        },
    ]
```

* 绑定`<leader>vim`到克隆这个仓库到选定的位置：

```json
    "vim.visualModeKeyBindings": [
        {
            "before": [
                "<leader>", "v", "i", "m"
            ],
            "commands": [
                {
                    "command": "git.clone",
                    "args": [ "https://github.com/VSCodeVim/Vim.git" ]
                }
            ]
        }
    ]
```

#### `"vim.insertModeKeyBindingsNonRecursive"`/`"normalModeKeyBindingsNonRecursive"`/`"visualModeKeyBindingsNonRecursive"`/`"operatorPendingModeKeyBindingsNonRecursive"`

* 用于插入、正常和可视模式的非递归键绑定覆盖
* 示例：交换两个键的含义，如`j`到`k`和`k`到`j`，以交换光标上移和下移命令。注意，如果尝试正常绑定，`j`将被替换为`k`，`k`将被替换为`j`，依此类推，无限循环。当发生`maxmapdepth`次（默认1000）时，将抛出错误消息“E223 Recursive Mapping”。使用非递归变体停止此递归扩展：

```json
    "vim.normalModeKeyBindingsNonRecursive": [
        {
            "before": ["j"],
            "after": ["k"]
        },
        {
            "before": ["k"],
            "after": ["j"]
        }
    ]
```

* 绑定`(`到'i('在操作模式下，使'y('和'c('像'yi('和'ci('一样工作：

```json
    "vim.operatorPendingModeKeyBindingsNonRecursive": [
        {
            "before": ["("],
            "after": ["i("]
        }
    ]
```

* 绑定`p`在可视模式下粘贴而不覆盖当前寄存器：

```json
    "vim.visualModeKeyBindingsNonRecursive": [
        {
            "before": [
                "p",
            ],
            "after": [
                "p",
                "g",
                "v",
                "y"
            ]
        }
    ],
```

#### Debugging Remappings

1. 将扩展的日志级别调整为“debug”并打开输出窗口：
    1. 从命令面板运行`Developer: Set Log Level`。
    2. 选择`Vim`，然后选择`Debug`。
    3. 运行`Developer: Reload window`。
    4. 在底部面板，打开`Output`标签，然后从下拉菜单中选择`Vim`。
2. 你的配置正确吗？

    每次加载重新映射的配置时，它都会记录到Vim输出面板。你看到任何错误吗？

    ```shell
    debug: Remapper: normalModeKeyBindingsNonRecursive. before=0. after=^.
    debug: Remapper: insertModeKeyBindings. before=j,j. after=<Esc>.
    error: Remapper: insertModeKeyBindings. Invalid configuration. Missing 'after' key or 'commands'. before=j,k.
    ```

    配置不正确的配置被忽略。

3. 扩展是否处理了你正在尝试重新映射的键？

    VSCodeVim明确告诉VS Code我们关心哪些键事件[package.json](https://github.com/VSCodeVim/Vim/blob/9bab33c75d0a53873880a79c5d2de41c8be1bef9/package.json#L62)。如果你正在尝试重新映射的键是vim/vscodevim通常不处理的键，那么最有可能的是这个扩展没有从VS Code接收到那些键事件。在Vim输出面板中，你应该看到：

    ```shell
    debug: ModeHandler: handling key=A.
    debug: ModeHandler: handling key=l.
    debug: ModeHandler: handling key=<BS>.
    debug: ModeHandler: handling key=<C-a>.
    ```

    当您按下尝试重新映射的键时，您是否看到它在此处输出？如果没有，则意味着我们不订阅这些关键事件。仍然可以使用 VSCode 的 [keybindings.json](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-reference) 重新映射这些键。

#### Remapping more complex key combinations

强烈建议使用vim命令重新映射键，如`"vim.normalModeKeyBindings"`（[见这里](#key-remapping)）。但有时普通的重新映射命令不够，因为它们不支持所有可能的键组合（例如`Alt+key`或`Ctrl+Shift+key`）。在这种情况下，可以在[keybindings.json](https://code.visualstudio.com/docs/getstarted/keybindings#_keyboard-shortcuts-reference)中创建新的键绑定。为此，请使用`CTRL+SHIFT+P`打开VSCode中的keybindings.json，然后选择`Open keyboard shortcuts (JSON)`。

您可以像这样向keybindings.json添加一个新条目：

```json
{
  "key": "YOUR_KEY_COMBINATION",
  "command": "vim.remap",
  "when": "inputFocus && vim.mode == 'VIM_MODE_YOU_WANT_TO_REBIND'",
  "args": {
    "after": ["YOUR_VIM_ACTION"]
  }
}
```

例如，要将`ctrl+shift+y`重新绑定为VSCodeVim的`yy`（复制行），请将以下内容添加到你的keybindings.json中：

```json
{
  "key": "ctrl+shift+y",
  "command": "vim.remap",
  "when": "inputFocus && vim.mode == 'Normal'",
  "args": {
    "after": ["y", "y"]
  }
}
```

如果keybindings.json是空的，请确保在文件中添加`[`和`]`方括号，因为keybindings应该在JSON数组中。

### Vim modes

以下是VSCodeVim使用的所有模式：

| Mode                  |
| --------------------- |
| Normal                |
| Insert                |
| Visual                |
| VisualBlock           |
| VisualLine            |
| SearchInProgressMode  |
| CommandlineInProgress |
| Replace               |
| EasyMotionMode        |
| EasyMotionInputMode   |
| SurroundInputMode     |
| OperatorPendingMode   |
| Disabled              |

当在[keybindings.json](https://code.visualstudio.com/docs/getstarted/keybindings)中使用["when clause context"](https://code.visualstudio.com/api/references/when-clause-contexts)重新绑定键时，了解vim当前处于哪个模式可能很有用。例如，要编写一个“when clause”，检查vim当前是否处于正常模式或可视模式，可以编写以下内容：

```json
"when": "vim.mode == 'Normal' || vim.mode == 'Visual'",
```

### Vim settings

从VIM复制的配置设置。 VIM设置以以下顺序加载：

1. `:set {setting}`
2. `vim.{setting}` from user/workspace settings.
3. VS Code settings
4. VSCodeVim default values

| Setting          | Description                                                                                                                                                                                                                                                   | Type    | Default Value                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| vim.autoindent |启动新线路时，请从当前行复制缩进|布尔| true |
| vim.gdefault     | 打开时，`:substitute` 标志 `g` 默认打开。这意味着一行中的所有匹配项都会被替换，而不是一个。当为"`:substitute"`命令赋予"`g"`标志时，这将切换所有或一个匹配的替换。| Boolean | false                                                          |
| vim.hlsearch |突出显示所有文本匹配当前搜索|布尔| false |
| vim.ignorecase |忽略搜索模式中的情况|布尔| true |
| vim.incsearch    | 在输入时显示下一个匹配项|布尔| true |
| vim.inccommand   | 在输入时显示"`:substitute"`命令的效果|字符串| `replace` |
| vim.joinspaces   | 在"."、"?"和"!"后添加两个空格，当连接或重新格式化时|布尔| true |
| vim.leader       | 定义用于键映射的键|字符串| `\` |
| vim.maxmapdepth  | 映射的最大次数，没有结果。这通常会捕获无尽的映射，例如":map x y"与":map y x"。它仍然不捕获":map g wg"，因为"w"在下一个映射完成之前被使用。| Number  | 1000                                                           |
| vim.report       | 报告更改行数的阈值。| Number  | 2                                                              |
| vim.shell        | 用于`!`和`:!`命令的shell路径。| String  | `/bin/sh` on Unix, `%COMSPEC%` environment variable on Windows |
| vim.showcmd      | 在状态栏中显示（部分）命令|布尔| true |
| vim.showmodename | 在状态栏中显示当前模式名称|布尔| true |
| vim.smartcase    | 覆盖"ignorecase"设置，如果搜索模式包含大写字符|布尔| true |
| vim.textwidth    | 使用`gq`时换行宽度| Number  | 80                                                             |
| vim.timeout      | 重映射命令的超时时间（毫秒）| Number  | 1000                                                           |
| vim. WhithWrap |允许指定的键将光标向左/右移动时，将光标位于行中的第一个/最后一个字符上时，移动到上一行。看[:help whatewrap](https://vimhelp.org/options.txt.html#%27whichwrap%27)。                               |字符串|`b,s`|

## .vimrc support

> :warning: .vimrc support is currently experimental. Only remaps are supported, and you may experience bugs. Please [report them](https://github.com/VSCodeVim/Vim/issues/new?template=bug_report.md)!

Set `vim.vimrc.enable` to `true` and set `vim.vimrc.path` appropriately.

## 🖱️ Multi-Cursor Mode

> :warning: Multi-Cursor mode is experimental. Please report issues in our [feedback thread.](https://github.com/VSCodeVim/Vim/issues/824)

Enter multi-cursor mode by:

* On OSX, `cmd-d`. On Windows, `ctrl-d`.
* `gb`, a new shortcut we added which is equivalent to `cmd-d` (OSX) or `ctrl-d` (Windows). It adds another cursor at the next word that matches the word the cursor is currently on.
* Running "Add Cursor Above/Below" or the shortcut on any platform.

Once you have multiple cursors, you should be able to use Vim commands as you see fit. Most should work; some are unsupported (ref [PR#587](https://github.com/VSCodeVim/Vim/pull/587)).

* Each cursor has its own clipboard.
* Pressing Escape in Multi-Cursor Visual Mode will bring you to Multi-Cursor Normal mode. Pressing it again will return you to Normal mode.

## 🔌 Emulated Plugins

### vim-airline

> :warning: There are performance implications to using this plugin. In order to change the status bar, we override the configurations in your workspace settings.json which results in increased latency and a constant changing diff in your working directory (see [issue#2124](https://github.com/VSCodeVim/Vim/issues/2124)).

根据当前模式更改状态栏的颜色。启用后，配置`"vim.statusBarColors"`。每个模式的颜色可以定义为`string`（仅背景）或`string[]`（背景和前景）。

```json
    "vim.statusBarColorControl": true,
    "vim.statusBarColors.normal": ["#8FBCBB", "#434C5E"],
    "vim.statusBarColors.insert": "#BF616A",
    "vim.statusBarColors.visual": "#B48EAD",
    "vim.statusBarColors.visualline": "#B48EAD",
    "vim.statusBarColors.visualblock": "#A3BE8C",
    "vim.statusBarColors.replace": "#D08770",
    "vim.statusBarColors.commandlineinprogress": "#007ACC",
    "vim.statusBarColors.searchinprogressmode": "#007ACC",
    "vim.statusBarColors.easymotionmode": "#007ACC",
    "vim.statusBarColors.easymotioninputmode": "#007ACC",
    "vim.statusBarColors.surroundinputmode": "#007ACC",
```

### vim-easymotion

基于[vim-easymotion](https://github.com/easymotion/vim-easymotion)，通过以下设置配置：

| Setting                                          | Description                                                                                              | Type    | Default Value                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------- |
| vim.easymotion                                   | 启用/禁用easymotion插件                                                                         | Boolean | false                                              |
| vim.easymotionMarkerBackgroundColor              | 标记框的背景颜色。                                                                  | String  | '#0000'                                            |
| vim.easymotionMarkerForegroundColorOneChar       | 单字符标记的字体颜色。                                                                | String  | '#ff0000'                                          |
| vim.easymotionMarkerForegroundColorTwoCharFirst  | 两个字符标记的第一个字符的字体颜色，用于区分单字符标记。 | String  | '#ffb400'                                          |
| vim.easymotionMarkerForegroundColorTwoCharSecond | 两个字符标记的第二个字符的字体颜色，用于区分连续的标记。       | String  | '#b98300'                                          |
| vim.easymotionIncSearchForegroundColor           | 搜索n个字符命令的字体颜色，用于突出显示匹配项。                        | String  | '#7fbf00'                                          |
| vim.easymotionDimColor                           | 当`#vim.easymotionDimBackground#`设置为true时，用于淡化其他文本的字体颜色。      | String  | '#777777'                                          |
| vim.easymotionDimBackground                      | 是否在标记可见时淡化其他文本。                                                     | Boolean | true                                               |
| vim.easymotionMarkerFontWeight                   | 用于标记文本的字体粗细。                                                                | String  | 'bold'                                             |
| vim.easymotionKeys                               | 用于跳转标记名称的字符。                                                                 | String  | 'hklyuiopnm,qwertzxcvbasdgjf;'                     |
| vim.easymotionJumpToAnywhereRegex                | 自定义正则表达式以匹配JumpToAnywhere运动（类似于`Easymotion_re_anywhere`）                  | String  | `\b[A-Za-z0-9]\|[A-Za-z0-9]\b\|_.\|#.\|[a-z][A-Z]` |

一旦 easymotion 处于活动状态，请使用以下命令启动动作。启动动作后，将显示文本装饰器/标记，您可以按显示的键跳转到该位置。`leader`是可配置的`\`默认情况下。

| Motion Command                      | Description                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `<leader><leader> s <char>`         | Search character                                                                                               |
| `<leader><leader> f <char>`         | Find character forwards                                                                                        |
| `<leader><leader> F <char>`         | Find character backwards                                                                                       |
| `<leader><leader> t <char>`         | Til character forwards                                                                                         |
| `<leader><leader> T <char>`         | Til character backwards                                                                                        |
| `<leader><leader> w`                | Start of word forwards                                                                                         |
| `<leader><leader> b`                | Start of word backwards                                                                                        |
| `<leader><leader> l`                | Matches beginning & ending of word, camelCase, after `_`, and after `#` forwards                               |
| `<leader><leader> h`                | Matches beginning & ending of word, camelCase, after `_`, and after `#` backwards                              |
| `<leader><leader> e`                | End of word forwards                                                                                           |
| `<leader><leader> ge`               | End of word backwards                                                                                          |
| `<leader><leader> j`                | Start of line forwards                                                                                         |
| `<leader><leader> k`                | Start of line backwards                                                                                        |
| `<leader><leader> / <char>... <CR>` | Search n-character                                                                                             |
| `<leader><leader><leader> bdt`      | Til character                                                                                                  |
| `<leader><leader><leader> bdw`      | Start of word                                                                                                  |
| `<leader><leader><leader> bde`      | End of word                                                                                                    |
| `<leader><leader><leader> bdjk`     | Start of line                                                                                                  |
| `<leader><leader><leader> j`        | JumpToAnywhere motion; default behavior matches beginning & ending of word, camelCase, after `_` and after `#` |

`<leader><leader> (2s|2f|2F|2t|2T) <char><char>` 和 `<leader><leader><leader> bd2t <char>char>` 也可用。
不同之处在于搜索所需的字符数量。
例如，`<leader><leader> 2s <char><char>` 需要两个字符，并按两个字符搜索。
此映射不是标准映射，因此建议使用自定义映射。

### vim-surround

基于[surround.vim](https://github.com/tpope/vim-surround)，插件用于处理括号、括号、引号和XML标签。

| Setting      | Description                 | Type    | Default Value |
| ------------ | --------------------------- | ------- | ------------- |
| vim.surround |启用/禁用vim-surround |布尔| true |

`t` 或 `<` 作为 `<desired>` 或 `<existing>` 将进入标签输入模式。使用 `<CR>` 而不是 `>` 完成更改标签将保留任何现有属性。

| Surround Command           | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `y s <motion> <desired>`   | 将 `desired` 环绕文本定义为 `<motion>` |
| `d s <existing>`           | 删除 `existing` 环绕                               |
| `c s <existing> <desired>` | 将 `existing` 环绕更改为 `desired`                  |
| `S <desired>`              | 在可视模式下环绕（环绕整个选择） |

一些示例：

* `"test"` 光标在引号内，输入 `cs"'` 得到 `'test'`
* `"test"` 光标在引号内，输入 `ds"` 得到 `test`
* `"test"` 光标在引号内，输入 `cs"t` 并输入 `123>` 得到 `<123>test</123>`

### vim-commentary

类似于 [vim-commentary](https://github.com/tpope/vim-commentary)，但使用 VS Code 原生的 *Toggle Line Comment* 和 *Toggle Block Comment* 功能。

使用示例：

* `gc` - 切换行注释。例如 `gcc` 切换当前行注释，`gc2j` 切换当前行和接下来的两行注释。
* `gC` - 切换块注释。例如 `gCi)` 注释括号内的所有内容。

### vim-indent-object

基于[vim 缩进对象](https://github.com/michaeljsmith/vim-indent-object)，它允许将当前缩进级别的代码块视为文本对象。对于不使用大括号括住语句的语言（例如 Python）很有用。

如果大括号/标签之间有新行，则可以视为中立的 `cib`/`ci{`/`ci[`/`cit`。

| Command        | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `<operator>ii` | 当前缩进级别                                                                               |
| `<operator>ai` | 当前缩进级别和上一行（考虑 Python 中的 `if` 语句）                          |
| `<operator>aI` | 当前缩进级别、上一行和下一行（考虑 C/C++/Java 等中的 `if` 语句） |

### vim-sneak

基于 [vim-sneak](https://github.com/justinmk/vim-sneak)，它允许跳转到任何由两个字符指定的位置。

| Setting                            | Description                                                 | Type    | Default Value |
| ---------------------------------- | ----------------------------------------------------------- | ------- | ------------- |
| vim.sneak                          | 启用/禁用 vim-sneak                                    | Boolean | false         |
| vim.sneakUseIgnorecaseAndSmartcase | 尊重 `vim.ignorecase` 和 `vim.smartcase` 进行搜索 | Boolean | false         |

一旦 sneak 处于活动状态，使用以下命令启动运动。对于运算符，sneak 使用 `z` 而不是 `s`，因为 `s` 已经被 surround 插件占用。

| Motion Command            | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `s<char><char>`           | 向前移动到 `<char><char>` 的第一个出现位置                  |
| `S<char><char>`           | 向后移动到 `<char><char>` 的第一个出现位置                 |
| `<operator>z<char><char>` | 执行 `<operator>` 向前到 `<char><char>` 的第一个出现位置  |
| `<operator>Z<char><char>` | 执行 `<operator>` 向后到 `<char><char>` 的第一个出现位置 |

### CamelCaseMotion

基于[驼峰式运动](https://github.com/bkad/CamelCaseMotion)，尽管不是精确的模拟。该插件提供了一种更简单的方法来移动camelCase和snake_case单词。

| Setting                    | Description                    | Type    | Default Value |
| -------------------------- | ------------------------------ | ------- | ------------- |
| vim.camelCaseMotion.enable | 启用/禁用 CamelCaseMotion | Boolean | false         |

一旦 CamelCaseMotion 处于活动状态，以下运动可用：

| Motion Command         | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `<leader>w`            | 向前移动到下一个 camelCase 或 snake_case 单词段 |
| `<leader>e`            | 向前移动到下一个 camelCase 或 snake_case 单词段     |
| `<leader>b`            | 向后移动到上一个 camelCase 或 snake_case 单词段 |
| `<operator>i<leader>w` | 选择/更改/删除/等。当前 camelCase 或 snake_case 单词段 |

默认情况下，`<leader>` 映射到 `\`, 例如，`d2i\w` 将删除当前和下一个 camelCase 单词段。

### Input Method

退出 Insert 模式时禁用输入方法。

| Setting                                 | Description                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `vim.autoSwitchInputMethod.enable`      | 布尔值，表示 autoSwitchInputMethod 是否开启/关闭。                                        |
| `vim.autoSwitchInputMethod.defaultIM`   | 默认输入方法。                                                                            |
| `vim.autoSwitchInputMethod.obtainIMCmd` | 获取当前输入方法键的完整路径命令。                               |
| `vim.autoSwitchInputMethod.switchIMCmd` | 切换输入方法的完整路径命令，`{im}` 是输入方法键的占位符。 |

任何第三方程序都可以用来切换输入方法。以下将使用 [im-select](https://github.com/daipeihust/im-select) 进行配置。

1. 安装 im-select（见 [安装指南](https://github.com/daipeihust/im-select#installation)）
2. 找到你的默认输入方法键

    * Mac:

      将输入方法切换为英文，然后在终端中运行以下命令：`/<path-to-im-select-installation>/im-select` 以输出默认输入方法。下表列出了 MacOS 的常见英文键盘布局。

      | Key                            | Description |
      | ------------------------------ | ----------- |
      | com.apple.keylayout.US         | U.S.        |
      | com.apple.keylayout.ABC        | ABC         |
      | com.apple.keylayout.British    | British     |
      | com.apple.keylayout.Irish      | Irish       |
      | com.apple.keylayout.Australian | Australian  |
      | com.apple.keylayout.Dvorak     | Dvorak      |
      | com.apple.keylayout.Colemak    | Colemak     |

      * Windows:

      参考 [im-select 指南](https://github.com/daipeihust/im-select#to-get-current-keyboard-locale) 了解如何发现输入方法键。通常，如果你的键盘布局是 en_US，输入方法键是 1033（en_US 的区域设置 ID）。你也可以从 [这个页面](https://www.science.co.il/language/Locale-codes.php) 找到你的区域设置 ID，其中 `LCID Decimal` 列是区域设置 ID。

1. 配置 `vim.autoSwitchInputMethod`.

    * MacOS:

      给定输入方法键 `com.apple.keylayout.US` 和 `im-select` 位于 `/usr/local/bin`。配置如下：

      ```json
      "vim.autoSwitchInputMethod.enable": true,
      "vim.autoSwitchInputMethod.defaultIM": "com.apple.keylayout.US",
      "vim.autoSwitchInputMethod.obtainIMCmd": "/usr/local/bin/im-select",
      "vim.autoSwitchInputMethod.switchIMCmd": "/usr/local/bin/im-select {im}"
      ```

    * Windows:

      给定输入方法键 `1033`（en_US）和 `im-select.exe` 位于 `D:/bin`。配置如下：

      ```json
      "vim.autoSwitchInputMethod.enable": true,
      "vim.autoSwitchInputMethod.defaultIM": "1033",
      "vim.autoSwitchInputMethod.obtainIMCmd": "D:\\bin\\im-select.exe",
      "vim.autoSwitchInputMethod.switchIMCmd": "D:\\bin\\im-select.exe {im}"
      ```

`{im}` 参数是传递给 `im-select` 的命令行选项，表示要切换的输入方法。如果使用其他程序切换输入方法，请将类似的选项添加到配置中。例如，如果程序的使用方法是 `my-program -s imKey` 切换输入方法，则 `vim.autoSwitchInputMethod.switchIMCmd` 应为 `/path/to/my-program -s {im}`。

### ReplaceWithRegister

基于 [ReplaceWithRegister](https://github.com/vim-scripts/ReplaceWithRegister)，一个简单的方法来替换现有文本与寄存器的内容。

| Setting                 | Description                        | Type    | Default Value |
| ----------------------- | ---------------------------------- | ------- | ------------- |
| vim.replaceWithRegister | 启用/禁用 ReplaceWithRegister | Boolean | false         |

一旦启用，输入 `gr`（说“go replace”），然后是一个运动来描述你要替换的文本与寄存器的内容。

| Motion Command          | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `[count]["a]gr<motion>` | 替换由运动描述的文本与寄存器的内容    |
| `[count]["a]grr`        | 替换 \[count\] 行或当前行与寄存器的内容 |
| `{Visual}["a]gr`        | 替换选择与寄存器的内容                       |

### vim-textobj-entire

类似于 [vim-textobj-entire](https://github.com/kana/vim-textobj-entire)。

添加两个有用的文本对象：

* `ae` 表示缓冲区的整个内容。
* `ie` 表示缓冲区的整个内容，不包括前导和尾随空格。

使用示例：

* `dae` - 删除缓冲区的整个内容。
* `yie` - 将缓冲区的内容复制到寄存器，不包括前导和尾随空行。
* `gUae` - 将缓冲区的整个内容转换为大写。

### vim-textobj-arguments

类似于 [targets.vim](https://github.com/wellle/targets.vim) 中的参数文本对象。它是一个处理函数中参数的简单方法。

| Motion Command | Description                        |
| -------------- | ---------------------------------- |
| `<operator>ia` | 不包括分隔符的参数。 |
| `<operator>aa` | 包括分隔符的参数。 |

使用示例：

* `cia` - 在光标处更改参数，同时保留分隔符，如逗号 `,`.
* `daa` - 删除光标下的整个参数和分隔符（如果适用）。

| Setting                             | Description                  | Type        | Default Value |
| ----------------------------------- | ---------------------------- | ----------- | ------------- |
| vim.argumentObjectOpeningDelimiters | 对象开始分隔符列表 | String list | ["(", "["]    |
| vim.argumentObjectClosingDelimiters | 对象结束分隔符列表 | String list | [")", "]"]    |
| vim.argumentObjectSeparators        | 对象分隔符列表  | String list | [","]         |

## 🎩 VSCodeVim tricks

VS Code 有很多巧妙的功能，我们尽量保留一些：

* `gd` - 跳转到定义。
* `gq` - 在视觉选择上重新格式化并换行文本，保留注释样式。非常适合格式化文档注释。
* `gb` - 在下一个找到的单词上添加另一个光标，该单词与光标下的单词相同。
* `af` - 视觉模式命令，选择越来越大的文本块。例如，如果输入 "blah (foo [bar 'ba|z'])"，则选择 'baz' 作为第一个。如果再次按 `af`，则选择 [bar 'baz']，如果第三次按 `af`，则选择 "(foo [bar 'baz'])".
* `gh` - 相当于将鼠标悬停在光标所在的位置。方便在不使用鼠标的情况下查看类型和错误消息！

## 📚 F.A.Q

* None of the native Visual Studio Code `ctrl` (e.g. `ctrl+f`, `ctrl+v`) commands work

  Set the [`useCtrlKeys` setting](#vscodevim-settings) to `false`.

* Moving `j`/`k` over folds opens up the folds

  Try setting `vim.foldfix` to `true`. This is a hack; it works fine, but there are side effects (see [issue#22276](https://github.com/Microsoft/vscode/issues/22276)).

* Key repeat doesn't work

  Are you on a Mac? Did you go through our [mac-setup](#mac) instructions?

* There are annoying intellisense/notifications/popups that I can't close with `<esc>`! Or I'm in a snippet and I want to close intellisense

  Press `shift+<esc>` to close all of those boxes.

* How can I use the commandline when in Zen mode or when the status bar is disabled?

  This extension exposes a remappable command to show a VS Code style quick-pick version of the commandline, with more limited functionality. This can be remapped as follows in VS Code's keybindings.json settings file.

  ```json
  {
    "key": "shift+;",
    "command": "vim.showQuickpickCmdLine",
    "when": "editorTextFocus && vim.mode != 'Insert'"
  }
  ```

  Or for Zen mode only:

  ```json
  {
    "key": "shift+;",
    "command": "vim.showQuickpickCmdLine",
    "when": "inZenMode && vim.mode != 'Insert'"
  }
  ```

* 如何在启用自动换行时按每个显示行移动光标？

  如果启用自动换行，并且希望在按 <kbd>j</kbd>, <kbd>k</kbd>, <kbd>↓</kbd> 或 <kbd>↑</kbd> 时将光标移动到每个换行行，请在 VS Code 的 keybindings.json 设置文件中设置以下内容。

  <!-- prettier-ignore -->
  ```json
  {
    "key": "up",
    "command": "cursorUp",
    "when": "editorTextFocus && vim.active && !inDebugRepl && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
  },
  {
    "key": "down",
    "command": "cursorDown",
    "when": "editorTextFocus && vim.active && !inDebugRepl && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
  },
  {
    "key": "k",
    "command": "cursorUp",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode == 'Normal' && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
  },
  {
    "key": "j",
    "command": "cursorDown",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode == 'Normal' && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
  }
  ```

  **注意事项:** 此解决方案恢复了 <kbd>j</kbd> 和 <kbd>k</kbd> 键的默认 VS Code 行为，因此像 `10j` 这样的运动将不起作用。如果需要这些运动，[其他性能较低的选项存在](https://github.com/VSCodeVim/Vim/issues/2924#issuecomment-476121848)。

* 我已将 Escape 和 Caps Lock 与 setxkbmap 交换，但 VSCodeVim 不尊重交换

  这是一个 [VS Code 已知问题](https://github.com/microsoft/vscode/issues/23991)，作为解决方法，可以设置 `"keyboard.dispatch": "keyCode"` 并重启 VS Code。

* VSCodeVim 太慢了！

  你可以尝试添加以下 [设置](https://github.com/microsoft/vscode/issues/75627#issuecomment-1078827311)，并重新加载/重启 VSCode：

  ```json
  "extensions.experimental.affinity": {
    "vscodevim.vim": 1
  }
  ```

  **注意事项:** 使用affinity设置的一个问题是,每次更新设置文件时,Vim插件都会重新加载,这可能需要几秒钟时间。

## ❤️ Contributing

This project is maintained by a group of awesome [people](https://github.com/VSCodeVim/Vim/graphs/contributors) and contributions are extremely welcome :heart:. For a quick tutorial on how you can help, see our [contributing guide](/.github/CONTRIBUTING.md).

<a href="https://www.buymeacoffee.com/jasonpoon" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Us A Coffee" style="height: auto !important;width: auto !important;" ></a>

### Special shoutouts to

* Thanks to @xconverge for making over 100 commits to the repo. If you're wondering why your least favorite bug packed up and left, it was probably him.
* Thanks to @Metamist for implementing EasyMotion!
* Thanks to @sectioneight for implementing text objects!
* Shoutout to @chillee aka Horace He for his contributions and hard work.
* Special props to [Kevin Coleman](http://kevincoleman.io), who created our awesome logo!
