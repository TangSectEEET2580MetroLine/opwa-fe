"use client";

import React, { useEffect, useState } from "react";
import { getAllMetroLines, createMetroLine, updateMetroLine, deleteMetroLine, createStation, updateStation, deleteStation } from "../../api/metroLines";
import type { MetroLine, Station } from "../../components/MetroLineList";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from '../AuthContext';

const initialForm: Omit<MetroLine, 'id'> = { name: '', stations: [], duration: 0 };
const initialStationForm: Omit<Station, 'id'> = { name: '' };

const MetroLinesPage = () => {
  const { token } = useAuth();
  const [lines, setLines] = useState<MetroLine[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<MetroLine, 'id'>>(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [stationLineId, setStationLineId] = useState<string | null>(null);
  const [stationForm, setStationForm] = useState<Omit<Station, 'id'>>(initialStationForm);
  const [stationEditId, setStationEditId] = useState<string | null>(null);
  const [stationLoading, setStationLoading] = useState(false);

  useEffect(() => {
    getAllMetroLines(token || undefined)
      .then((data) => setLines(Array.isArray(data) ? data : []))
      .catch((err) => setError((err as Error)?.message || "Failed to load metro lines"));
  }, [token]);

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowModal(true);
    setEditId(null);
  };

  const openEditModal = (line: MetroLine) => {
    setForm({ name: line.name, stations: [...line.stations], duration: line.duration });
    setIsEdit(true);
    setShowModal(true);
    setEditId(line.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    const { name, value } = e.target;
    if (name === 'stations' && typeof idx === 'number') {
      const stations = [...form.stations];
      stations[idx] = { ...stations[idx], name: value };
      setForm({ ...form, stations });
    } else if (name === 'duration') {
      setForm({ ...form, duration: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addStationField = () => {
    setForm({ ...form, stations: [...form.stations, { id: Math.random().toString(36).slice(2, 10), name: '' }] });
  };

  const removeStationField = (idx: number) => {
    if (form.stations.length > 1) {
      setForm({ ...form, stations: form.stations.filter((_, i) => i !== idx) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isEdit && editId) {
        const updated = await updateMetroLine(editId, form, token || undefined);
        setLines(lines => lines.map(l => l.id === editId ? updated : l));
        setSuccess('Metro line updated successfully.');
      } else {
        const created = await createMetroLine(form, token || undefined);
        setLines(lines => [...lines, created]);
        setSuccess('Metro line created successfully.');
      }
      closeModal();
    } catch (err) {
      setError((err as Error)?.message || 'Failed to save metro line.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this metro line?')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        await deleteMetroLine(id, token || undefined);
        setLines(lines => lines.filter(l => l.id !== id));
        setSuccess('Metro line deleted successfully.');
      } catch (err) {
        setError((err as Error)?.message || 'Failed to delete metro line.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Station CRUD ---
  const openStationModal = (lineId: string) => {
    setStationLineId(lineId);
    setShowStationModal(true);
    setStationForm(initialStationForm);
    setStationEditId(null);
  };

  const closeStationModal = () => {
    setShowStationModal(false);
    setStationLineId(null);
    setStationForm(initialStationForm);
    setStationEditId(null);
  };

  const handleStationFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStationForm({ ...stationForm, name: e.target.value });
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationLineId) return;
    setStationLoading(true);
    try {
      const newStation = await createStation(stationForm, token || undefined);
      setLines(lines => lines.map(line =>
        line.id === stationLineId ? { ...line, stations: [...line.stations, newStation] } : line
      ));
      setStationForm(initialStationForm);
    } finally {
      setStationLoading(false);
    }
  };

  const handleEditStation = (station: Station) => {
    setStationForm({ name: station.name });
    setStationEditId(station.id);
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationLineId || !stationEditId) return;
    setStationLoading(true);
    try {
      const updated = await updateStation(stationEditId, stationForm, token || undefined);
      setLines(lines => lines.map(line =>
        line.id === stationLineId
          ? { ...line, stations: line.stations.map(s => s.id === stationEditId ? updated : s) }
          : line
      ));
      setStationForm(initialStationForm);
      setStationEditId(null);
    } finally {
      setStationLoading(false);
    }
  };

  const handleDeleteStation = async (stationId: string) => {
    if (!stationLineId) return;
    if (!window.confirm('Delete this station?')) return;
    setStationLoading(true);
    try {
      await deleteStation(stationId, token || undefined);
      setLines(lines => lines.map(line =>
        line.id === stationLineId
          ? { ...line, stations: line.stations.filter(s => s.id !== stationId) }
          : line
      ));
    } finally {
      setStationLoading(false);
    }
  };

  // Reorder stations (move up/down)
  const moveStation = async (idx: number, dir: -1 | 1) => {
    if (!stationLineId) return;
    setStationLoading(true);
    setLines(lines => lines.map(line => {
      if (line.id !== stationLineId) return line;
      const stations = [...line.stations];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= stations.length) return line;
      [stations[idx], stations[newIdx]] = [stations[newIdx], stations[idx]];
      return { ...line, stations };
    }));
    setStationLoading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_OPERATOR"]}>
      <div className="flex flex-col items-center min-h-[80vh] py-8">
        <div className="card bg-base-100 shadow-xl w-full max-w-4xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Metro Line Management</h1>
            <button className="btn btn-primary" onClick={openCreateModal}>
          + Create Metro Line
        </button>
          </div>
          {error && <div className="alert alert-error mb-4 text-white">{error}</div>}
          {success && <div className="alert alert-success mb-4 text-white">{success}</div>}
          <div className="overflow-x-auto">
            <table className="table w-full">
          <thead>
                <tr>
                  <th>Line Name</th>
                  <th>Start Station</th>
                  <th>End Station</th>
                  <th>Total Duration (min)</th>
                  <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <React.Fragment key={line.id}>
                    <tr className={expanded === line.id ? 'bg-base-200' : ''}>
                      <td onClick={() => handleExpand(line.id)} className="cursor-pointer font-semibold">{line.name}</td>
                      <td>{line.stations?.[0]?.name || "-"}</td>
                      <td>{line.stations?.[line.stations.length - 1]?.name || "-"}</td>
                      <td>{line.duration}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button className="btn btn-outline btn-xs" onClick={() => openEditModal(line)} disabled={loading}>Edit</button>
                          <button className="btn btn-outline btn-xs" onClick={() => openStationModal(line.id)} disabled={loading}>Manage Stations</button>
                          <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(line.id)} disabled={loading}>Delete</button>
                        </div>
                  </td>
                      <td onClick={() => handleExpand(line.id)} className="cursor-pointer text-lg">{expanded === line.id ? "▲" : "▼"}</td>
                </tr>
                {expanded === line.id && (
                  <tr>
                        <td colSpan={6} className="bg-base-200 p-4">
                      <b>Stations:</b>
                          <ol className="list-decimal ml-6 mt-2">
                        {line.stations?.map((station) => (
                          <li key={station.id}>{station.name}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
          </div>
        </div>

        {/* Modal for create/edit metro line */}
        {showModal && (
          <>
            <div className="modal modal-open">
              <div className="modal-box max-w-md w-full" role="dialog" aria-modal="true">
                <h2 className="font-bold text-lg mb-4">{isEdit ? 'Edit Metro Line' : 'Create Metro Line'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label font-semibold">Line Name</label>
                    <input name="name" value={form.name} onChange={handleFormChange} required className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label font-semibold">Total Duration (min)</label>
                    <input name="duration" type="number" min={1} value={form.duration} onChange={handleFormChange} required className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label font-semibold">Stations (in order)</label>
                {form.stations.map((station, idx) => (
                      <div key={station.id} className="flex gap-2 mb-2">
                        <input name="stations" value={station.name} onChange={e => handleFormChange(e, idx)} required className="input input-bordered flex-1" />
                    {form.stations.length > 1 && (
                          <button type="button" className="btn btn-outline btn-xs" onClick={() => removeStationField(idx)}>-</button>
                    )}
                  </div>
                ))}
                    <button type="button" className="btn btn-outline btn-xs mt-2" onClick={addStationField}>+ Add Station</button>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline" onClick={closeModal} disabled={loading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{isEdit ? 'Save' : 'Create'}</button>
                </div>
              </form>
            </div>
              <label className="modal-backdrop" onClick={closeModal}></label>
          </div>
          </>
        )}

        {/* Modal for station CRUD */}
        {showStationModal && stationLineId && (
          <>
            <div className="modal modal-open">
              <div className="modal-box max-w-lg w-full" role="dialog" aria-modal="true">
                <h2 className="font-bold text-lg mb-4">Manage Stations</h2>
                <ol className="list-decimal ml-6 mt-2">
                {lines.find(l => l.id === stationLineId)?.stations.map((station, idx, arr) => (
                    <li key={station.id} className="flex items-center gap-2 mb-2">
                      <span className="flex-1">{station.name}</span>
                      <button className="btn btn-outline btn-xs" onClick={() => moveStation(idx, -1)} disabled={idx === 0 || stationLoading}>↑</button>
                      <button className="btn btn-outline btn-xs" onClick={() => moveStation(idx, 1)} disabled={idx === arr.length - 1 || stationLoading}>↓</button>
                      <button className="btn btn-outline btn-xs" onClick={() => handleEditStation(station)} disabled={stationLoading}>Edit</button>
                      <button className="btn btn-error btn-xs text-white" onClick={() => handleDeleteStation(station.id)} disabled={stationLoading}>Delete</button>
                  </li>
                ))}
              </ol>
                <form onSubmit={stationEditId ? handleUpdateStation : handleAddStation} className="flex flex-wrap gap-2 mt-4">
                <input
                  placeholder="Station name"
                  value={stationForm.name}
                  onChange={handleStationFormChange}
                  required
                    className="input input-bordered flex-1"
                />
                  <button type="submit" className="btn btn-primary btn-xs" disabled={stationLoading}>
                  {stationEditId ? 'Save' : 'Add'}
                </button>
                  <button type="button" className="btn btn-outline btn-xs" onClick={closeStationModal} disabled={stationLoading}>Close</button>
              </form>
              </div>
              <label className="modal-backdrop" onClick={closeStationModal}></label>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MetroLinesPage;