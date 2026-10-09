module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('data/css');

  return {
    dir: {
      input: 'data',
      output: 'dist',
      layouts: '../src/layouts',
    },
  };
};
