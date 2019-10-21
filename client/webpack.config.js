const Path = require("path");
const Copy = require("copy-webpack-plugin");

module.exports = {
	entry: {
		game: Path.join(__dirname, "source", "game.tsx"),
	},
	mode: "development",
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: "ts-loader",
			},
		],
	},
	node: {
		fs: "empty",
		net: "empty",
		tls: "empty",
	},
	output: {
		path: Path.join(__dirname, "build"),
		filename: "[name].js",
	},
	plugins: [
		new Copy([
			{
				from: Path.join(__dirname, "library", "icons", "*.png"),
				to: Path.join(__dirname, "build", "icons", "[name].png"),
			},
			{
				from: Path.join(__dirname, "library", "*.html"),
				to: Path.join(__dirname, "build", "[name].html"),
			},
			{
				from: Path.join(__dirname, "library", "*.css"),
				to: Path.join(__dirname, "build", "[name].css"),
			},
		]),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
};
