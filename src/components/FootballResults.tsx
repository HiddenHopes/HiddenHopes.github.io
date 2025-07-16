import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string; // 'LIVE', 'FT', etc.
  startTime: string;
  league: string;
}

interface TableEntry {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

const leagues = [
  { code: 'PL', name: 'Premier League' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'PD', name: 'La Liga' },
  { code: 'FL1', name: 'Ligue 1' },
];

const API_BASE = 'https://api-football-standings.azharimm.dev/leagues';

const FootballResults: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].code);
  const [matches, setMatches] = useState<Match[]>([]);
  const [table, setTable] = useState<TableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // Optionally, poll every 60s for live updates
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [selectedLeague]);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      // Fetch standings
      const tableRes = await fetch(`${API_BASE}/${selectedLeague}/standings?season=2024&sort=asc`);
      const tableData = await tableRes.json();
      const tableArr: TableEntry[] = (tableData.data.standings || []).map((entry: any, i: number) => ({
        position: i + 1,
        team: entry.team.name,
        played: entry.stats.find((s: any) => s.name === 'gamesPlayed')?.value || 0,
        won: entry.stats.find((s: any) => s.name === 'wins')?.value || 0,
        drawn: entry.stats.find((s: any) => s.name === 'ties')?.value || 0,
        lost: entry.stats.find((s: any) => s.name === 'losses')?.value || 0,
        points: entry.stats.find((s: any) => s.name === 'points')?.value || 0,
      }));
      setTable(tableArr);
      // Fetch matches (recent and live)
      const matchRes = await fetch(`https://api-football-standings.azharimm.dev/leagues/${selectedLeague}/matches?season=2024&date=${new Date().toISOString().slice(0,10)}`);
      const matchData = await matchRes.json();
      const matchArr: Match[] = (matchData.data.matches || []).map((m: any) => ({
        id: m.id,
        homeTeam: m.home_team?.name || '',
        awayTeam: m.away_team?.name || '',
        homeScore: m.home_score ?? 0,
        awayScore: m.away_score ?? 0,
        status: m.status,
        startTime: m.start_date,
        league: m.competition?.name || '',
      }));
      setMatches(matchArr);
    } catch (e) {
      setError('Failed to fetch football data.');
    }
    setLoading(false);
  }

  const liveMatches = matches.filter(m => m.status === 'LIVE');
  const recentMatches = matches.filter(m => m.status !== 'NS').slice(0, 5);

  return (
    <div style={{ position: 'absolute', top: 54, left: 0, minWidth: 340, background: '#fff', color: '#232946', borderRadius: 10, boxShadow: '0 4px 16px #0002', padding: '16px 20px', zIndex: 100 }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#232946', cursor: 'pointer' }}>×</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>⚽ Football Results</span>
        <select value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)} style={{ fontSize: 14, borderRadius: 6, padding: '2px 8px', marginLeft: 8 }}>
          {leagues.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      {loading ? <div>Loading...</div> : error ? <div style={{ color: '#d7263d' }}>{error}</div> : (
        <>
          {liveMatches.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 2 }}>Live Matches:</div>
              {liveMatches.map(m => (
                <div key={m.id} style={{ fontSize: 15, marginBottom: 2 }}>
                  <b>{m.homeTeam}</b> {m.homeScore} - {m.awayScore} <b>{m.awayTeam}</b> <span style={{ color: '#d7263d', fontWeight: 600, marginLeft: 6 }}>{t('football.live')}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: '#232946', marginBottom: 2 }}>Recent Results:</div>
            {recentMatches.map(m => (
              <div key={m.id} style={{ fontSize: 15, marginBottom: 2 }}>
                <b>{m.homeTeam}</b> {m.homeScore} - {m.awayScore} <b>{m.awayTeam}</b> <span style={{ color: '#888', marginLeft: 6 }}>{m.status}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#232946', marginBottom: 2 }}>Points Table:</div>
            <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e3f6ff', borderRadius: 6 }}>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f7f7' }}>
                    <th style={{ textAlign: 'left', padding: 4 }}>#</th>
                    <th style={{ textAlign: 'left', padding: 4 }}>{t('football.team')}</th>
                    <th>{t('football.p')}</th><th>{t('football.w')}</th><th>{t('football.d')}</th><th>{t('football.l')}</th><th>{t('football.pts')}</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map(row => (
                    <tr key={row.position} style={{ background: row.position % 2 ? '#fff' : '#f7f7f7' }}>
                      <td style={{ padding: 4 }}>{row.position}</td>
                      <td style={{ padding: 4 }}>{row.team}</td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td>{row.drawn}</td>
                      <td>{row.lost}</td>
                      <td style={{ fontWeight: 700 }}>{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FootballResults;
