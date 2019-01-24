module.exports = {
	plugins: [
		require('precss'),
		require('autoprefixer'),
		require('cssnano'),
		require('css-mqpacker'),
		require('postcss-ie11'),
	],
};
