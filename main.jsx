import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './style.css';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user) { setBookings([]); return; }
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setBookings(snap.docs.map(d => ({id:d.id,...d.data()}))), e => setError(e.message));
  }, [user]);

  async function login(e) {
    e.preventDefault(); setError('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch (e) { setError(e.message); }
  }
  async function status(id, value) {
    try { await updateDoc(doc(db, 'bookings', id), {status:value}); }
    catch (e) { setError(e.message); }
  }
  const shown = bookings.filter(b => filter === 'All' || b.status === filter);

  if (!user) return <main className="login"><section className="panel"><div className="mark">✚</div><h1>Private Nursing Home Services</h1><p>Admin Panel</p><form onSubmit={login}><input type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><button>Sign In</button></form>{error && <p className="error">{error}</p>}</section></main>;

  return <main className="dashboard"><header><div><div className="mark small">✚</div><h1>Booking Dashboard</h1><p>Private Nursing Home Services</p></div><button className="secondary" onClick={()=>signOut(auth)}>Sign Out</button></header>
    <section className="stats"><div><span>Total bookings</span><strong>{bookings.length}</strong></div><div><span>New</span><strong>{bookings.filter(b=>b.status==='New').length}</strong></div><div><span>Confirmed</span><strong>{bookings.filter(b=>b.status==='Confirmed').length}</strong></div></section>
    <div className="toolbar"><h2>Patient Requests</h2><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>New</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></div>
    {error && <p className="error">{error}</p>}
    {shown.length===0 ? <div className="empty">No bookings yet. New WhatsApp bookings that successfully save to Firebase will appear here.</div> :
      <div className="cards">{shown.map(b=><article className="booking" key={b.id}><div className="bookinghead"><span className="status">{b.status||'New'}</span><span className="date">{b.preferredDate} • {b.preferredTime}</span></div><h3>{b.patientName}</h3><p><b>Service:</b> {b.service}</p><p><b>Phone:</b> {b.phone}</p><p><b>Address:</b> {b.address}</p>{b.notes && <p><b>Notes:</b> {b.notes}</p>}<div className="actions"><button onClick={()=>status(b.id,'Confirmed')}>Confirm</button><button className="secondary" onClick={()=>status(b.id,'Completed')}>Complete</button><button className="danger" onClick={()=>status(b.id,'Cancelled')}>Cancel</button></div></article>)}</div>}
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
