import { formatDurationWithThreshold, formatTime } from "../../utils";

type Props = {
  duration: number;
  timestamp: number;
  thresholds: {
    warning: number;
    danger: number;
  };
};

export default function DurationLabel({
  duration,
  timestamp,
  thresholds,
}: Props) {
  return (
    <div className=" text-xs flex-shrink-0">
      <span
        className={
          duration >= thresholds.danger
            ? "text-red-300"
            : duration >= thresholds.warning
              ? "text-yellow-300"
              : "text-green-300"
        }
      >
        {formatDurationWithThreshold(
          duration,
          thresholds.warning,
          thresholds.danger,
        )}
      </span>{" "}
      <span className="text-gray-500">- {formatTime(timestamp)}</span>
    </div>
  );
}
