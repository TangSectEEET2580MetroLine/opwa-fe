import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import type { MetroLine, Station } from './MetroLineList';
import { generateTrips } from '../utils/tripSchedule';
import ScheduleOverview from './ScheduleOverview';
import TripList from './TripList';
import { CartItem } from '../context/TicketCartContext';

const emptyStation = (): Station => ({ id: Math.random().toString(36).slice(2, 10), name: '' });

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MetroLineModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<MetroLine, 'id'> & { firstDeparture: string; frequency: number }) => void;
  initial?: Omit<MetroLine, 'id'> & { firstDeparture?: string; frequency?: number };
  loading?: boolean;
}> = ({ open, onClose, onSubmit, initial, loading }) => {
  const getInitialForm = () => ({
    name: initial?.name || '',
    stations: initial?.stations || [emptyStation()],
    duration: initial?.duration || 0,
    firstDeparture: initial?.firstDeparture ?? '05:30',
    frequency: initial?.frequency ?? 10,
  });
  const [form, setForm] = useState<Omit<MetroLine, 'id'> & { firstDeparture: string; frequency: number }>(getInitialForm());
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({});

  useEffect(() => {
    setForm(getInitialForm());
    setErrors({});
  }, [initial, open]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    const { name, value } = e.target;
    if (name === 'stations' && typeof idx === 'number') {
      const stations = [...form.stations];
      stations[idx] = { ...stations[idx], name: value };
      setForm({ ...form, stations });
    } else if (name === 'duration' || name === 'frequency') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addStationField = () => {
    setForm({ ...form, stations: [...form.stations, emptyStation()] });
  };

  const removeStationField = (idx: number) => {
    if (form.stations.length > 1) {
      setForm({ ...form, stations: form.stations.filter((_, i) => i !== idx) });
    }
  };

  const validate = () => {
    const errs: { [k: string]: string | null } = {};
    if (!form.name.trim()) errs.name = 'Line name is required.';
    if (form.stations.some(s => !s.name.trim())) errs.stations = 'All stations must have a name.';
    if (!form.duration || form.duration <= 0) errs.duration = 'Duration must be greater than 0.';
    if (!timeRegex.test(form.firstDeparture)) errs.firstDeparture = "First departure must be in HH:mm format (e.g., 05:30).";
    if (!form.frequency || form.frequency <= 0) errs.frequency = 'Frequency must be greater than 0.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const trips = generateTrips(form.firstDeparture, form.frequency, form.duration);

  return (
    <Modal open={open} onClose={onClose}>
      <h2>{initial ? 'Edit Metro Line' : 'Create Metro Line'}</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 500 }}>Line Name</label>
        <input name="name" value={form.name} onChange={handleFormChange} required />
        {errors.name && <div className="error">{errors.name}</div>}
        <label style={{ fontWeight: 500 }}>Total Duration (min)</label>
        <input name="duration" type="number" min={1} value={form.duration} onChange={handleFormChange} required />
        {errors.duration && <div className="error">{errors.duration}</div>}
        <label style={{ fontWeight: 500 }}>First Departure Time (HH:mm)</label>
        <input name="firstDeparture" value={form.firstDeparture} onChange={handleFormChange} required placeholder="05:30" />
        {errors.firstDeparture && <div className="error">{errors.firstDeparture}</div>}
        <label style={{ fontWeight: 500 }}>Train Frequency (min)</label>
        <input name="frequency" type="number" min={1} value={form.frequency} onChange={handleFormChange} required />
        {errors.frequency && <div className="error">{errors.frequency}</div>}
        <label style={{ fontWeight: 500 }}>Stations (in order)</label>
        {form.stations.map((station, idx) => (
          <div key={station.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input name="stations" value={station.name} onChange={e => handleFormChange(e, idx)} required />
            {form.stations.length > 1 && (
              <Button type="button" variant="outline" style={{ padding: '0 8px' }} onClick={() => removeStationField(idx)}>-</Button>
            )}
          </div>
        ))}
        {errors.stations && <div className="error">{errors.stations}</div>}
        <Button type="button" variant="outline" style={{ marginBottom: 16 }} onClick={addStationField}>+ Add Station</Button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{initial ? 'Save' : 'Create'}</Button>
        </div>
      </form>
      <ScheduleOverview trips={trips} />
      <TripList trips={trips} />
    </Modal>
  );
};

export default MetroLineModal;