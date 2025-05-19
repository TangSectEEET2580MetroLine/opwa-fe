"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from '../ProtectedRoute';
import LogoutButton from '../../components/LogoutButton';
import StaffForm from '../../components/StaffForm';
import { getCurrentStaffProfile, updateCurrentStaffProfile, StaffResponse, StaffRequest } from '../../api/staff';
import Button from '../../components/Button';
import { useAuth } from '../AuthContext';

export default function StaffProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<StaffResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCurrentStaffProfile(token || undefined)
      .then(setProfile)
      .catch(e => setError((e as Error).message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdate = async (data: Partial<StaffRequest>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateCurrentStaffProfile(data, token || undefined);
      setProfile(updated);
      setSuccess('Profile updated successfully.');
      setShowForm(false);
    } catch (e) {
      setError((e as Error).message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_TICKET_AGENT']}>
        <div>Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_OPERATOR', 'ROLE_TICKET_AGENT']}>
      <div className="card" style={{ maxWidth: 600, margin: '40px auto' }}>
        <h1>Staff Profile</h1>
        {error && <div className="error">{error}</div>}
        {success && <div style={{ color: '#388e3c', background: '#eafaf1', border: '1px solid #b2dfdb', padding: 8, borderRadius: 6, marginBottom: 16 }}>{success}</div>}
        <div style={{ marginBottom: 16 }}>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Name:</b> {profile.firstName} {profile.lastName}</p>
          <p><b>Phone:</b> {profile.phoneNumber}</p>
        </div>
        <Button onClick={() => setShowForm(true)} style={{ marginBottom: 16 }}>Edit Profile</Button>
        {showForm && (
          <div style={{ background: 'rgba(0,0,0,0.18)', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ minWidth: 350, maxWidth: 520, position: 'relative' }}>
              <StaffForm
                onSubmit={handleUpdate}
                loading={loading}
                initial={profile}
              />
              <Button variant="outline" onClick={() => setShowForm(false)} style={{ marginTop: 8 }}>Cancel</Button>
            </div>
          </div>
        )}
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}