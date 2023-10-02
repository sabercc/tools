import { basename } from 'path'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import fg from 'fast-glob'

interface IndexTree {
    [index: string]: {
        link: string
        items?: IndexTree
    }
}

function copyright() {
    const start = 2023
    const now = new Date().getFullYear()
    const year = now === start ? '2023' : `${start}-${now}`
    return `Copyright © ${year} sabercc`
}

function resolveTitle(title: string) {
    title = title === 'tools' ? title : title.replace('tools.', '')
    title = title.split('.').join(' ')
    return title
}

function getTree(file: string, prefix: string, tree = {}) {
    const [ cur, ...rest ] = file.replace('.md', '').split('.')
    const curPath = prefix + cur
    if (!tree[curPath]) {
        tree[curPath] = {
            link: '/doc/' + curPath + '.md',
        }
    }
    if (rest.length > 0) {
        if (!tree[curPath].items) {
            tree[curPath].items = {}
        }
        getTree(rest.join('.'), curPath + '.', tree[curPath].items)
    }
}

function treeToItems(tree: IndexTree) {
    const items: DefaultTheme.SidebarItem[] = []
    Object.keys(tree).forEach((key) => {
        const item: DefaultTheme.SidebarItem = {
            text: resolveTitle(key),
            link: tree[key].link,
        }
        if (tree[key].items) {
            if (!item.items) {
                item.items = []
            }
            item.items.push(...treeToItems(tree[key].items!))
        }
        items.push(item)
    })
    return items
}

const tree
= fg.sync(['./doc/**/*.md'])
    .map((path) => basename(path))
    .reduce((tree, file) => {
        getTree(file, '', tree)
        return tree
    }, {})

const docs: DefaultTheme.SidebarItem[] = treeToItems(tree)

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Tools',
    description: 'Documentations of @sabercc/tools',
    themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/doc/index' },
            { text: 'API', link: '/doc/tools' },
        ],

        sidebar: [
            {
                text: 'API',
                items: docs,
            },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/sabercc/tools' },
        ],

        search: {
            provider: 'local',
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: copyright(),
        },
    },

    markdown: {
        theme: {
            light: 'light-plus',
            dark: 'github-dark',
        },
    },
})
