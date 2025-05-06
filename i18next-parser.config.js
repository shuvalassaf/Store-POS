export default {
    locales: ['en', 'he'],
    defaultNamespace: 'translation',
    keySeparator: '.',
    createOldCatalogs: true,
    verbose: true, 
    namespaceSeparator: ':',
    input: [
      './*.js',                         // root JS files
      './api/**/*.{js,jsx}',            // API layer
      './assets/js/**/*.{js,jsx}',         // POS UI logic
      './public/**/*.{js,jsx,html}'     // any React/HTML in public
    ],
    output: 'locales/$LOCALE/$NAMESPACE.json',
    // custom transform for semantic keys can go here
  };
  