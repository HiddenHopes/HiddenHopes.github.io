import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  onClose?: () => void;
  defaultCourse?: string;
  courseConfig?: {
    fullstack?: boolean;
    web3d?: boolean;
    problem?: boolean;
  };
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess, onClose, defaultCourse, courseConfig }) => {
  const { t } = useTranslation();

  // Configurable field enable/disable
  const fieldConfig = {
    name: true,
    email: true,
    mobile: true,
    course: true,
    university: true, 
    year: false,
    semester: false,
    batch: false,
    dept: false,
    comments: true,
  };

  // To disable a field, set its value to false above.
  
  const COURSE_OPTIONS = [
    { value: '', label: t('form.select_course'), disabled: false },
    { value: 'fullstack', label: t('courses.fullstack'), disabled: courseConfig && courseConfig.fullstack === false },
    { value: 'problem-solving', label: t('courses.problem'), disabled: courseConfig && courseConfig.problem === false },
    { value: '3d-development', label: t('courses.3d'), disabled: courseConfig && courseConfig.web3d === false },
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

  const [form, setForm] = useState({ ...initialState, course: defaultCourse || '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation logic for each field
  const validateFields = () => {
    const errors: { [key: string]: string } = {};
    if (fieldConfig.name && !validateName(form.name)) errors.name = t('form.name_validation');
    if (fieldConfig.email && !validateEmail(form.email)) errors.email = t('form.email_validation');
    if (fieldConfig.mobile && !validateMobile(form.mobile)) errors.mobile = t('form.phone_validation');
    if (fieldConfig.course && !form.course) errors.course = t('form.course_required');
    if (fieldConfig.university && !form.university) errors.university = t('form.university_required');
    if (fieldConfig.year && !form.year) errors.year = t('form.year_required');
    if (fieldConfig.semester && !form.semester) errors.semester = t('form.semester_required');
    if (fieldConfig.batch && !validateBatch(form.batch)) errors.batch = t('form.batch_validation');
    if (fieldConfig.dept && !form.dept) errors.dept = t('form.department_required');
    return errors;
  };

  // Update field errors on change, but only show for touched fields
  React.useEffect(() => {
    const errors = validateFields();
    const filtered: { [key: string]: string } = {};
    Object.keys(errors).forEach(key => {
      if (touched[key]) filtered[key] = errors[key];
    });
    setFieldErrors(filtered);
  }, [form, touched, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(t('form.required_fields_missing'));
      setSuccess(false);
      toast.error(t('form.toast_error'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          { ...form, registration_date: new Date().toISOString() },
        ]);
      if (error) {
        setError(t('form.registration_failed') + ' ' + (error.message || t('form.please_try_again')));
        setSuccess(false);
        toast.error(t('form.toast_error'));
      } else {
        setSuccess(true);
        toast.success(t('form.success'));
        // Delay closing the form so the toast is visible
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            setForm(initialState);
          }, 1500);
        }
      }
    } catch (err) {
      setError(t('form.registration_failed') + ' ' + t('form.please_try_again'));
      setSuccess(false);
      toast.error(t('form.toast_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="scrollable-form-container"
      style={{
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#232946',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            width: 32,
            height: 32,
            fontSize: 20,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0004',
            zIndex: 2002
          }}
          aria-label="Close registration form"
        >×</button>
      )}
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        boxShadow: '0 2px 16px #51ff8b33',
        padding: 32,
        maxWidth: 420,
        width: '100%',
        margin: '50px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxSizing: 'border-box',
      }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 8 }}>{t('form.student_registration')}</h2>
      {fieldConfig.name && <>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
          placeholder={t('form.full_name')}
          required
          pattern="[A-Za-z .-]+"
          title={t('form.name_validation')}
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.name ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        />
        {fieldErrors.name && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.name}</div>}
      </>}
      {fieldConfig.email && <>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
          placeholder={t('form.email')}
          required
          type="email"
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.email ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        />
        {fieldErrors.email && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.email}</div>}
      </>}
      {fieldConfig.mobile && <>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, mobile: true }))}
          placeholder={t('form.mobile')}
          required
          inputMode="numeric"
          pattern="\d{10,15}"
          title={t('form.phone_validation')}
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.mobile ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        />
        {fieldErrors.mobile && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.mobile}</div>}
      </>}
      {fieldConfig.course && <>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, course: true }))}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.course ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        >
          {COURSE_OPTIONS.filter(opt => !opt.disabled).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {fieldErrors.course && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.course}</div>}
      </>}
      {fieldConfig.university && <>
        <select
          name="university"
          value={form.university}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, university: true }))}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.university ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        >
          {UNIVERSITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {fieldErrors.university && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.university}</div>}
      </>}
      {fieldConfig.year && <>
        <select
          name="year"
          value={form.year}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, year: true }))}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.year ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        >
          {YEAR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {fieldErrors.year && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.year}</div>}
      </>}
      {fieldConfig.semester && <>
        <select
          name="semester"
          value={form.semester}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, semester: true }))}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.semester ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        >
          {SEMESTER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {fieldErrors.semester && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.semester}</div>}
      </>}
      {fieldConfig.batch && <>
        <input
          name="batch"
          value={form.batch}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, batch: true }))}
          placeholder={t('form.batch')}
          required
          inputMode="numeric"
          pattern="\d{1,3}"
          title={t('form.batch_validation')}
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.batch ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        />
        {fieldErrors.batch && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.batch}</div>}
      </>}
      {fieldConfig.dept && <>
        <select
          name="dept"
          value={form.dept}
          onChange={handleChange}
          onBlur={() => setTouched(t => ({ ...t, dept: true }))}
          required
          style={{
            padding: 10,
            borderRadius: 8,
            border: fieldErrors.dept ? '2px solid #d7263d' : '1.5px solid #51ff8b',
            fontSize: 16,
          }}
        >
          {DEPT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {fieldErrors.dept && <div style={{ color: '#d7263d', fontSize: 13, marginTop: 2 }}>{fieldErrors.dept}</div>}
      </>}
      {fieldConfig.comments && <>
        <textarea
          name="comments"
          value={form.comments}
          onChange={handleChange}
          placeholder={t('form.comments')}
          rows={3}
          style={{ padding: 10, borderRadius: 8, border: '1.5px solid #51ff8b', fontSize: 16, resize: 'vertical' }}
        />
      </>}
      {success && <div style={{ color: 'green', textAlign: 'center', fontWeight: 500 }}>{t('form.success')}</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        style={{
          background: '#51ff8b',
          color: '#232946',
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          borderRadius: 8,
          padding: '12px 0',
          marginTop: 8,
          cursor: !submitting ? 'pointer' : 'not-allowed',
          boxShadow: '0 2px 8px #51ff8b44',
          transition: 'background 0.2s',
        }}
      >
        {submitting ? t('form.submitting') : t('form.submit')}
      </button>
      <style>{`
        @media (max-width: 600px) {
          .scrollable-form-container {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1000 !important;
            background: rgba(255,255,255,0.95) !important;
          }
          .scrollable-form-container::-webkit-scrollbar {
            display: none !important;
          }
          .scrollable-form-container {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
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
    </div>
  );
};

export default StudentRegistrationForm;
