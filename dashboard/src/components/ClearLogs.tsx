type Props = {
  onClick: () => void;
};

export default function ClearLogsButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-400 font-semibold py-2 px-4 cursor-pointer border border-gray-700"
      type="button"
    >
      Clear
    </button>
  );
}
