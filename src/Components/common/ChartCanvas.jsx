import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * Thin wrapper around Chart.js for React.
 *
 * Chart.js draws directly onto a <canvas> and manages its own internal
 * state - it doesn't know about React re-renders. So this component:
 *   1. Creates the Chart instance once, on mount, pointed at our <canvas>.
 *   2. Destroys the old instance and makes a new one whenever `data` or
 *      `options` change (simplest way to keep it in sync with React state).
 *   3. Destroys the instance on unmount so we don't leak memory when you
 *      navigate away from the Analytics page.
 *
 * Usage:
 *   <ChartCanvas
 *     type="line"
 *     data={{ labels: [...], datasets: [{ label: "Revenue", data: [...] }] }}
 *     height={260}
 *   />
 */
const ChartCanvas = ({ type, data, options = {}, height = 260 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clean up the previous chart before drawing a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: type === "doughnut" || type === "pie" } },
        ...options,
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, JSON.stringify(data), JSON.stringify(options)]);

  return (
    <div style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ChartCanvas;
