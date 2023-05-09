module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'sc', 'tc']
    },
    localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/assets/locales')
      : '/locales',
    reloadOnPrerender: process.env.NODE_ENV === 'development'
  } 