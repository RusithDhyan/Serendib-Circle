
'use client'
import React from 'react'

export default function CommonInquiryReport({ data,type, columns }) {

  return (
    <div className="bg-white flex-1 rounded shadow p-4">
     <div>
        <h2 className="text-4xl text-center font-bold mb-6">{type} Report</h2>

        <table className="w-full border">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 font-bold text-center  bg-orange-100">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="border-t">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 text-center border">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button
          onClick={() => window.print()}
          className="print-btn mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Print Report
        </button>
      </div>

    </div>
  )
}
