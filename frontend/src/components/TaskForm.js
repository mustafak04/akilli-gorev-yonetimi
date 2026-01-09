import React, { useState } from 'react';
import { hasCircularDependency } from '../utils/cycleChecker';

const TaskForm = ({ tasks, onTaskAdded }) => {
    const [formData, setFormData] = useState({ title: '', priority: 'medium', estimated_duration: 1, deadline: '', depends_on: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        // MÜHENDİS MÜDAHALESİ: YZ'nin atladığı döngü kontrolü
        if (formData.depends_on && hasCircularDependency(tasks, "new", parseInt(formData.depends_on))) {
            alert("Hata: Döngüsel bağımlılık tespit edildi! (A -> B -> A olamaz)");
            return;
        }

        // API isteği burada yapılacak (Basitleştirilmiştir)
        console.log("Görev kaydediliyor...", formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            {/* Form alanları: Title, Priority, Duration, Deadline, Dependencies */}
            <h2 className="text-xl font-semibold mb-4">Yeni Akıllı Görev Ekle</h2>
            <input
                className="w-full mb-3 p-2 border rounded"
                placeholder="Görev Başlığı"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
            />
            {/* Diğer inputlar buraya gelecek... */}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Analiz Et ve Ekle
            </button>
        </form>
    );
};

export default TaskForm;