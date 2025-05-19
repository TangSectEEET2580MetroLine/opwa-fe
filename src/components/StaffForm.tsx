import React, { useState, useEffect } from 'react';
import Button from './Button';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  currentPassword: '',
  confirmPassword: '',
};

const placeholders = {
  firstName: 'Nguyen',
  lastName: 'A',
  email: 'example@domain.com',
  phoneNumber: '0924476329925',
  password: 'Enter new password',
  currentPassword: 'Enter current password',
  confirmPassword: 'Re-enter new password',
};

type StaffFormProps = {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initial?: any;
};

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, loading, initial }) => {
  const [form, setForm] = useState(initial || initialState);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(initialState);
  }, [initial]);

  const validateAll = () => {
    const errs: Record<string, string | null> = {};
    if (!form.firstName) errs.firstName = 'First name is required.';
    if (!form.lastName) errs.lastName = 'Last name is required.';
    if (!form.email) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.phoneNumber) errs.phoneNumber = 'Phone number is required.';
    if (!form.password) errs.password = 'Password is required.';
    if (!form.currentPassword) errs.currentPassword = 'Current password is required.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (validateAll()) {
      onSubmit(form);
    } else {
      setSubmitError('Please correct the errors above.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Staff Profile</h2>
      {submitError && (
        <div className="alert alert-error text-white py-2 px-4 mb-2">{submitError}</div>
      )}
      <div>
        <label htmlFor="firstName" className="label label-text">First Name</label>
        <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder={placeholders.firstName} disabled={loading} className="input input-bordered w-full" />
        {errors.firstName && <span className="text-error text-sm">{errors.firstName}</span>}
      </div>
      <div>
        <label htmlFor="lastName" className="label label-text">Last Name</label>
        <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder={placeholders.lastName} disabled={loading} className="input input-bordered w-full" />
        {errors.lastName && <span className="text-error text-sm">{errors.lastName}</span>}
      </div>
      <div>
        <label htmlFor="email" className="label label-text">Email Address</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder={placeholders.email} disabled={loading} className="input input-bordered w-full" />
        {errors.email && <span className="text-error text-sm">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="phoneNumber" className="label label-text">Phone Number</label>
        <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder={placeholders.phoneNumber} disabled={loading} className="input input-bordered w-full" />
        {errors.phoneNumber && <span className="text-error text-sm">{errors.phoneNumber}</span>}
      </div>
      <div>
        <label htmlFor="password" className="label label-text">New Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder={placeholders.password} disabled={loading} className="input input-bordered w-full" />
        {errors.password && <span className="text-error text-sm">{errors.password}</span>}
      </div>
      <div>
        <label htmlFor="currentPassword" className="label label-text">Current Password</label>
        <input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} placeholder={placeholders.currentPassword} disabled={loading} className="input input-bordered w-full" />
        {errors.currentPassword && <span className="text-error text-sm">{errors.currentPassword}</span>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="label label-text">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder={placeholders.confirmPassword} disabled={loading} className="input input-bordered w-full" />
        {errors.confirmPassword && <span className="text-error text-sm">{errors.confirmPassword}</span>}
      </div>
      <Button type="submit" disabled={loading} className="btn btn-success w-full mt-2">
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </form>
  );
};

export default StaffForm;