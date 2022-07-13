const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const host = '0.0.0.0';
const port = 8081;

const isDevServer = (process.argv.find(v => v.includes('serve')) ? true : false);

const mode = "production" === isDevServer ? "development" : "production";

const sassRule = {
	test: /\.scss$/,
	exclude: /node_modules/,
	use: [
		'style-loader',
		"css-loader",
		"postcss-loader",
		"sass-loader"
	]
};

const optimizeImageRule = {
	test: /\.(jpg|png|gif)$/,
	exclude: /node_modules/,
	use: [
		{
			loader: 'image-webpack-loader',
			options: {
				name: '[1]/[name].[ext]',
				regExp: /packages\/(.*)\/src\/img\/.+\..+$/
			},
		},
	],
};

const bundleImageRule = {
	test: /\.(jpg|png|gif|ico|svg)$/,
	type: 'asset/resource',
};

const bundleFontRule = {
	test: /\.(ttf)$/,
	type: 'asset/resource',
};

const ejsRule = {
	test: /\.html.ejs$/,
	loader: 'underscore-template-loader',
};

const htmlRule = {
	test: /\.html$/,
	loader: 'html-loader'
};

const rules = [
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader'
        }
    },
    htmlRule,
    sassRule,
    bundleImageRule,
    bundleFontRule,
    optimizeImageRule,
];

const plugins = [
    new CleanWebpackPlugin(),
];

const entry = {};
const templates = ['index', 'admin', 'presentation'];

templates.forEach((template) => {
    entry[template] = `./src/${template}.js`;
    plugins.push(new HtmlWebpackPlugin({
        inject: 'head',
        template: `./src/${template}.html`,
        filename: `${template}.html`,
        chunks: [ template ],
        scriptLoading: 'defer',
        minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
        }
    }));
})

const config = {
    mode,
    entry,
    target: 'web',
    output: {
        publicPath: '/',
        path: path.join(process.cwd(), 'dist'),
    },
    resolve: {
        extensions: ['.js'],
    },
    module: { rules },
    plugins,
    stats: {
        errorDetails: true
    },
    devServer: {
        // server: 'https',
        allowedHosts: 'auto',
        // disableHostCheck: true,
        // useLocalIp: true,
    },    
};

module.exports = config;
