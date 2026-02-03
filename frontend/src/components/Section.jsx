export default function Section({ title, children, actions, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow mb-8 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}