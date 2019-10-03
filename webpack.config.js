const Path = require("path");
const Copy = require("copy-webpack-plugin");

module.exports = {
	entry: {
		game: Path.join(__dirname, "src", "game.tsx"),
	},
	mode: "production",
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: "ts-loader",
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: "style-loader", // Creates style nodes from JS strings
					},
					{
						loader: "css-loader", // Translates CSS into CommonJS
					},
					{
						loader: "sass-loader", // Compiles Sass to CSS
					},
				],
			},
		],
	},
	node: {
		fs: "empty",
		net: "empty",
		tls: "empty",
	},
	output: {
		path: Path.join(__dirname, "dist"),
		filename: "[name].js",
	},
	plugins: [
		new Copy([
			{ from: Path.join("lib", "*.png"), to: "[name].png" },
			{ from: Path.join("src", "*.html"), to: "[name].html" },
		]),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
};
