import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabaseClient';

interface Student {
  id: number;
  name: string;
  course: string;
  university: string;
  email: string;
  registration_date?: string;
}

interface StudentListPageProps {
  isNight?: boolean;
}

const StudentListPage: React.FC<StudentListPageProps> = ({ isNight = false }) => {
  const { t } = useTranslation();
  
  const COURSE_TABS = [
    { key: 'fullstack', label: t('courses.fullstack') },
    { key: '3d-development', label: t('courses.3d') },
    { key: 'problem-solving', label: t('courses.problem') },
  ];
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCourse, setActiveCourse] = useState(COURSE_TABS[0].key);

  // Configuration: set to true to show, false to hide
  const STUDENT_LIST_FIELDS = {
    name: true,
    course: false,
    university: true,
    email: false,
    registration_date: false,
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('registrations')
        .select('id, name, course, university, email, registration_date')
        .order('registration_date', { ascending: true });
      if (error) setError('Failed to fetch students.');
      else setStudents(data || []);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  // Filter students by active course
  const filteredStudents = students.filter(s => s.course === activeCourse);
  const enabledFields = (Object.keys(STUDENT_LIST_FIELDS) as Array<keyof typeof STUDENT_LIST_FIELDS>).filter(k => STUDENT_LIST_FIELDS[k]);

  return (
    <div style={{
      maxWidth: 700,
      margin: '32px auto',
      background: isNight ? 'rgba(35,41,70,0.97)' : 'rgba(255,255,255,0.97)',
      borderRadius: 16,
      boxShadow: isNight ? '0 2px 16px #23294688' : '0 2px 16px #51ff8b33',
      padding: 24,
      minHeight: 320,
      color: isNight ? '#ffe259' : '#232946',
    }}>
      <h2 style={{ textAlign: 'center', color: isNight ? '#51ff8b' : '#1976d2', marginBottom: 18 }}>{t('students.registered_students')}</h2>
      {/* Tabs for courses */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 0,
        borderBottom: isNight ? '2px solid #51ff8b' : '2px solid #1976d2',
        background: isNight ? '#232946' : '#f7f7f7',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px #51ff8b22',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {COURSE_TABS.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActiveCourse(tab.key)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 16,
              fontWeight: 700,
              border: 'none',
              borderBottom: activeCourse === tab.key ? (isNight ? '4px solid #51ff8b' : '4px solid #1976d2') : '4px solid transparent',
              background: activeCourse === tab.key
                ? (isNight ? '#232946' : '#fff')
                : (isNight ? '#232946' : '#f7f7f7'),
              color: activeCourse === tab.key ? (isNight ? '#51ff8b' : '#1976d2') : (isNight ? '#ffe259' : '#232946'),
              borderTopLeftRadius: i === 0 ? 12 : 0,
              borderTopRightRadius: i === COURSE_TABS.length - 1 ? 12 : 0,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: activeCourse === tab.key ? (isNight ? '2px solid #51ff8b' : '2px solid #1976d2') : 'none',
              boxShadow: activeCourse === tab.key ? '0 2px 8px #51ff8b44' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center', color: '#1976d2' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      {!loading && !error && enabledFields.length === 0 && (
        <div style={{ textAlign: 'center', color: '#232946' }}>{t('No fields are enabled in the configuration.')}</div>
      )}
      {!loading && !error && enabledFields.length > 0 && filteredStudents.length === 0 && (
        <div style={{ textAlign: 'center', color: '#232946' }}>{t('students.no_students_course')}</div>
      )}
      {!loading && enabledFields.length > 0 && filteredStudents.length > 0 && (
        <>
          <style>{`
            @media (max-width: 700px) {
              table {
                display: none;
              }
              .student-mobile-table {
                display: block;
              }
            }
            @media (min-width: 701px) {
              .student-mobile-table {
                display: none;
              }
            }
          `}</style>
          {/* Desktop Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#51ff8b22' }}>
                <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}></th>
                {STUDENT_LIST_FIELDS.name && <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>{t('form.name')}</th>}
                {STUDENT_LIST_FIELDS.course && <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>{t('form.course')}</th>}
                {STUDENT_LIST_FIELDS.university && <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>{t('form.university')}</th>}
                {STUDENT_LIST_FIELDS.email && <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>{t('form.email')}</th>}
                {STUDENT_LIST_FIELDS.registration_date && <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>{t('Date')}</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 4px', verticalAlign: 'middle', width: 0 }}>
                    <span style={{
                      display: 'inline-block',
                      minWidth: 32,
                      height: 32,
                      background: isNight ? 'linear-gradient(90deg, #51ff8b 0%, #232946 100%)' : 'linear-gradient(90deg, #1976d2 0%, #51ff8b 100%)',
                      color: isNight ? '#232946' : '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px #51ff8b44',
                      textAlign: 'center',
                      lineHeight: '32px',
                      marginRight: 8,
                      border: isNight ? '2px solid #51ff8b' : '2px solid #1976d2',
                    }}>{idx + 1}</span>
                  </td>
                  {STUDENT_LIST_FIELDS.name && <td style={{ padding: '8px 4px' }} data-label="Name">{s.name}</td>}
                  {STUDENT_LIST_FIELDS.course && <td style={{ padding: '8px 4px' }} data-label="Course">{s.course}</td>}
                  {STUDENT_LIST_FIELDS.university && <td style={{ padding: '8px 4px' }} data-label="University">{s.university}</td>}
                  {STUDENT_LIST_FIELDS.email && <td style={{ padding: '8px 4px' }} data-label="Email">{s.email}</td>}
                  {STUDENT_LIST_FIELDS.registration_date && <td style={{ padding: '8px 4px' }} data-label="Date">{s.registration_date ? new Date(s.registration_date).toLocaleString() : ''}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile Table */}
          <div className="student-mobile-table">
            {filteredStudents.map((s, idx) => (
              <div key={s.id} style={{
                display: 'flex',
                background: isNight ? '#232946' : '#f7f7f7',
                borderRadius: 10,
                boxShadow: '0 2px 8px #51ff8b22',
                marginBottom: 18,
                padding: '12px 8px',
                color: isNight ? '#ffe259' : '#232946',
                alignItems: 'stretch',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 40,
                  marginRight: 8,
                }}>
                  <span style={{
                    minWidth: 32,
                    height: 32,
                    background: isNight ? 'linear-gradient(90deg, #51ff8b 0%, #232946 100%)' : 'linear-gradient(90deg, #1976d2 0%, #51ff8b 100%)',
                    color: isNight ? '#232946' : '#fff',
                    fontWeight: 700,
                    fontSize: 18,
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px #51ff8b44',
                    textAlign: 'center',
                    lineHeight: '32px',
                    border: isNight ? '2px solid #51ff8b' : '2px solid #1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{idx + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {STUDENT_LIST_FIELDS.name && <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                    <div style={{ minWidth: 90, fontWeight: 700, color: isNight ? '#51ff8b' : '#1976d2', fontSize: 14 }}>{t('form.name')}</div>
                    <div style={{ flex: 1, color: isNight ? '#ffe259' : '#232946', fontSize: 15, marginLeft: 8 }}>{s.name}</div>
                  </div>}
                  {STUDENT_LIST_FIELDS.course && <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                    <div style={{ minWidth: 90, fontWeight: 700, color: isNight ? '#51ff8b' : '#1976d2', fontSize: 14 }}>{t('form.course')}</div>
                    <div style={{ flex: 1, color: isNight ? '#ffe259' : '#232946', fontSize: 15, marginLeft: 8 }}>{s.course}</div>
                  </div>}
                  {STUDENT_LIST_FIELDS.university && <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                    <div style={{ minWidth: 90, fontWeight: 700, color: isNight ? '#51ff8b' : '#1976d2', fontSize: 14 }}>{t('form.university')}</div>
                    <div style={{ flex: 1, color: isNight ? '#ffe259' : '#232946', fontSize: 15, marginLeft: 8 }}>{s.university}</div>
                  </div>}
                  {STUDENT_LIST_FIELDS.email && <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                    <div style={{ minWidth: 90, fontWeight: 700, color: isNight ? '#51ff8b' : '#1976d2', fontSize: 14 }}>{t('form.email')}</div>
                    <div style={{ flex: 1, color: isNight ? '#ffe259' : '#232946', fontSize: 15, marginLeft: 8 }}>{s.email}</div>
                  </div>}
                  {STUDENT_LIST_FIELDS.registration_date && <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '6px 0' }}>
                    <div style={{ minWidth: 90, fontWeight: 700, color: isNight ? '#51ff8b' : '#1976d2', fontSize: 14 }}>{t('Date')}</div>
                    <div style={{ flex: 1, color: isNight ? '#ffe259' : '#232946', fontSize: 15, marginLeft: 8 }}>{s.registration_date ? new Date(s.registration_date).toLocaleString() : ''}</div>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentListPage;
