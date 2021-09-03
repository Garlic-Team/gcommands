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
            title: 'Getting started',
            collapsable: true,
            children: [
              'gettingstarted/installation',
              'gettingstarted/basicbot'
            ]
          },
          {
            title: 'Commands',
            collapsable: true,
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
            collapsable: true,
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
              'other/mentions'
            ]
          },
          {
            title: 'Common quistions',
            collapsable: true,
            children: [
              'quistions/commandrunoptions',
              'quistions/guildundefined',
              'quistions/missingacces'
            ]
          },
          {
            title: 'Additionals',
            collapsable: true,
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
