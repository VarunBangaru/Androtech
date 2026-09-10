import { useEffect, useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import { getMovements } from "./service/movementService";
import "./App.css";

function App() {

    const [from, setFrom] = useState("2026-01-01");
    const [to, setTo] = useState("2026-01-31");
    const [type, setType] = useState("ALL");

    const [movements, setMovements] = useState([]);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const rowsPerPage = 10;

    useEffect(() => {

        if (!from || !to) {
            return;
        }

        fetchMovements();

    }, [from, to, type]);

    async function fetchMovements() {

        try {

            setLoading(true);
            setError("");

            const data = await getMovements(
                from,
                to,
                type
            );

            setMovements(data);
            setPage(1);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    }

    // -------------------------
    // Pagination
    // -------------------------

    const totalPages =
        Math.ceil(movements.length / rowsPerPage);

    const startIndex =
        (page - 1) * rowsPerPage;

    const currentRows =
        movements.slice(
            startIndex,
            startIndex + rowsPerPage
        );

    // -------------------------
    // Pie Chart
    // -------------------------

    const pieData = useMemo(() => {

        const result = {
            IN: 0,
            OUT: 0
        };

        movements.forEach(movement => {

            if (movement.movementType === "IN") {
                result.IN += movement.quantity;
            }

            if (movement.movementType === "OUT") {
                result.OUT += movement.quantity;
            }

        });

        return [
            {
                name: "IN",
                value: result.IN
            },
            {
                name: "OUT",
                value: result.OUT
            }
        ];

    }, [movements]);

    // -------------------------
    // Time Series
    // -------------------------

    const timeSeriesData = useMemo(() => {

        const grouped = {};

        movements.forEach(movement => {

            const date =
                movement.timestamp.substring(0, 10);

            if (!grouped[date]) {

                grouped[date] = {
                    date,
                    IN: 0,
                    OUT: 0
                };
            }

            grouped[date][movement.movementType]
                += movement.quantity;
        });

        return Object.values(grouped)
            .sort((a, b) =>
                a.date.localeCompare(b.date)
            );

    }, [movements]);

    return (
        <div className="container">

            <h1>Inventory Movement Dashboard</h1>

            {/* Filters */}

            <div className="filters">

                <div>
                    <label>From</label>

                    <input
                        type="date"
                        value={from}
                        onChange={e =>
                            setFrom(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>To</label>

                    <input
                        type="date"
                        value={to}
                        onChange={e =>
                            setTo(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Movement Type</label>

                    <select
                        value={type}
                        onChange={e =>
                            setType(e.target.value)
                        }
                    >
                        <option value="ALL">
                            All
                        </option>

                        <option value="IN">
                            IN
                        </option>

                        <option value="OUT">
                            OUT
                        </option>
                    </select>
                </div>

            </div>

            {loading && (
                <p>Loading...</p>
            )}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading && !error && (

                <>

                    {/* Charts */}

                    <div className="charts">

                        <div className="chart-card">

                            <h2>Pie Chart</h2>

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <PieChart>

                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >

                                        {pieData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={entry.name === "IN" ? "#22c55e" : "#ef4444"}
                                                />
                                            )
                                        )}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>


                        <div className="chart-card">

                            <h2>Time Series Chart</h2>

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <LineChart
                                    data={timeSeriesData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="date"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="IN"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="OUT"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* Table */}

                    <div className="table-card">

                        <h2>Stock Movements</h2>

                        <table>

                            <thead>

                            <tr>
                                <th>Date/Time</th>
                                <th>SKU</th>
                                <th>Movement Type</th>
                                <th>Quantity</th>
                            </tr>

                            </thead>

                            <tbody>

                            {currentRows.map(
                                movement => (

                                    <tr key={movement.id}>

                                        <td>
                                            {new Date(
                                                movement.timestamp
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {movement.sku}
                                        </td>

                                        <td>
                                            {movement.movementType}
                                        </td>

                                        <td>
                                            {movement.quantity}
                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>


                        {/* Pagination */}

                        <div className="pagination">

                            <button
                                disabled={page === 1}
                                onClick={() =>
                                    setPage(page - 1)
                                }
                            >
                                Previous
                            </button>

                            <span>
                                Page {page} of {totalPages || 1}
                            </span>

                            <button
                                disabled={
                                    page === totalPages ||
                                    totalPages === 0
                                }
                                onClick={() =>
                                    setPage(page + 1)
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

export default App;