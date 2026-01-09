// [AI-assisted] Main Application Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { hasCircularDependency } from './utils/cycleChecker';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  // Risk skoruna göre renk döndüren yardımcı fonksiyon
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Kritik Gecikme': return 'bg-red-600';
      case 'Yüksek Risk': return 'bg-orange-500';
      case 'Orta Risk': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Akıllı Görev Yönetimi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Görev Listesi */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Mevcut Görevler</h2>
          {loading ? <p>Yükleniyor...</p> : (
            tasks.map(task => (
              <div key={task.id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(task.deadline).toLocaleDateString()}</span>
                    <span className="uppercase font-bold">[{task.priority}]</span>
                  </div>
                </div>
                {/* ZORUNLU AKILLI DAVRANIŞ GÖRSELLEŞTİRME */}
                <div className={`${getRiskColor(task.risk_status)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                  {task.risk_status}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Buraya bir sonraki adımda TaskForm bileşeni gelecek */}
      </div>
    </div>
  );
}

export default App;