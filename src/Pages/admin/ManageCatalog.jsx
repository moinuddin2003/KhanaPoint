import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Store,
  Tag,
  UtensilsCrossed,
  Percent,
  Layers,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { BASE_URL } from "../../services/authApi";

// ---- Config: one entry per read-only resource we show ----
// NOTE: paths copied exactly from the Swagger docs (some intentionally have
// no trailing slash, some do — this matches the backend routing).
const RESOURCES = [
  {
    key: "restaurants",
    label: "Restaurants",
    icon: Store,
    path: "restaurants/all-restaurant",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Tag,
    path: "restaurants/all-category",
  },
  {
    key: "menuItems",
    label: "Menu Items",
    icon: UtensilsCrossed,
    path: "restaurants/all-menuitem",
  },
  {
    key: "deals",
    label: "Deals",
    icon: Percent,
    path: "restaurants/all-deal/",
  },
  {
    key: "dealItems",
    label: "Deal Items",
    icon: Layers,
    path: "restaurants/all-deal-item/",
  },
];

// Turns "rest_id" / "restaurantName" into "Rest Id" / "Restaurant Name"
function humanizeKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isImageKey(key) {
  return /image|photo|logo|thumbnail|avatar|banner/i.test(key);
}

function CellValue({ colKey, value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300">—</span>;
  }
  if (
    isImageKey(colKey) &&
    typeof value === "string" &&
    value.startsWith("http")
  ) {
    return (
      <img
        src={value}
        alt={colKey}
        className="h-10 w-10 rounded-md object-cover border border-slate-200"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }
  if (typeof value === "boolean") {
    return (  
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          value
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }
  if (typeof value === "object") {
    return (
      <span
        className="text-slate-400 text-xs font-mono"
        title={JSON.stringify(value)}
      >
        {JSON.stringify(value).slice(0, 40)}
        {JSON.stringify(value).length > 40 ? "…" : ""}
      </span>
    );
  }
  return <span>{String(value)}</span>;
}

function DataTable({ rows, resourceLabel }) {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    const keySet = new Set();
    rows.slice(0, 25).forEach((row) => {
      Object.keys(row || {}).forEach((k) => keySet.add(k));
    });
    return Array.from(keySet);
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) =>
      Object.values(row || {}).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [rows, search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder={`Search ${resourceLabel.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 shadow-sm transition"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
          {filteredRows.length} of {rows.length} records
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-5 py-3 whitespace-nowrap">
                    {humanizeKey(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, idx) => (
                  <tr
                    key={row.id ?? row.rest_id ?? row.deal_id ?? idx}
                    className="hover:bg-slate-50 transition"
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-5 py-3 align-middle">
                        <CellValue colKey={col} value={row?.[col]} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length || 1}
                    className="px-6 py-12 text-center text-xs text-slate-400 font-medium"
                  >
                    No {resourceLabel.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ManageCatalog() {
  const [activeResource, setActiveResource] = useState(RESOURCES[0].key);
  const [dataByKey, setDataByKey] = useState({});
  const [errorsByKey, setErrorsByKey] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };

    const results = await Promise.allSettled(
      RESOURCES.map((r) => fetch(`${BASE_URL}${r.path}`, { headers })),
    );

    const nextData = {};
    const nextErrors = {};

    await Promise.all(
      results.map(async (result, idx) => {
        const resource = RESOURCES[idx];
        if (result.status === "fulfilled" && result.value.ok) {
          try {
            const json = await result.value.json();
            const list = Array.isArray(json) ? json : json.data || [];
            nextData[resource.key] = Array.isArray(list) ? list : [];
          } catch {
            nextErrors[resource.key] = "Could not parse server response.";
          }
        } else {
          nextErrors[resource.key] =
            result.status === "fulfilled"
              ? `Server responded with status ${result.value.status}.`
              : "Network request failed.";
        }
      }),
    );

    setDataByKey(nextData);
    setErrorsByKey(nextErrors);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const current = RESOURCES.find((r) => r.key === activeResource);

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-1 -mb-px">
          {RESOURCES.map((r) => {
            const Icon = r.icon;
            const isActive = r.key === activeResource;
            return (
              <button
                key={r.key}
                onClick={() => setActiveResource(r.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {r.label}
                {dataByKey[r.key] && (
                  <span className="ml-1 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-[10px]">
                    {dataByKey[r.key].length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg bg-white shadow-sm hover:bg-slate-50 transition text-xs font-bold text-slate-700 mb-2"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : errorsByKey[activeResource] ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            {errorsByKey[activeResource]}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Endpoint: <code>{current.path}</code>
          </p>
        </div>
      ) : (
        <DataTable
          rows={dataByKey[activeResource] || []}
          resourceLabel={current.label}
        />
      )}
    </div>
  );
}
