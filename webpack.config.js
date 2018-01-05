let webpack = require('webpack');

module.exports = [{
	entry: './index.ts',
	devtool: 'eval',
	output: {
		filename: './out/App.js',
		path: __dirname,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					/*{
						loader: 'babel-loader',
						options: babelOptions
					},*/
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						}
					}
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader?classPrefix'
			}
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"development"'
			}
		}),
	].filter(Boolean),
	externals: {
		'electron': 'electron',
		'fs': 'fs'
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	}
},
];
