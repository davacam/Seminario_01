import { Edit2, Trash2 } from "lucide-react";

export default function Table({ columns, data, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-400">No hay datos</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-700 border-b border-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-b border-gray-700 hover:bg-gray-700 transition">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="px-6 py-4 flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
