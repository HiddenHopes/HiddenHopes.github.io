import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

interface Student {
  id: number;
  name: string;
  course: string;
  university: string;
  email: string;
  registration_date?: string;
}

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('registrations')
        .select('id, name, course, university, email, registration_date')
        .order('registration_date', { ascending: false });
      if (error) setError('Failed to fetch students.');
      else setStudents(data || []);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  return (
    <div style={{
      maxWidth: 700,
      margin: '32px auto',
      background: 'rgba(255,255,255,0.97)',
      borderRadius: 16,
      boxShadow: '0 2px 16px #51ff8b33',
      padding: 24,
      minHeight: 320,
    }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 18 }}>Registered Students</h2>
      {loading && <div style={{ textAlign: 'center', color: '#1976d2' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      {!loading && !error && students.length === 0 && (
        <div style={{ textAlign: 'center', color: '#232946' }}>No students registered yet.</div>
      )}
      {!loading && students.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#51ff8b22' }}>
              <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>Course</th>
              <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>University</th>
              <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '8px 4px', borderBottom: '2px solid #51ff8b', textAlign: 'left' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 4px' }}>{s.name}</td>
                <td style={{ padding: '8px 4px' }}>{s.course}</td>
                <td style={{ padding: '8px 4px' }}>{s.university}</td>
                <td style={{ padding: '8px 4px' }}>{s.email}</td>
                <td style={{ padding: '8px 4px' }}>{s.registration_date ? new Date(s.registration_date).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentListPage;
