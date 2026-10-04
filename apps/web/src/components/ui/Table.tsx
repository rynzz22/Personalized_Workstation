import React, { TableHTMLAttributes } from 'react';

export const Table: React.FC<TableHTMLAttributes<HTMLTableElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left text-xs ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = 'No records available',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="text-center py-8 text-xs text-slate-400">{emptyMessage}</div>;
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
          {columns.map((col, idx) => (
            <th key={idx} className="pb-3 font-semibold">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item, rowIdx) => (
          <tr key={item.id ?? rowIdx} className="hover:bg-slate-50/80 transition-colors">
            {columns.map((col, colIdx) => (
              <td key={colIdx} className="py-3 text-slate-700">
                {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
