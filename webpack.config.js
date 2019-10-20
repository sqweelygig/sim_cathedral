const Path = require("path");
const Copy = require("copy-webpack-plugin");

module.exports = {
	entry: {
		game: Path.join(__dirname, "src", "controllers", "game.tsx"),
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
		path: Path.join(__dirname, "dist"),
		filename: "[name].js",
	},
	plugins: [
		new Copy([
			{ from: Path.join("lib", "icons", "*.png"), to: Path.join("icons", "[name].png") },
			{ from: Path.join("lib", "*.html"), to: "[name].html" },
			{ from: Path.join("lib", "*.css"), to: "[name].css" },
		]),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
};
