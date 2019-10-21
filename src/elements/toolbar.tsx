import * as React from "react";

export interface ToolbarProps {
	extraClasses?: string[];
}

export function Toolbar(props: ToolbarProps): React.ReactElement {
	const extraClasses = props.extraClasses || [];
	const className = extraClasses.concat(["toolbar"]).join(" ");
	return <div className={className} />;
}
