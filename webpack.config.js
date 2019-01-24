const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const IS_DEV = process.env.NODE_ENV !== 'production';
const IS_UGLIFY = true;

const outputHTMLs = [
	{
		template: './src/index.pug',
		filename: './index.html'
	},
	{
		template: './src/index-zh-hant.pug',
		filename: './index-zh-hant.html'
	},
	{
		template: './src/index-zh-hans.pug',
		filename: './index-zh-hans.html'
	},
].map(outputHTML => new HtmlWebpackPlugin({
	hash: true,
	template: outputHTML.template,
	filename: outputHTML.filename,
}));

module.exports = {
	mode: process.env.NODE_ENV,
	devtool: IS_DEV ? 'inline-source-map' : '',
	entry: {
		'main': [
			'./src/js/main.js',
			'./src/style/main.scss',
		]
	},
	optimization: IS_DEV || !IS_UGLIFY ? {} : {
		minimizer: [new UglifyJsPlugin()]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: { sourceMap: IS_DEV }
					},
				]
			},
			{
				test: /\.(gif|svg|jpg|png|woff(2)?|ttf|eot|otf)$/,
				loader: 'file-loader',
				options: {
					context: '/',
					name: 'asset/[name].[ext]'
				}
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: IS_DEV,
								importLoaders: 1,
							}
						},
						{
							loader: 'postcss-loader',
							options: { sourceMap: IS_DEV }
						},
						{
							loader: 'sass-loader',
							options: { sourceMap: IS_DEV }
						},
					]
				})
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'html-loader',
			},
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				use: ['html-loader', 'pug-html-loader']
			},
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist')
	},
	plugins: [
		...outputHTMLs,
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true,
			ignoreOrder: true
		})
	],
	devServer: {
		watchContentBase: true,
		watchOptions: {
			poll: true
		}
	}
};
