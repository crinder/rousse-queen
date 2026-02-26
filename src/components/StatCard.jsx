// components/StatCard.jsx
export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "text-orange-400",
  subtitle,
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{title}</p>
        {Icon && <Icon className={`${color}`} size={22} />}
      </div>

      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}