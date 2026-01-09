// [AI-assisted] Task Creation Form with Smart Validation
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
        e.preventDefault();
        try {
            // Backend'e POST isteği gönder
            const res = await axios.post('http://localhost:5000/tasks', task);
            onTaskAdded(res.data); // Listeyi yenile
            setTask({ title: '', priority: 'medium', estimated_duration: '', deadline: '' });
        } catch (err) {
            alert("Görev eklenirken hata oluştu.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Yeni Görev Ekle</h2>
            <div className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Görev Başlığı" value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })} className="border p-2 rounded" required />

                <select value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })} className="border p-2 rounded">
                    <option value="low">Düşük Öncelik</option>
                    <option value="medium">Orta Öncelik</option>
                    <option value="high">Yüksek Öncelik</option>
                </select>

                <input type="number" placeholder="Tahmini Süre (Saat)" value={task.estimated_duration}
                    onChange={(e) => setTask({ ...task, estimated_duration: e.target.value })} className="border p-2 rounded" required />

                <input type="datetime-local" value={task.deadline}
                    onChange={(e) => setTask({ ...task, deadline: e.target.value })} className="border p-2 rounded" required />

                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">
                    Analiz Et ve Sisteme Ekle
                </button>
            </div>
        </form>
    );
};

export default TaskForm;