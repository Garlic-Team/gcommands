module.exports = {
    title: 'GCommands',
    description: 'Open source slash/normal command handler',
    base: "/",

    head: [
        ['link', { rel: 'icon', href: '/gcommands.png' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],

    plugins: [],
    theme: 'yuu',

    themeConfig: {
      yuu: {
        extraOptions: {
          before: 'BranchSelector',
          below: 'LanguageSelector'
        },
        defaultDarkTheme: true,
        defaultColorTheme: 'red',
      },
      repo: 'garlic-team/gcommands#master',
      logo: '/gcommands.png',
      nav: [
          {text:"Guide", link:"/guide/"},
          {text:"Docs", link:"https://gcommands.js.org/docs/"},
          {text:"Discord", link:"https://discord.gg/fV8EgwSpgN"}
      ],
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
              'beginner/arguments',
              'beginner/database',
              'beginner/additionalfeatures'
            ]
          },
          {
            title: 'Miscellaneous',
            collapsable: false,
            children: [
              'miscellaneous/mentions',
              'miscellaneous/interactions',
              'miscellaneous/inhibitor',
              'miscellaneous/moreevents'
            ]
          },
          {
            title: 'Additionals',
            collapsable: false,
            children: [
              'additional/fromv3tov4',
              'additional/fromv2tov3'
            ]
          }
        ],
      },
    },
    configureWebpack: {
      resolve: {
        alias: {
          '@': '../',
        },
      },
    },
    globalUIComponents: ['Notice','V2v3'],
}
