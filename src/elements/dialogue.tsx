import * as React from "react";

export interface DialogueProps {
	actions: {
		close: () => void;
		select: (selection: number) => void;
	};
	extraClasses?: string[];
	header: string;
	options: string[];
	text: string;
}

export function Dialogue(props: DialogueProps): React.ReactElement {
	const extraClasses = props.extraClasses || [];
	const className = extraClasses.concat(["dialogue"]).join(" ");
	const listItems = props.options.map((option, index) => {
		const selectThis = () => {
			props.actions.select(index);
		};
		return (
			<li key={index} onClick={selectThis}>
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
