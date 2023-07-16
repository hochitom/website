module.exports = function (eleventyConfig) {
  // Return your Object options:
  return {
    dir: {
      input: 'data',
      output: 'dist',
      layouts: '../src/layouts',
    },
  };
};
