# 半席：个人私人茶席品牌网站

一个可部署到 Netlify Free 的 Astro 静态站，包含 Decap CMS 内容后台、Netlify Identity 登录、Git Gateway 内容提交，以及 Tally 免费表单嵌入。

## 技术栈

- Astro + TypeScript
- 原生 CSS
- Astro Content Collections
- Decap CMS
- Netlify Identity + Git Gateway
- Netlify Free
- Tally 免费表单
- GitHub 仓库内容存储

## 本地运行

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 目录结构

```text
public/
  admin/              Decap CMS 后台
  images/             本地占位视觉
  uploads/            CMS 上传图片目录
src/
  components/         页面组件
  content/
    settings/         全站设置
    home-blocks/      首页受控模块
    tea-events/       茶会内容
    objects/          器物内容
    notes/            札记内容
  layouts/            基础布局
  pages/              页面路由
  styles/             全局设计系统
```

## 已实现页面

- `/` 首页：入席之前
- `/tea-events` 四时茶会
- `/tea-events/[slug]` 茶会详情
- `/host` 主人
- `/objects` 器物
- `/notes` 札记
- `/notes/[slug]` 札记详情
- `/enter` 申请入席
- `/admin` 内容后台

## CMS 后台

后台路径：`/admin`

Decap CMS 使用 `git-gateway`，内容会写入仓库中的 Markdown 文件。后台可管理：

- `site_settings`：全站设置，单文件 `src/content/settings/site.md`
- `home_blocks`：首页受控排版模块，路径 `src/content/home-blocks/*.md`
- `tea_events`：茶会，路径 `src/content/tea-events/*.md`
- `objects`：器物，路径 `src/content/objects/*.md`
- `notes`：札记，路径 `src/content/notes/*.md`

首页模块只允许选择 `layout: left / right / full` 和 `theme: dark / light / paper`。后台不开放任意颜色、字体或间距设置。

## Netlify 部署步骤

1. 将项目推送到 GitHub 仓库。
2. 在 Netlify 从 GitHub 导入该项目。
3. Build command 填写：`npm run build`
4. Publish directory 填写：`dist`
5. 部署完成后，在 Netlify 项目中启用 Identity。
6. 在 Identity 设置中启用 Git Gateway。
7. 邀请管理员用户。
8. 访问 `https://你的站点域名/admin`。
9. 使用管理员账号登录后编辑内容。
10. 保存内容后，Decap CMS 会自动提交到 GitHub，并触发 Netlify 重新部署。

## Tally 表单配置

在 Tally 创建免费表单后，把公开嵌入链接填入后台：

`全站设置 -> Tally 表单链接`

建议字段：

- 称呼
- 联系方式
- 所在城市
- 希望参加的茶会
- 同行人数
- 是否有饮茶经验
- 想通过这场茶会获得什么
- 是否接受候补

如果该字段为空，`/enter` 页面会显示优雅占位区块，提示需要配置 Tally 链接。

## 新增茶会

进入 `/admin` 后选择“茶会”，创建新条目。必须填写 `slug`，它会成为详情页地址：

```text
/tea-events/你的-slug
```

状态字段只能选择：

- `open`
- `waitlist`
- `full`
- `closed`

如果希望茶会出现在首页“本季茶会”，勾选“首页精选”。

## 新增札记

进入 `/admin` 后选择“札记”，创建新条目。分类只能从后台预设项中选择。勾选“是否精选”后，文章会出现在首页“札记精选”。

## 修改首页模块顺序

进入 `/admin` 后选择“首页模块”，修改“排序”字段。数字越小越靠前。关闭“是否显示”后，前端不会渲染该模块。

## 图片上传规范

- 上传到 `public/uploads`
- 建议宽度不低于 1600px
- 保持低饱和、自然光、真实器物与席面
- 避免使用外链图片
- 避免水墨素材、装饰性边框、伪古风元素和夸张字体

项目自带 `public/images` 下的 SVG 占位视觉。没有真实图片时不会出现破图。

## 设计系统

全局 CSS 变量位于 `src/styles/global.css`：

- 墨黑：`#11100E`
- 生宣白：`#F3EFE6`
- 熟普棕：`#5B3E2A`
- 青瓷灰绿：`#8A9A8B`
- 暗金：`#BFA46A`
- 深灰文字：`#2A2824`
- 浅灰文字：`#8C867C`

暗金仅用于细线、编号和分隔符。标题优先使用系统宋体，正文使用清晰系统字体。布局移动端优先，桌面内容宽度控制在约 1120px，文章正文控制在约 720px。
