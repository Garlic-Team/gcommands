const { config } = require("vuepress-theme-hope");

module.exports = config({
    title: 'GCommands',
    description: 'Powerful and flexible command handler that can do everything!',
    base: "/guide/", // /guide/

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
      repo: 'Garlic-Team/GCommands',
      docsDir: 'guide',
      docsBranch: 'docs',
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
            title: 'Getting started',
            collapsable: false,
            children: [
              'gettingstarted/installation',
              'gettingstarted/basicbot'
            ]
          },
          {
            title: 'Commands',
            collapsable: false,
            children: [
              'commands/gettingstarted',
              'commands/first',
              'commands/usingargs',
              'commands/usingsub',
              'commands/usingbuilders',
              'commands/additionalfeatures'
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
            title: 'Events',
            collapsable: true,
            children: [
              'events/setup',
              'events/create',
              'events/usingbuilder',
              'events/moreevents'
            ]
          },
          {
            title: 'Components',
            collapsable: true,
            children: [
              'components/setup',
              'components/create',
            ]
          },
          {
            title: 'Database',
            collapsable: true,
            children: [
              'database/setup',
              'database/prefix',
              'database/guildlanguage'
            ]
          },
          {
            title: 'Other',
            collapsable: true,
            children: [
              'other/customlanguagefile',
              'other/inhibitor',
              'other/mentions',
              'other/alwaysobtain'
            ]
          },
          {
            title: 'Common questions',
            collapsable: true,
            children: [
              'questions/commandrunoptions',
              'questions/guildundefined',
              'questions/missingacces'
            ]
          },
          {
            title: 'Additionals',
            collapsable: true,
            children: [
              'additional/fromv7tov8',
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
