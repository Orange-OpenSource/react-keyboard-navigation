module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactKeyboardNavigation',
      externals: {
        react: 'React',
      },
    },
  },
  webpack: {
    rules: {
      css: {
        modules: true,
        camelCase: true,
      },
    },
  },
};
