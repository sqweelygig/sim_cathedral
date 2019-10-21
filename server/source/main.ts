/* tslint:disable:no-console */
import * as Express from "express";
import * as Path from "path";

const app = Express();
const port = process.env.PORT || 80;

app.use("/client", Express.static(Path.join("client", "build")));
app.get("/", (request, response) => {
	response.send(
		"<html lang='en'><body><a href='client/game.html'>Hello World!</a></body></html>",
	);
});

app.listen(port, () => {
	console.log("Listening", port);
});
