<center>
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="48" cy="48" r="48" fill="black"/>
<circle cx="45.5" cy="66.5" r="14.5" fill="white"/>
<path d="M54.5 61L31 22.1045C49 12.1045 62.8333 18.6045 68 22.1045" stroke="white" stroke-width="7" stroke-linecap="square"/>
</svg>
<h1>15S-MUSIC</h1>
<h4>
15S听一首歌，快速Pick到你所喜欢的音乐。立即访问 <a href="https://15s-music-web.drawki.top/" target="_blank">15s-music</a> 吧
</h4>
</center>

---

### 特点

- WebBase，即用即走
- 曲风迥异，光怪陆离
- 同时适配 Web 与移动端

### 使用

访问 https://15s-music-web.drawki.top 即可

### 开发

你需准备 Node.js，Postgres，以及 pnpm 包管理。然后安装依赖

```
pnpm i
```
#### Server

1. 复制 server 目录下 `.env.example` 为 `.env.dev`

如果你在使用 vscode，你可以运行 `dev server` Task

如果你更喜欢用命令行，可以运行 `pnpm serve-watch` 然后运行 `pnpm serve-dev`
#### Web

⚠注意：启动 Web 前先启动 Server，如果你不开发 Server，直接运行 `pnpm serve-dev` 即可。

1. 复制 web 目录下的 `.env.example` 为 `.env.local`
2. 启动项目
   ```
   pnpm web dev
   ```
3. 登录 https://localhost:3000

### 贡献
欢迎 Issue，PR！

### 致谢

- Next.js
- Lks
