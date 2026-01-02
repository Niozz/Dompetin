import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const themeTitle = "Pengelolaan Uang";
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('financeData');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [diary, setDiary] = useState(() => {
    const saved = localStorage.getItem('financeDiary');
    return saved || "Catatan Keuangan";
  });
  const [nextId, setNextId] = useState(() => {
    const saved = localStorage.getItem('financeNextId');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('financeDiary', diary);
  }, [diary]);

  useEffect(() => {
    localStorage.setItem('financeNextId', nextId.toString());
  }, [nextId]);

  const handleChartClick = (data, index) => {
    setSelectedIndex(index);
    setIncome(data.income.toString());
    setExpense(data.expense.toString());
    setDiary(data.theme);
  };

  const addData = () => {
    if (income === "" || expense === "") return;

    const now = new Date();
    const day = now.toLocaleDateString("id-ID", { weekday: 'long' });
    const newData = {
      id: nextId,
      time: now.toLocaleTimeString("id-ID"),
      date: now.toLocaleDateString("id-ID"),
      income: parseInt(income),
      expense: parseInt(expense),
      theme: diary,
      day: day,
    };

    setData((prev) => [...prev, newData]);
    setNextId(prev => prev + 1);
    resetInput();
  };

  const editData = () => {
    if (selectedIndex === null) return;

    const updated = [...data];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      income: parseInt(income),
      expense: parseInt(expense),
      theme: diary,
    };

    setData(updated);
    resetInput();
    setSelectedIndex(null);
  };

  const deleteData = () => {
    if (selectedIndex === null) return;

    const filtered = data.filter((_, i) => i !== selectedIndex);
    setData(filtered);
    resetInput();
    setSelectedIndex(null);
  };

  const resetInput = () => {
    setIncome("");
    setExpense("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{themeTitle}</h2>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Catatan"
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
        />

        <input
          type="number"
          placeholder="Pendapatan"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Pengeluaran"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
        />

        {selectedIndex === null ? (
          <button onClick={addData}>Tambah</button>
        ) : (
          <button onClick={editData}>Edit</button>
        )}

        <button
          onClick={deleteData}
          disabled={selectedIndex === null}
          style={{
            background: "#ef4444",
            color: "#fff",
            opacity: selectedIndex === null ? 0.5 : 1,
          }}
        >
          Hapus
        </button>
      </div>

      {/* GRAFIK */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="linear"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            onClick={handleChartClick}
          />

          <Line
            type="linear"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            onClick={handleChartClick}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* TOOLTIP */
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;

    return (
      <div
        style={{
          background: "#fff",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        <h2>{d.theme}</h2>
        <h3>{d.day}</h3>
        <p>Tanggal: {d.date}</p>
        <p>Waktu: {d.time}</p>
        <p>Pendapatan: Rp {d.income.toLocaleString("id-ID")}</p>
        <p>Pengeluaran: Rp {d.expense.toLocaleString("id-ID")}</p>
      </div>
    );
  }
  return null;
}
