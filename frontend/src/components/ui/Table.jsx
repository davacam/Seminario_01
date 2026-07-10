import { Edit2, Inbox, Loader2, Trash2 } from "lucide-react";

export default function Table({ columns, data, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="panel flex items-center justify-center gap-3 py-12 text-slate-300">
        <Loader2 className="animate-spin text-sky-300" size={22} />
        <span>Cargando datos...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="panel flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4 text-slate-300">
          <Inbox size={30} />
        </div>
        <p className="font-semibold text-white">No hay datos todavia</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          Cuando crees registros, apareceran aqui con sus acciones disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden rounded-lg">
      <div className="h-1 overflow-hidden bg-slate-800">
        <div className="h-full w-1/3 bg-sky-400/70" style={{ animation: "pulse-line 2.6s ease-in-out infinite" }} />
      </div>
      <div className="overflow-x-auto" role="region" aria-label="Tabla de registros" tabIndex="0">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-white/10 bg-white/[0.04]">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {col.label}
                </th>
              ))}
                {(onEdit || onDelete) && <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 sm:px-6">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="border-b border-white/5 transition duration-200 hover:bg-sky-400/[0.06]"
                style={{ animation: `float-in 360ms ease both`, animationDelay: `${idx * 35}ms` }}
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-4 text-sm text-slate-200 sm:px-6">
                    {col.render ? col.render(row[col.key], row) : row[col.key] || "-"}
                  </td>
                ))}
                {(onEdit || onDelete) && <td className="px-4 py-4 sm:px-6">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-2 text-sky-200 transition hover:bg-sky-400/20"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/20"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
