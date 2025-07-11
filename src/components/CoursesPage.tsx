import React, { useState } from 'react';
import StudentListPage from './StudentListPage';

interface CoursesPageProps {
  isNight: boolean;
  onClose: () => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ isNight, onClose }) => {
  const [showStudentList, setShowStudentList] = useState(false);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100dvh',
      maxHeight: '100dvh',
      background: isNight
        ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
        : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)',
      color: isNight ? '#fff' : '#232946',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '24px 8px 32px 8px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      zIndex: 1000
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 16, marginTop: 8, textAlign: 'center' }}>Our Courses</h1>
      <p style={{ maxWidth: 600, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        Discover our unique courses designed for fullstack and 3D web development, as well as problem solving and contest programming:
      </p>
      <div className="courses-cards-row" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        justifyContent: 'center',
        marginBottom: 32,
        width: '100%',
        maxWidth: 1300,
      }}>
        {/* Fullstack Developer Course */}
        <div style={{ background: isNight ? '#232946' : '#fff', borderRadius: 16, boxShadow: isNight ? '0 2px 12px #23294688' : '0 2px 12px #b3e0ff44', padding: 24, minWidth: 260, maxWidth: 400, flex: 1, margin: '0 auto', boxSizing: 'border-box' }}>
          <h2 style={{ color: isNight ? '#51ff8b' : '#1976d2', marginBottom: 10 }}>Fullstack Developer</h2>
          <ul style={{ fontSize: 16, color: isNight ? '#ffe259' : '#232946', marginLeft: 18 }}>
            <li><b>Java</b>: OOP, Collections, Streams, Exception Handling, Multithreading</li>
            <li><b>Spring Boot</b>: REST APIs, Security, JPA, Testing</li>
            <li><b>React JS</b>: Components, Hooks, State Management, Routing</li>
            <li><b>HTML &amp; CSS</b>: Modern layouts, Flexbox, Grid, Responsive Design</li>
            <li><b>JavaScript</b>: ES6+, Async, DOM, Fetch/AJAX</li>
            <li><b>SQL</b>: Joins, Aggregations, Indexing, Transactions</li>
            <li><b>Git</b>: Branching, Merging, Collaboration</li>
            <li><b>AWS</b>: EC2, S3, RDS, Deployment basics</li>
          </ul>
        </div>
        {/* 3D Web Development Course */}
        <div style={{ background: isNight ? '#232946' : '#fff', borderRadius: 16, boxShadow: isNight ? '0 2px 12px #23294688' : '0 2px 12px #b3e0ff44', padding: 24, minWidth: 260, maxWidth: 400, flex: 1, margin: '0 auto', boxSizing: 'border-box' }}>
          <h2 style={{ color: isNight ? '#51ff8b' : '#1976d2', marginBottom: 10 }}>3D Web Development</h2>
          <ul style={{ fontSize: 16, color: isNight ? '#ffe259' : '#232946', marginLeft: 18 }}>
            <li><b>WebGL &amp; Three.js</b>: 3D graphics, models, animation</li>
            <li><b>React Three Fiber</b>: 3D in React, scene management</li>
            <li><b>GLTF/GLB</b>: 3D model formats, loading assets</li>
            <li><b>Shaders</b>: Basics, custom effects</li>
            <li><b>3D UI/UX</b>: Interaction, camera, controls</li>
          </ul>
        </div>
        {/* Problem Solving & Contest Programming */}
        <div style={{ background: isNight ? '#232946' : '#fff', borderRadius: 16, boxShadow: isNight ? '0 2px 12px #23294688' : '0 2px 12px #b3e0ff44', padding: 24, minWidth: 260, maxWidth: 400, flex: 1, margin: '0 auto', boxSizing: 'border-box' }}>
          <h2 style={{ color: isNight ? '#51ff8b' : '#1976d2', marginBottom: 10 }}>Problem Solving &amp; Contest Programming</h2>
          <ul style={{ fontSize: 16, color: isNight ? '#ffe259' : '#232946', marginLeft: 18 }}>
            <li><b>Algorithms</b>: Sorting, Searching, Graphs, DP, Greedy</li>
            <li><b>Data Structures</b>: Arrays, Trees, Hashing, Stacks, Queues</li>
            <li><b>Competitive Coding</b>: Codeforces, LeetCode, AtCoder, ICPC</li>
            <li><b>Math &amp; Logic</b>: Number theory, Combinatorics, Bit manipulation</li>
            <li><b>Speed &amp; Accuracy</b>: Fast coding, debugging, test cases</li>
          </ul>
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          padding: '10px 28px',
          fontSize: 18,
          borderRadius: 8,
          border: 'none',
          background: isNight ? '#232946' : '#51ff8b',
          color: isNight ? '#ffe259' : '#232946',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isNight ? '0 2px 8px #23294688' : '0 2px 8px #b3e0ff88',
          marginTop: 16,
          marginBottom: 16,
          width: '90%',
          maxWidth: 320
        }}
      >
        Close
      </button>
      <button
        onClick={() => setShowStudentList(true)}
        style={{
          display: 'inline-block',
          margin: '18px auto 0 auto',
          background: 'linear-gradient(90deg, #51ff8b 0%, #1976d2 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 12,
          padding: '10px 28px',
          textDecoration: 'none',
          boxShadow: '0 2px 12px #51ff8b44',
          border: '2px solid #51ff8b',
          transition: 'background 0.3s',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}
      >
        📋 View Registered Students
      </button>
      {showStudentList && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: isNight ? '#232946' : '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 32px #0008',
            padding: 32,
            minWidth: 320,
            maxWidth: 600,
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowStudentList(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: '#ff5252',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 16,
                boxShadow: '0 2px 8px #ff525244',
              }}
            >
              Close
            </button>
            <StudentListPage />
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .courses-cards-row {
            flex-direction: column !important;
            gap: 20px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;
