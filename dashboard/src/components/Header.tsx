import type { PropsWithChildren } from "react";

export default function Header({ children }: PropsWithChildren<{}>) {
	return (
		<div className="sticky top-0 left-0 right-0 flex items-center gap-3 flex-wrap px-6 py-3 bg-gray-900 border-b border-gray-700">
			<h1 className="text-lg font-bold text-green-400">React Flow Logger</h1>
			{children}
		</div>
	);
}
