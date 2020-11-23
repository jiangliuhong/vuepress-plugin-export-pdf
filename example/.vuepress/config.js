module.exports = {
    title: 'vuepress',
    descirption: '操作文档',
    port: 9000,
    themeConfig: {
        search: true, // 搜索
        navbar: false, // 导航
        nextLinks: false, // 下一页
        prevLinks: false, // 上一页
        nav: [
        ],
        sidebar: [
            {
                title: '操作文档',
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 3,    // 可选的, 默认值是 1
                children: [
                    ['/guide/0-home.md', 'home'],
                    ['/guide/1-a.md', 'a'],
                    ['/guide/2-b.md', 'b'],
                    ['/guide/3-ccc.md', 'c'],
                ]
            },
        ]
    },
    plugins:[
        ['vuepress-plugin-export'],
        [
            'vuepress-plugin-medium-zoom',
            {
                options: {
                    margin: 16
                }
            }
        ]

    ]
 }

