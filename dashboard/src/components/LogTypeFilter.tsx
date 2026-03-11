import type { ReactFlowLogType } from "../../../src/types";
import { ALL_TYPES } from "../config";

type Props = {
	selected: ReactFlowLogType[];
	onChange: (selected: ReactFlowLogType[]) => void;
};

export default function LogTypeFilter({ selected, onChange }: Props) {
	const toggleType = (type: ReactFlowLogType) => {
		if (selected.includes(type)) {
			onChange(selected.filter((t) => t !== type));
		} else {
			onChange([...selected, type]);
		}
	};

	const toggleClear = () => {
		onChange([]);
	};

	return (
		<div className="flex flex-wrap gap-1">
			<button
				onClick={toggleClear}
				className={`px-2 py-1 rounded-full text-xs font-medium transition ${
					selected.length === 0
						? "bg-green-500 text-black"
						: "bg-gray-800 text-gray-400 hover:bg-gray-700"
				}`}
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
						className={`px-2 py-1 rounded-full text-xs font-medium transition ${
							isSelected
								? "bg-green-500 text-black"
								: "bg-gray-800 text-gray-400 hover:bg-gray-700"
						}`}
						type="button"
					>
						{type}
					</button>
				);
			})}
		</div>
	);
}
