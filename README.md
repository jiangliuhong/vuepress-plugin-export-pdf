
# vuepress-plugin-export-pdf-pro

## 说明

按文件序号导出合成PDF文件

修改自 [vuepress-plugin-export](https://github.com/ulivz/vuepress-plugin-export)
修改自 [vuepress-plugin-export-pdf](https://github.com/eamiear/vuepress-plugin-export-pdf.git)

## 更新内容

### 1.0.0

- 根据菜单配置(themeConfig.nav)排序
- 导出时，隐藏顶栏菜单（防止菜单遮挡内容）

### 1.0.2

- 解决centos下报错问题：`Running as root without --no-sandbox is not supported.`

## 使用

安装依赖包

```
npm -i vuepress-plugin-export-pdf-pro
```

在`.vuepress/config.js`文件中增加内容：

```
plugins: [
    [
      'vuepress-plugin-export-pdf-pro'
    ]
  ]
```

执行命令：`vuepress export docs`
