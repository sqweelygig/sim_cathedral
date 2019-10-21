import * as React from "react";

export interface DialogueProps {
	actions: {
		close: () => void;
		select: (selection: string) => void;
	};
	extraClasses?: string[];
	header: string;
	options: string[];
	text: string;
}

export function Dialogue(props: DialogueProps): React.ReactElement {
	const extraClasses = props.extraClasses || [];
	const className = extraClasses.concat(["dialogue"]).join(" ");
	const listItems = props.options.map((option) => {
		const selectThis = () => {
			props.actions.select(option);
		};
		return (
			<li key={option} onClick={selectThis}>
				{option}
			</li>
		);
	});
	return (
		<div className={className}>
			<h1 className="title">{props.header}</h1>
			<img
				src={"icons/waxseal.png"}
				alt="wax seal"
				className="close"
				onClick={props.actions.close}
			/>
			<div className="text">{props.text}</div>
			<ul className="choice">{listItems}</ul>
		</div>
	);
}
