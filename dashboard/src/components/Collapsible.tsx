import { useState } from "react";

type Props = {
  label: string;
  value: unknown;
};

function Collapsible({ label, value }: Props) {
  const [open, setOpen] = useState(false);
  const isObject = typeof value === "object" && value !== null;

  return (
    <div className="ml-6 mt-1">
      <button
        className="cursor-pointer text-gray-400 hover:text-gray-100 select-none transition-colors text-left"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {label}: {isObject ? (open ? "" : "{…}") : String(value)}
      </button>
      {open && isObject && (
        <div className="ml-4 mt-1 p-2 bg-gray-900 rounded text-gray-300 border border-gray-700">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Collapsible;
