// [AI-assisted] App Component with Task State Management
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleToggleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
    fetchTasks(); // Listeyi güncelle
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Akıllı Görev ve Öncelik Yönetimi</h1>

      <TaskForm onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />

      <div className="space-y-4">
        {tasks.map(t => (
          <div key={t.id} className={`p-4 border rounded-lg flex justify-between items-center ${t.status === 'completed' ? 'bg-gray-100 opacity-60' : 'bg-white shadow-sm'}`}>
            <div>
              <h3 className={`font-bold ${t.status === 'completed' ? 'line-through' : ''}`}>{t.title}</h3>
              <p className="text-sm text-gray-500">Risk: <span className="font-semibold">{t.risk_status}</span></p>
            </div>
            <button
              onClick={() => handleToggleComplete(t.id, t.status)}
              className={`px-4 py-2 rounded text-sm font-bold ${t.status === 'completed' ? 'bg-gray-400 text-white' : 'bg-green-500 text-white hover:bg-green-600'}`}>
              {t.status === 'completed' ? 'Tamamlandı' : 'Tamamla'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;