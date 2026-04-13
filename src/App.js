import React, { useEffect, useState } from 'react';
import Greeting from './Greeting';
import UserInfo from './UserInfo';
import TaskComponent from './TaskComponent';
import Counter from './Counter';
import TaskForm from './TaskForm';

import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // login or signup
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [tasks, setTasks] = useState([]);

  // Listen for login/logout changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsub();
  }, []);

  // Load tasks for logged-in user
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setTasks(loaded);
    });

    return () => unsub();
  }, [user]);

  // Signup
  async function handleSignup(e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      alert(err.message);
    }
  }

  // Login
  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      alert(err.message);
    }
  }

  // Logout
  async function handleLogout() {
    await signOut(auth);
  }

  // Add task to Firestore
  async function addTask(newTask) {
    if (!user) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        taskName: newTask.name,
        taskDescription: newTask.desc,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      alert('Error adding task: ' + err.message);
    }
  }

  // Delete task from Firestore
  async function deleteTask(taskId) {
    if (!window.confirm('Delete this task?')) return;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    }
  }

  function handleAlert() {
    alert('Button clicked from UserInfo component!');
  }

  // If user is NOT logged in → show login/signup
  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Task Manager — Login / Sign Up</h1>

        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setAuthMode('login')}
            disabled={authMode === 'login'}
          >
            Login
          </button>

          <button
            onClick={() => setAuthMode('signup')}
            disabled={authMode === 'signup'}
            style={{ marginLeft: '8px' }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={authMode === 'login' ? handleLogin : handleSignup}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: '10px' }}>
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    );
  }

  // If user IS logged in → show task manager
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>

      <Greeting username="Alice" />
      <Greeting username="Bob" />

      <UserInfo handleClick={handleAlert} />

      <TaskComponent tasks={tasks} deleteTask={deleteTask} />

      <Counter />

      <TaskForm addTask={addTask} />
    </div>
  );
}

export default App;
