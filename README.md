
本项目fork自 [LetTTGACO/SnippetsLab-Raycast](https://github.com/LetTTGACO/SnippetsLab-Raycast)。

Raycast官方商店迟迟没有SnippetsLab的查询扩展。搜索了好久才发现这个项目，clone下来后发现没跑起来。于是就放弃了~~~

最近非常想通过Raycast来查询和复制代码片段，于是尝试改下项目。居然跑起来了，于是有这些发现：
1、`SnippetsLabAlfredWorkflow` 这个命令行工具，来自SnippetsLab程序里的 `SnippetsLabAlfred.alfredworkflow` 文件，这个文件其实是一个zip压缩包。

2、解压后里面有个 `info.plist` 文件，里面就有命令行工具的调用方法：
```bash
# 搜索指令
./SnippetsLabAlfredWorkflow --action=search --query="{query}"

# 查询指令
./SnippetsLabAlfredWorkflow --action=fetch --query="{query}"
```

3、另外你还可以通过Raycast的 `QuickLink`功能快速调起SnippetsLab:
```
snippetslab://search/{query}
```

参考链接：
https://www.renfei.org/snippets-lab/manual/mac/tips-and-tricks/alfred-integration.html

---

<div align="center">
  <h1>SnippetsLab-Raycast</h1>
  <h3>适用于SnippetsLab的Raycast插件</h3>
</div>

# 测试通过环境
- SnippetsLab 2.4.1
- Raycast 1.73.2

# 如何配置
1. `git clone https://github.com/hufang360/SnippetsLab-Raycast.git` 到本地文件夹
2. 将仓库根目录的 SnippetsLabAlfredWorkflow 文件拷贝到 /Applications/SnippetsLab.app/Contents/SharedSupport/Integrations 目录下。或者执行下面这个指令自行提取：
```bash
cd "/Applications/SnippetsLab.app/Contents/SharedSupport/Integrations/"
sudo unzip -oj "SnippetsLabAlfred.alfredworkflow" SnippetsLabAlfredWorkflow -d ./
```
4. 运行`npm run build`
5. Raycast Import Extension 导入，选择此步骤1中的文件夹即可

> SnippetsLabAlfredWorkflow 文件也可以从SnippetsLab设置中安装到Alfred获取，在Alfred的Workflow找到并从访达中打开，也能找到此文件


# 原理
用 `execa` + `child_process`运行本来运行在Alfred中的 SnippetsLabAlfredWorkflow 可执行文件

