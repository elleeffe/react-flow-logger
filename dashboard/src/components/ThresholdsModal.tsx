export type HookThresholds = Record<
  string,
  { warning: number; danger: number }
>;

type ThresholdsModalProps = {
  thresholds: HookThresholds;
  setThresholds: (t: HookThresholds) => void;
  onClose: () => void;
  onReset: () => void;
};

export function ThresholdsModal({
  thresholds,
  setThresholds,
  onClose,
  onReset,
}: ThresholdsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded w-96 max-w-full shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Thresholds (ms)</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-xl"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {Object.entries(thresholds).map(([hook, { warning, danger }]) => (
            <div key={hook} className="flex items-center gap-2">
              <span className="w-24 capitalize">{hook}</span>

              {/* Warning input */}
              <input
                type="number"
                value={warning}
                onChange={(e) => {
                  const newWarning = Number(e.target.value);
                  let newDanger = thresholds[hook].danger;
                  // Se warning e danger coincidono, aumentiamo danger di 1
                  if (newWarning >= newDanger) {
                    newDanger = newWarning + 1;
                  }
                  setThresholds({
                    ...thresholds,
                    [hook]: { warning: newWarning, danger: newDanger },
                  });
                }}
                className="w-16 p-1 rounded bg-gray-700 text-white"
                min={0}
              />
              <span className="text-gray-400">⚠️</span>

              {/* Danger input */}
              <input
                type="number"
                value={danger}
                onChange={(e) => {
                  let newDanger = Number(e.target.value);
                  const newWarning = thresholds[hook].warning;
                  // Se danger e warning coincidono, aumentiamo danger di 1
                  if (newDanger <= newWarning) {
                    newDanger = newWarning + 1;
                  }
                  setThresholds({
                    ...thresholds,
                    [hook]: { warning: newWarning, danger: newDanger },
                  });
                }}
                className="w-16 p-1 rounded bg-gray-700 text-white"
                min={0}
              />
              <span className="text-gray-400">⛔</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center flex-wrap">
          <button
            onClick={onReset}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            type="button"
          >
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
}
