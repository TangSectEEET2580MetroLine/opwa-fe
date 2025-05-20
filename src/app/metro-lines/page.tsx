"use client";

import React, { useEffect, useState } from "react";
import { getAllMetroLines, createMetroLine, updateMetroLine, deleteMetroLine, createStation, updateStation, deleteStation, getAllStations } from "../../api/metroLines";
import type { MetroLine, Station } from "../../components/MetroLineList";
import type { StationRequest, MetroLineRequest, MetroLineResponse } from "../../api/metroLines";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from '../AuthContext';

interface MetroLineForm {
  id?: string;
  name: string;
  description: string;
  totalDurationMinutes: number;
  isActive: boolean;
  stations: StationForm[];
}

interface StationForm {
  id?: string;
  name: string;
  description: string;
  location: string;
  isActive: boolean;
}

const initialForm: MetroLineForm = { name: '', description: '', totalDurationMinutes: 0, isActive: true, stations: [{ id: '', name: '', description: '', location: '', isActive: true }] };
const initialStationForm: StationForm = { id: '', name: '', description: '', location: '', isActive: true };

const MetroLinesPage = () => {
  const { token } = useAuth();
  const [lines, setLines] = useState<MetroLine[]>([]);
  const [stations, setStations] = useState<StationRequest[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<MetroLineForm>(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [stationForm, setStationForm] = useState<StationForm>(initialStationForm);
  const [stationEditId, setStationEditId] = useState<string | null>(null);
  const [showManageStations, setShowManageStations] = useState(false);

  useEffect(() => {
    getAllMetroLines(token || undefined)
      .then((data) => setLines(Array.isArray(data) ? data.map(fromMetroLineResponse) : []))
      .catch((err) => setError((err as Error)?.message || "Failed to load metro lines"));
    getAllStations(token || undefined)
      .then(setStations)
      .catch(() => setStations([]));
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
    setForm({
      id: line.id,
      name: line.name,
      description: (line as unknown as { description?: string }).description || '',
      totalDurationMinutes: line.duration,
      isActive: (line as unknown as { isActive?: boolean }).isActive !== undefined ? (line as unknown as { isActive?: boolean }).isActive! : true,
      stations: line.stations.map((s: Station): StationForm => ({ id: s.id, name: s.name, description: '', location: '', isActive: true })),
    });
    setIsEdit(true);
    setShowModal(true);
    setEditId(line.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx?: number) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name.startsWith('stations.') && typeof idx === 'number') {
      const field = name.split('.')[2];
      const stationsArr: StationForm[] = [...form.stations];
      stationsArr[idx] = { ...stationsArr[idx], [field]: type === 'checkbox' ? checked : value };
      setForm({ ...form, stations: stationsArr });
    } else if (name === 'isActive') {
      setForm({ ...form, isActive: checked });
    } else if (name === 'totalDurationMinutes') {
      setForm({ ...form, totalDurationMinutes: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleStationSelect = (stationId: string, idx: number) => {
    const selected = stations.find(s => String(s.id) === stationId);
    if (!selected) return;
    const stationsArr = [...form.stations];
    stationsArr[idx] = { ...selected, id: String(selected.id) };
    setForm({ ...form, stations: stationsArr });
  };

  const addStationField = () => {
    setForm({ ...form, stations: [...form.stations, { id: '', name: '', description: '', location: '', isActive: true }] });
  };

  const removeStationField = (idx: number) => {
    if (form.stations.length > 1) {
      setForm({ ...form, stations: form.stations.filter((_: StationForm, i: number) => i !== idx) });
    }
  };

  const moveStationField = (idx: number, dir: -1 | 1) => {
    const stationsArr = [...form.stations];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= stationsArr.length) return;
    [stationsArr[idx], stationsArr[newIdx]] = [stationsArr[newIdx], stationsArr[idx]];
    setForm({ ...form, stations: stationsArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isEdit && editId) {
        const updated = await updateMetroLine(editId, toMetroLineRequest(form), token || undefined);
        setLines(lines => lines.map(l => l.id === editId ? fromMetroLineResponse(updated) : l));
        setSuccess('Metro line updated successfully.');
      } else {
        const created = await createMetroLine(toMetroLineRequest(form), token || undefined);
        setLines(lines => [...lines, fromMetroLineResponse(created)]);
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
  const openManageStations = () => {
    setShowManageStations(true);
  };

  const closeManageStations = () => {
    setShowManageStations(false);
    setStationForm(initialStationForm);
    setStationEditId(null);
  };

  const handleStationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setStationForm({ ...stationForm, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditStationModal = (station: StationRequest) => {
    setStationForm({
      id: String(station.id),
      name: station.name || '',
      description: station.description || '',
      location: station.location || '',
      isActive: station.isActive !== undefined ? station.isActive : true,
    });
    setStationEditId(String(station.id));
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await createStation({ ...stationForm, id: 0 }, token || undefined);
      setStations(stations => [...stations, created]);
      setStationForm(initialStationForm);
      setSuccess('Station created successfully.');
    } catch (err) {
      setError((err as Error)?.message || 'Failed to create station.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationEditId) return;
    setLoading(true);
    try {
      const updated = await updateStation(Number(stationEditId), { ...stationForm, id: Number(stationEditId) }, token || undefined);
      setStations(stations => stations.map(s => String(s.id) === stationEditId ? updated : s));
      setStationForm(initialStationForm);
      setStationEditId(null);
      setSuccess('Station updated successfully.');
    } catch (err) {
      setError((err as Error)?.message || 'Failed to update station.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStationStandalone = async (id: string | number) => {
    if (!window.confirm('Delete this station?')) return;
    setLoading(true);
    try {
      await deleteStation(id, token || undefined);
      setStations(stations => stations.filter(s => String(s.id) !== String(id)));
      setSuccess('Station deleted successfully.');
    } catch (err) {
      setError((err as Error)?.message || 'Failed to delete station.');
    } finally {
      setLoading(false);
    }
  };

  // Conversion helpers
  function toStationRequest(station: StationForm, idx: number): StationRequest {
    return {
      id: station.id !== undefined && station.id !== '' ? Number(station.id) : idx,
      name: station.name || '',
      description: station.description || '',
      location: station.location || '',
      isActive: station.isActive !== undefined ? station.isActive : true,
    };
  }

  function toMetroLineRequest(line: MetroLineForm, idx?: number): MetroLineRequest {
    const stations = (line.stations || []).map((s: StationForm, i: number) => toStationRequest(s, i));
    return {
      id: line.id !== undefined && line.id !== '' ? Number(line.id) : idx ?? 0,
      name: line.name || '',
      description: line.description || '',
      totalDurationMinutes: line.totalDurationMinutes !== undefined ? Number(line.totalDurationMinutes) : Number((line as unknown as { duration?: number }).duration) || 0,
      stations,
      isActive: line.isActive !== undefined ? line.isActive : true,
      startStation: stations[0] || toStationRequest({} as StationForm, 0),
      endStation: stations[stations.length - 1] || toStationRequest({} as StationForm, 0),
    };
  }

  function fromMetroLineResponse(resp: MetroLineResponse): MetroLine {
    return {
      id: String(resp.id),
      name: resp.name,
      stations: resp.stations.map((s: StationRequest) => ({ id: String(s.id), name: s.name })),
      duration: resp.totalDurationMinutes,
      // Optionally add description, isActive, etc. if needed in UI
    };
  }

  return (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_OPERATOR"]}>
      <div className="flex flex-col items-center min-h-[80vh] py-8">
        <div className="card bg-base-100 shadow-xl w-full max-w-4xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Metro Line Management</h1>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={openCreateModal}>
                + Create Metro Line
              </button>
              <button className="btn btn-secondary" onClick={openManageStations}>
                🏢 Manage Stations
              </button>
            </div>
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
                          <button className="btn btn-outline btn-xs" onClick={() => openManageStations()} disabled={loading}>Manage Stations</button>
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
                    <input name="totalDurationMinutes" type="number" min={1} value={form.totalDurationMinutes} onChange={handleFormChange} required className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label font-semibold">Stations (in order)</label>
                {form.stations.map((station, idx) => (
                      <div key={station.id} className="flex gap-2 mb-2">
                        <select
                          value={station.name}
                          onChange={(e) => handleStationSelect(e.target.value, idx)}
                          required
                          className="select select-bordered select-sm flex-1"
                        >
                          <option value="">Select a station</option>
                          {stations.map((s) => (
                            <option key={s.id} value={String(s.id)}>
                              {s.name}
                            </option>
                          ))}
                        </select>
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
        {showManageStations && (
          <>
            <div className="modal modal-open">
              <div className="modal-box max-w-lg w-full" role="dialog" aria-modal="true">
                <h2 className="font-bold text-lg mb-4">Manage Stations</h2>
                <ol className="list-decimal ml-6 mt-2">
                {stations.map((station: StationRequest, idx: number, arr: StationRequest[]) => (
                    <li key={station.id} className="flex items-center gap-2 mb-2">
                      <span className="flex-1">{station.name}</span>
                      <button className="btn btn-outline btn-xs" onClick={() => moveStationField(idx, -1)} disabled={idx === 0 || loading}>↑</button>
                      <button className="btn btn-outline btn-xs" onClick={() => moveStationField(idx, 1)} disabled={idx === arr.length - 1 || loading}>↓</button>
                      <button className="btn btn-outline btn-xs" onClick={() => handleEditStationModal(station)} disabled={loading}>Edit</button>
                      <button className="btn btn-error btn-xs text-white" onClick={() => handleDeleteStationStandalone(station.id)} disabled={loading}>Delete</button>
                  </li>
                ))}
              </ol>
                <form onSubmit={stationEditId ? handleUpdateStation : handleCreateStation} className="flex flex-wrap gap-2 mt-4">
                <input
                  placeholder="Station name"
                  value={stationForm.name || ''}
                  onChange={handleStationFormChange}
                  required
                  className="input input-bordered flex-1"
                />
                  <button type="submit" className="btn btn-primary btn-xs" disabled={loading}>
                  {stationEditId ? 'Save' : 'Add'}
                </button>
                  <button type="button" className="btn btn-outline btn-xs" onClick={closeManageStations} disabled={loading}>Close</button>
              </form>
              </div>
              <label className="modal-backdrop" onClick={closeManageStations}></label>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MetroLinesPage;