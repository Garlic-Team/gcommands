const { config } = require("vuepress-theme-hope");

module.exports = config({
    title: 'GCommands',
    description: 'Powerful and flexible command handler that can do everything!',
    base: "/", // /guide/

    head: [
        ['link', { rel: 'icon', href: '/gcommands.png' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],

    markdown: {
      lineNumbers: true
    },

    themeConfig: {
      sidebarDepth: 3,
      editLinks: true,
      lastUpdated: true,
      blog: false,
      repo: 'garlic-team/gcommands#master',
      logo: '/gcommands.png',
      nav: [
          {text:"Guide", link:"/guide/"},
          {text:"Voice", link:"/voice/"},
          {text:"Docs", link:"https://gcommands.js.org/docs/"},
          {text:"Discord", link:"https://discord.gg/fV8EgwSpgN"}
      ],
      footer: {
        display: true,
        copyright: "Copyright © 2021 Garlic Team",
      },
      mdEnhance: {
        tasklist: true,
      },
      sidebar: {
        '/guide/': [
          {
            title: 'Home',
            collapsable: false,
            children: [
              '',
              'setup',
              'faq'
            ]
          },
          {
            title: 'Beginner',
            collapsable: false,
            children: [
              'beginner/basicbot',
              'beginner/events',
              'beginner/database',
              'beginner/additionalfeatures'
            ]
          },
          {
            title: 'Commands',
            collapsable: false,
            children: [
              'commands/gettingstarted.md',
              'commands/first.md',
              'commands/usingargs.md',
              'commands/usingsub.md',
              'commands/usingbuilders.md'
            ]
          },
          {
            title: 'Interactions',
            collapsable: false,
            children: [
              'interactions/contextmenus',
              'interactions/messagecomponents'
            ]
          },
          {
            title: 'Miscellaneous',
            collapsable: false,
            children: [
              'miscellaneous/mentions',
              'miscellaneous/inhibitor',
              'miscellaneous/moreevents'
            ]
          },
          {
            title: 'Additionals',
            collapsable: false,
            children: [
              'additional/fromv6tov7',
              'additional/fromv5tov6',
              'additional/fromv4tov5',
              'additional/fromv3tov4',
              'additional/fromv2tov3'
            ]
          }
        ],
        '/voice/': [
          {
            title: 'Home',
            collapsable: false,
            children: [
              '/guide/'
            ]
          },
          {
            title: 'Beginner',
            collapsable: false,
            children: [
              'beginner/faq',
              'beginner/setup',
              'beginner/example'
            ]
          }
        ]
      },
    },
    configureWebpack: {
      resolve: {
        alias: {
          '@': '../',
        },
      },
    }
})
