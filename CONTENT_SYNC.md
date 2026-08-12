# 本地收藏同步

这个工具用于把公开的网易云音乐与微信读书资料整理进网站。它在本机运行，先显示差异，得到确认后才修改 `src/data/library.json`。

它不会登录你的账号，不读取浏览器 Cookie，也不会保存密码或 Token。同步完成后只更新本地代码；是否提交 GitHub、是否部署，仍由你决定。

## 最稳妥的使用顺序

先在 VS Code 终端预览：

```powershell
npm.cmd run content:sync -- --dry-run "公开链接"
```

确认歌名、作者、封面和新增数量正确后，再去掉 `--dry-run`：

```powershell
npm.cmd run content:sync -- "公开链接"
```

终端会再次询问是否写入。写入完成后，正在运行的 Vite 预览通常会自动刷新。

## 网易云音乐

单曲：

```powershell
npm.cmd run content:sync -- --dry-run "https://music.163.com/song?id=190545"
```

公开歌单：

```powershell
npm.cmd run content:sync -- --dry-run "https://music.163.com/playlist?id=歌单ID"
```

工具会读取公开页面中的歌名、音乐人和原始封面。歌单页面如果没有公开暴露曲目列表，会停止并提示改为逐首粘贴歌曲链接，不会调用逆向接口。

## 微信读书

### 已登录账号的官方书架同步

项目已安装腾讯官方微信读书 Skill：`.agents/skills/weread`。它使用本机用户环境变量 `WEREAD_API_KEY` 调用官方 Agent API Gateway，不读取浏览器 Cookie。

- API Key 只保存在本机用户环境变量中，不写入项目文件或 GitHub。
- 先调用官方书架接口，再只保留 `secret == 0` 的公开书籍作为候选。
- `finishReading` 与最近阅读时间只用于生成状态建议；本站的“在读 / 读完 / 想读”仍需本人确认。
- 输出候选后仍执行“预览 → 确认 → 写入 `src/data/library.json`”流程。

在 Codex 中可直接说“查看我的微信读书书架并生成网站导入预览”。

### 单本公开分享链接

微信读书的公开页面不能可靠说明一本书是“在读、读完还是想读”，因此必须由你明确提供：

```powershell
npm.cmd run content:sync -- --dry-run --book-status 在读 "微信读书公开分享链接"
```

状态只能是：`在读`、`读完`、`想读`。

如果公开分享页没有给出完整的书名、作者或封面，工具会拒绝写入。这时使用下面的 JSON 导入，不猜测缺失信息。

## JSON 文件导入

创建一个只保存在本机的 JSON 文件，例如 `my-library-import.json`：

```json
{
  "books": [
    {
      "title": "准确书名",
      "author": "准确作者",
      "cover": "https://合法公开封面地址",
      "status": "在读",
      "externalUrl": "https://可选的原平台链接",
      "note": "可选的本人短评"
    }
  ],
  "music": [
    {
      "title": "准确歌曲或专辑名",
      "artist": "准确音乐人",
      "cover": "https://合法公开封面地址",
      "kind": "单曲",
      "externalUrl": "https://可选的原平台链接",
      "note": "可选的本人说明"
    }
  ]
}
```

然后预览并导入：

```powershell
npm.cmd run content:sync -- --dry-run --file ".\my-library-import.json"
npm.cmd run content:sync -- --file ".\my-library-import.json"
```

`kind` 只能是 `单曲` 或 `专辑`。日期如需手工提供，必须使用 `YYYY-MM-DD`。

## 日期与重复记录

- 新记录的 `addedAt` 是“首次加入本站”的日期，不表示真实收听或阅读日期。
- 重复判断依次使用平台来源 ID、原始链接、标题与音乐人/作者。
- 已存在的记录只会显示为“跳过重复”，V1 不会自动覆盖本人短评或其他已有字段。
- 音乐页首屏始终保留已确认的 2025 年度六首；新增音乐进入完整曲目台账和最近记录。
- 第一本书写入后，收藏馆会自动出现书籍入口。

## 自动确认

非交互式终端可以在完成 dry-run 后使用 `--yes`：

```powershell
npm.cmd run content:sync -- --yes "公开链接"
```

不要跳过预览直接使用这个选项。

## 验证

```powershell
npm.cmd run content:sync:test
npm.cmd run typecheck
npm.cmd run build
```

本项目在 Windows PowerShell 中使用 `npm.cmd`，可以避开系统禁止执行 `npm.ps1` 时出现的报错。
