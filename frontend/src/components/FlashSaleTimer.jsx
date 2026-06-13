import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function FlashSaleTimer() {
  // Counts down a fixed window for visual demonstration purposes
  const [seconds, setSeconds] = useState(2 * 3600 + 45 * 60 + 30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 9 * 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div className="flex items-center gap-1">
      <TimeBox value={pad(h)} />
      <span className="text-primary font-bold">:</span>
      <TimeBox value={pad(m)} />
      <span className="text-primary font-bold">:</span>
      <TimeBox value={pad(s)} />
    </div>
  );
}

function TimeBox({ value }) {
  return (
    <span className="bg-primary text-white text-xs font-bold rounded-md px-2 py-1 min-w-[28px] text-center">
      {value}
    </span>
  );
}
