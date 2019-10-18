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
	return <div className={className}>{props.text}</div>;
}
