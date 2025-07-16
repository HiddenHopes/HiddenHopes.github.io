import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabaseClient';

const initialState = {
  name: '',
  email: '',
  mobile: '',
  course: '',
  university: '',
  year: '',
  semester: '',
  batch: '',
  dept: '',
  comments: '',
};

function validateName(name: string) {
  return /^[A-Za-z .-]+$/.test(name.trim());
}
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateMobile(mobile: string) {
  return /^\d{10,15}$/.test(mobile);
}
function validateBatch(batch: string) {
  return /^\d{1,3}$/.test(batch) && Number(batch) >= 1 && Number(batch) <= 999;
}

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  
  const COURSE_OPTIONS = [
    { value: '', label: t('form.select_course') },
    { value: 'fullstack', label: t('courses.fullstack') },
    { value: 'problem-solving', label: t('courses.problem') },
    { value: '3d-development', label: t('courses.3d') },
  ];

  const UNIVERSITY_OPTIONS = [
    { value: '', label: t('form.select_university') },
    { value: 'RU', label: 'Rajshahi University (RU)' },
    { value: 'VU', label: 'Varendra University (VU)' },
    { value: 'NSU', label: 'North South University (NSU)' },
    { value: 'DU', label: 'Dhaka University (DU)' },
    { value: 'CU', label: 'Chittagong University (CU)' },
    // Add more as needed
  ];

  const YEAR_OPTIONS = [
    { value: '', label: t('form.select_year') },
    { value: '1st', label: '1st' },
    { value: '2nd', label: '2nd' },
    { value: '3rd', label: '3rd' },
    { value: '4th', label: '4th' },
  ];

  const SEMESTER_OPTIONS = [
    { value: '', label: t('form.select_semester') },
    ...Array.from({ length: 8 }, (_, i) => ({ value: `${i+1}`, label: `${i+1}th` }))
  ];

  const DEPT_OPTIONS = [
    { value: '', label: t('form.select_department') },
    { value: 'cse', label: 'CSE' },
    { value: 'eee', label: 'EEE' },
    { value: 'ete', label: 'ETE' },
    { value: 'civil', label: 'Civil' },
    { value: 'me', label: 'ME' },
    // Add more as needed
  ];

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    validateName(form.name) &&
    validateEmail(form.email) &&
    validateMobile(form.mobile) &&
    form.course &&
    form.university &&
    form.year &&
    form.semester &&
    validateBatch(form.batch) &&
    form.dept;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          { ...form, registration_date: new Date().toISOString() },
        ]);
      if (error) {
        setError('Registration failed. ' + (error.message || 'Please try again.'));
        setSuccess(false);
      } else {
        setSuccess(true);
        setForm(initialState);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 16,
      boxShadow: '0 2px 16px #51ff8b33',
      padding: 32,
      maxWidth: 420,
      width: '100%',
      margin: '32px auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      boxSizing: 'border-box',
    }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 8 }}>{t('form.student_registration')}</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder={t('form.full_name')}
        required
        pattern="[A-Za-z .-]+"
        title={t('tooltips.name_validation')}
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder={t('form.email')}
        required
        type="email"
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      />
      <input
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder={t('form.mobile')}
        required
        inputMode="numeric"
        pattern="\d{10,15}"
        title={t('tooltips.phone_validation')}
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      />
      <select
        name="course"
        value={form.course}
        onChange={handleChange}
        required
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      >
        {COURSE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <select
        name="university"
        value={form.university}
        onChange={handleChange}
        required
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      >
        {UNIVERSITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <select
        name="year"
        value={form.year}
        onChange={handleChange}
        required
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      >
        {YEAR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <select
        name="semester"
        value={form.semester}
        onChange={handleChange}
        required
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      >
        {SEMESTER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <input
        name="batch"
        value={form.batch}
        onChange={handleChange}
        placeholder={t('form.batch')}
        required
        inputMode="numeric"
        pattern="\d{1,3}"
        title={t('tooltips.batch_validation')}
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      />
      <select
        name="dept"
        value={form.dept}
        onChange={handleChange}
        required
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16 }}
      >
        {DEPT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <textarea
        name="comments"
        value={form.comments}
        onChange={handleChange}
        placeholder={t('form.comments')}
        rows={3}
        style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16, resize: 'vertical' }}
      />
      {success && <div style={{ color: 'green', textAlign: 'center', fontWeight: 500 }}>{t('form.success')}</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      <button
        type="submit"
        disabled={!isValid || submitting}
        style={{
          background: isValid ? '#51ff8b' : '#b3e0ff',
          color: '#232946',
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          borderRadius: 8,
          padding: '12px 0',
          marginTop: 8,
          cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
          boxShadow: '0 2px 8px #51ff8b44',
          transition: 'background 0.2s',
        }}
      >
        {submitting ? t('form.submitting') : t('form.submit')}
      </button>
      <style>{`
        @media (max-width: 600px) {
          form {
            padding: 12px !important;
            max-width: 98vw !important;
            font-size: 15px !important;
          }
          form h2 {
            font-size: 1.2rem !important;
          }
          form button {
            font-size: 1rem !important;
            padding: 10px 0 !important;
          }
        }
      `}</style>
    </form>
  );
};

export default StudentRegistrationForm;
