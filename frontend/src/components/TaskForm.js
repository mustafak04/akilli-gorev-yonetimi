// [Human-corrected] YZ'nin eksik bıraktığı event handling yapısı manuel olarak düzeltildi
import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
    const [task, setTask] = useState({
        title: '',
        priority: 'medium',
        estimated_duration: '',
        deadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engeller

        try {
            // Backend'e asenkron istek gönderimi
            const res = await axios.post('http://localhost:5000/tasks', task);

            if (res.status === 201) {
                alert("Görev analiz edildi ve başarıyla eklendi!");
                onTaskAdded(); // Listeyi güncellemek için App.js'deki fetchTasks'i çağırır
                setTask({ title: '', priority: 'medium', estimated_duration: '', deadline: '' }); // Formu temizle
            }
        } catch (err) {
            console.error("Bağlantı Hatası:", err);
            alert("Sistemsel bir hata oluştu, lütfen backend bağlantısını kontrol edin.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <input
                placeholder="Görev Başlığı"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
            />
            <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none"
            >
                <option value="low">Düşük Öncelik</option>
                <option value="medium">Orta Öncelik</option>
                <option value="high">Yüksek Öncelik</option>
            </select>
            <input
                type="number"
                placeholder="Tahmini Süre (Saat)"
                value={task.estimated_duration}
                onChange={(e) => setTask({ ...task, estimated_duration: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                required
            />
            <input
                type="datetime-local"
                value={task.deadline}
                onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                required
            />
            {/* DİKKAT: type="submit" eklendi! */}
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
                Analiz Et ve Sisteme Ekle
            </button>
        </form>
    );
};

export default TaskForm;