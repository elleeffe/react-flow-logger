import { useState } from "react";
import type { RenderLog } from "../../../../src/types";
import { typeColors } from "../../config";
import { formatTime } from "../../utils";
import Collapsible from "../Collapsible";

export default function RenderLogLine({ log }: { log: RenderLog }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-gray-900 rounded px-2 py-1 border border-gray-800 hover:border-gray-600 transition-all flex flex-col gap-2">
			<button
				className="w-full cursor-pointer flex justify-between flex-wrap gap-2 text-left"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<div className={`${typeColors[log.type]} select-none flex-1`}>
					[{log.type}] {log.payload.component}
				</div>

				<div className="text-gray-500 text-xs flex-shrink-0">
					{formatTime(log.timestamp)}
				</div>
			</button>

			{open &&
				Object.entries(log.payload).map(([key, value]) => (
					<Collapsible key={key} label={key} value={value} />
				))}
		</div>
	);
}
