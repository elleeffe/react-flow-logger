import clsx from "clsx";
import { useCallback } from "react";
import type { ReactFlowLogType } from "../../../src/types";
import { ALL_TYPES, typeColors } from "../config";

type Props = {
	selected: ReactFlowLogType[];
	onChange: (selected: ReactFlowLogType[]) => void;
};

export default function LogTypeFilter({ selected, onChange }: Props) {
	const toggleType = useCallback(
		(type: ReactFlowLogType) => {
			if (selected.includes(type)) {
				onChange(selected.filter((t) => t !== type));
			} else {
				onChange([...selected, type]);
			}
		},
		[onChange, selected],
	);

	const toggleClear = useCallback(() => {
		onChange([]);
	}, [onChange]);

	return (
		<div className="flex flex-wrap gap-1">
			<button
				onClick={toggleClear}
				className={clsx([
					"px-2 py-1 rounded-full text-xs font-medium transition bg-gray-800 hover:bg-gray-700 cursor-pointer",
					selected.length === 0 ? "text-green-400" : "text-gray-400",
				])}
				type="button"
			>
				All types
			</button>
			{ALL_TYPES.map((type) => {
				const isSelected = selected.includes(type);
				return (
					<button
						key={type}
						onClick={() => toggleType(type)}
						className={clsx([
							"px-2 py-1 rounded-full text-xs font-medium transition cursor-pointer hover:bg-gray-700 bg-gray-800",
							isSelected ? typeColors[type] : "text-gray-400",
						])}
						type="button"
					>
						{type}
					</button>
				);
			})}
		</div>
	);
}
