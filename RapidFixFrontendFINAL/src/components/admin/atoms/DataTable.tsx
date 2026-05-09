import { C } from "@/lib/constants";
import type { Column } from "@/lib/types";

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
}

export function DataTable<T>({ columns, rows }: DataTableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr
            style={{
              background: "#f9fafb",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {columns.map((c) => (
              <th
                key={String(c.key)}
                style={{
                  padding: "8px 14px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textSec,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  width: c.width,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="cf-row"
              style={{ borderBottom: `1px solid ${C.borderFaint}` }}
            >
              {columns.map((c) => (
                <td
                  key={String(c.key)}
                  style={{
                    padding: "10px 14px",
                    color: C.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.render
                    ? c.render(row)
                    : String(row[c.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
