import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function HealthScoreCircle({ score }) {
  // Determine color based on score
  const getColor = (s) => {
    if (s >= 81) return '#10b981'; // Green
    if (s >= 61) return '#eab308'; // Yellow
    if (s >= 41) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getStatus = (s) => {
    if (s >= 81) return 'Excellent';
    if (s >= 61) return 'Good';
    if (s >= 41) return 'Could Be Better';
    return 'Needs Attention';
  };

  const scoreColor = getColor(score);
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-72 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              startAngle={225}
              endAngle={-45}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              <Cell fill={scoreColor} />
              <Cell fill="rgba(226, 232, 240, 0.2)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Health Score</span>
          <span className="text-7xl font-black transition-all" style={{ color: scoreColor }}>{score}</span>
          <span className="text-xs font-bold mt-2 uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ backgroundColor: scoreColor }}>
             {getStatus(score)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-8 text-slate-600 dark:text-slate-400 font-medium text-center max-w-sm px-4">
        Your score is calculated based on savings rate, emergency preparedness, and spending control.
      </p>
    </div>
  );
}
