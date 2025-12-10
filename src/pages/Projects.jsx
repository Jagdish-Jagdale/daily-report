import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

/**
 * Projects page
 * - Top-left heading + subtitle under hr
 * - Summary cards below
 * - Search & Sort card with "Add Project" button top-right
 * - Table preview with Sr No, Project Name, Assigned Date, Due Date, Info (+ toggle), Actions (icons)
 */

const sampleProjects = [
  {
    id: 1,
    name: "Website Redesign",
    assignedDate: "2025-11-01",
    dueDate: "2025-12-15",
    info: "Redesign homepage, update branding, and improve accessibility.",
  },
  {
    id: 2,
    name: "Mobile App v2",
    assignedDate: "2025-10-20",
    dueDate: "2025-12-01",
    info: "Add offline mode, push notifications and analytics.",
  },
  {
    id: 3,
    name: "Internal Dashboard",
    assignedDate: "2025-09-15",
    dueDate: "2025-11-30",
    info: "Build new reporting widgets and role-based access.",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState(sampleProjects);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("assignedDate");
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const [expandedInfo, setExpandedInfo] = useState({}); // map id -> bool

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.info.toLowerCase().includes(s) ||
        String(p.id).includes(s)
    );

    list.sort((a, b) => {
      if (sortField === "name") {
        const aN = a.name.toLowerCase();
        const bN = b.name.toLowerCase();
        return sortOrder === "asc"
          ? aN.localeCompare(bN)
          : bN.localeCompare(aN);
      } else {
        // date fields
        const aD = new Date(a[sortField]);
        const bD = new Date(b[sortField]);
        return sortOrder === "asc" ? aD - bD : bD - aD;
      }
    });

    return list;
  }, [projects, search, sortField, sortOrder]);

  const toggleInfo = (id) => {
    setExpandedInfo((s) => ({ ...s, [id]: !s[id] }));
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const handleAddProject = () => {
    // placeholder: add a new sample project, replace with modal/form later
    const nextId = Math.max(0, ...projects.map((p) => p.id)) + 1;
    setProjects((p) => [
      ...p,
      {
        id: nextId,
        name: `New Project ${nextId}`,
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          .toISOString()
          .split("T")[0],
        info: "New project. Edit to add details.",
      },
    ]);
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="mb-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your projects: overview, assignments and deadlines.
          </p>
        </div>
      </div>

      <hr className="border-gray-800 mb-6" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded p-4">
          <div className="text-sm text-gray-400">Total Projects</div>
          <div className="text-2xl font-bold mt-2">{projects.length}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4">
          <div className="text-sm text-gray-400">Active</div>
          <div className="text-2xl font-bold mt-2">
            {projects.filter((p) => new Date(p.dueDate) > new Date()).length}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4">
          <div className="text-sm text-gray-400">Overdue</div>
          <div className="text-2xl font-bold mt-2">
            {projects.filter((p) => new Date(p.dueDate) < new Date()).length}
          </div>
        </div>
      </div>

      {/* Search & Sort Card */}
      <div className="bg-gray-900 border border-gray-800 rounded p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-800 rounded px-2 py-1">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="bg-transparent outline-none ml-2 text-sm placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-400">Sort:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-700"
              >
                <option value="assignedDate">Assigned Date</option>
                <option value="dueDate">Due Date</option>
                <option value="name">Project Name</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
                }
                className="bg-gray-800 px-2 py-1 rounded border border-gray-700"
                title="Toggle sort order"
              >
                <FaSortAmountDown />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded shadow"
            >
              <FaPlus />
              <span className="text-sm">Add Project</span>
            </button>
          </div>
        </div>

        {/* small helper text */}
        <div className="text-xs text-gray-500">
          Use search and sort to quickly locate projects.
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-gray-900 border border-gray-800 rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-400">
                Sr No
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">
                Project Name
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">
                Assigned Date
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-400">
                Info
              </th>
              <th className="px-4 py-3 text-right text-xs text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((p, idx) => (
              <React.Fragment key={p.id}>
                <tr className="hover:bg-gray-850">
                  <td className="px-4 py-3 text-sm text-gray-300">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-white">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {p.assignedDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {p.dueDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <button
                      onClick={() => toggleInfo(p.id)}
                      className="inline-flex items-center gap-2 px-2 py-1 bg-gray-800 rounded text-xs hover:bg-gray-700"
                      title="Toggle info"
                    >
                      <FaPlus className="text-gray-300" />
                      <span className="hidden sm:inline text-gray-300">
                        Info
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        className="p-2 bg-gray-800 rounded hover:bg-gray-700"
                        title="View"
                      >
                        <FaEye className="text-gray-300" />
                      </button>
                      <button
                        className="p-2 bg-gray-800 rounded hover:bg-gray-700"
                        title="Edit"
                      >
                        <FaEdit className="text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-red-700 rounded hover:bg-red-600"
                        title="Delete"
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Info expandable row */}
                {expandedInfo[p.id] && (
                  <tr className="bg-gray-950">
                    <td colSpan={6} className="px-4 py-3 text-sm text-gray-200">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="mt-1 text-indigo-400" />
                        <div>
                          <div className="font-semibold text-white">
                            Details
                          </div>
                          <div className="text-gray-300 mt-1">{p.info}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
