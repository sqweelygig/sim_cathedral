const Path = require("path");

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
		path: Path.join(__dirname, "distribute", "source"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
};
