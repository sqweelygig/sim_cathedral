import * as React from "react";
import * as ReactDOM from "react-dom";

class Game extends React.Component {
	public render(): React.ReactElement {
		return <canvas />;
	}
}

ReactDOM.render(<Game />, document.body);
