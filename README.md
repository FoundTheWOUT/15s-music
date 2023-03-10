<h1 align="center">
<img src="./resource/icon.png"/>
<br>
15S-MUSIC
</h1>
<h4 align="center">
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

#### 上传音乐
*上传接口尚未公开，此说明仅供开发使用。*
1. 访问路由 `/music/add`，token 为 `.env` 文件中的 `MASTER_TOKEN`，注意，前后端 `MASTER_TOKEN` 必须相同。
2. 输入音乐名，作者
3. 把音乐以及封面拖入对应位置
4. 点击`+`
5. 重复2~3
6. 点击提交

##### 注意事项
1. 所有上传音乐默认都是未审核状态，先需要手动到数据把 censored 字段设为 true，才能在主页看到对应音乐
2. 本地开发采用开发机 FS 做静态存储

### 贡献
欢迎 Issue，PR！

### 致谢

- Next.js
- Lks
