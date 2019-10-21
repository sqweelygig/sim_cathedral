/* tslint:disable:no-console */
import * as Express from "express";
import * as Path from "path";

const app = Express();
const port = process.env.PORT || 80;

app.get("/", (request, response) => {
	const root = Path.join(__dirname, "..", "..");
	const index = Path.join(root, "client", "build", "game.html");
	response.sendFile(index);
});
app.use("/", Express.static(Path.join("client", "build")));
app.use("/client", Express.static(Path.join("client", "build")));

app.listen(port, () => {
	console.log("============");
	console.log("Listening", port);
});
