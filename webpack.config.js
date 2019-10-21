const Path = require("path");
const Copy = require("copy-webpack-plugin");

module.exports = {
	entry: {
		game: Path.join(__dirname, "client", "source", "controllers", "game.tsx"),
	},
	mode: "development",
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: "ts-loader",
			}
		],
	},
	node: {
		fs: "empty",
		net: "empty",
		tls: "empty",
	},
	output: {
		path: Path.join(__dirname, "client", "build"),
		filename: "[name].js",
	},
	plugins: [
		new Copy([
			{ from: Path.join("client", "library", "icons", "*.png"), to: Path.join("icons", "[name].png") },
			{ from: Path.join("client", "library", "*.html"), to: "[name].html" },
			{ from: Path.join("client", "library", "*.css"), to: "[name].css" },
		]),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
};
