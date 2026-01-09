// [AI-assisted] Modern Dashboard UI with Tailwind CSS
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, AlertTriangle, CheckCircle, List, PlusCircle } from 'lucide-react';
import TaskForm from './components/TaskForm';

// [Human-written] State senkronizasyonu düzeltildi
function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
    } catch (err) { console.error("Veri çekme hatası:", err); }
  };

  // [Human-written] Görev tamamlama mantığı manuel olarak eklendi
  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await axios.put(`http://localhost:5000/tasks/${task.id}`, { status: newStatus });
      fetchTasks(); // Listeyi yenileyerek güncel durumu çekiyoruz
    } catch (err) {
      console.error("Durum güncellenemedi:", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Risk seviyesine göre stil belirleme (Zorunlu Akıllı Davranış Görselleştirmesi)
  const getRiskStyle = (risk) => {
    if (risk === 'Kritik Gecikme' || risk === 'Yüksek Risk') return 'bg-red-100 text-red-700 border-red-200';
    if (risk === 'Orta Risk') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Üst Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <List size={24} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">Akıllı Görev Analiz Paneli</h1>
          </div>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
            BIL440 Final Projesi
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sol Panel: Yeni Görev Girişi */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-700">
              <PlusCircle size={20} className="text-indigo-600" /> Yeni Görev Ekle
            </h2>
            <TaskForm onTaskAdded={fetchTasks} />
          </div>
        </div>

        {/* Sağ Panel: Akıllı Analiz Listesi */}
        <div className="lg:col-span-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-700">
            <AlertTriangle size={20} className="text-amber-500" /> Akıllı Risk Raporu
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {tasks.map(t => (
              <div key={t.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{t.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(t.deadline).toLocaleDateString('tr-TR')}</span>
                      <span className="uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {t.priority} Öncelik
                      </span>
                    </div>
                  </div>
                  {/* AKILLI DAVRANIŞ ÇIKTISI */}
                  <div className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider ${getRiskStyle(t.risk_status)}`}>
                    {t.risk_status}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium tracking-tight">Efor Tahmini: <span className="text-slate-600 font-bold">{t.estimated_duration} Saat</span></div>
                  <button
                    onClick={() => handleToggleComplete(t)} // Tıklama olayı bağlandı
                    className={`text-sm font-bold flex items-center gap-1 ${t.status === 'completed' ? 'text-green-600' : 'text-indigo-600 hover:underline'}`}
                  >
                    <CheckCircle size={16} />
                    {t.status === 'completed' ? 'Tamamlandı (Geri Al)' : 'Tamamlandı Olarak İşaretle'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;