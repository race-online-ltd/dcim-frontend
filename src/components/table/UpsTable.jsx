import React from "react";

const UpsTable = ({ title, rows = [], compact = false }) => (
  <section className={`ups-table-card${compact ? " is-compact" : ""}`}>
    <div className="ups-table-card__header">
      <h3 className="ups-table-card__title">{title}</h3>
    </div>

    <div className="ups-table-card__body">
      <table className="ups-table" role="table">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${title}-${rowIndex}`}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={`${title}-${rowIndex}-${cellIndex}`}
                  className={cell.className || ""}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                >
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default UpsTable;
