import React from "react";

const Table = ({ data, columns }) => {
    if (!data || data.length === 0) return <p>No data available.</p>;

    return (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        {columns.map((col, index) => (
                            <th key={index} className="border p-2">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border">
                            {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex} className="border p-2">{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
