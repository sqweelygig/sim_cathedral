import * as React from "react";

export interface DialogueProps {
	extraClasses?: string[];
	header: string;
	options: string[];
	text: string;
}

export function Dialogue(props: DialogueProps): React.ReactElement {
	const extraClasses = props.extraClasses || [];
	const className = extraClasses.concat(["dialogue"]).join(" ");
	const listItems = props.options.map((option) => {
		return <li>{option}</li>;
	});
	return (
		<div className={className}>
			<h1>{props.header}</h1>
			<p>{props.text}</p>
			<ul>{listItems}</ul>
		</div>
	);
}
