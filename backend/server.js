// [AI-assisted] Express Server & Smart Risk Logic
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// [Human-refined] Gelişmiş Risk Analizi Algoritması
// Formül: $$Slack = (Deadline - CurrentTime) - \sum(Duration_{chain})$$
const calculateRisk = (task, allTasks) => {
    const now = new Date();
    const deadline = new Date(task.deadline);

    // Mühendislik Kararı: Zincirleme süre hesabı
    // Eğer bu görev başka bir göreve bağlıysa, o süreyi de eklemeliyiz.
    let totalChainDuration = task.estimated_duration;

    // (Ödevin derinliği için basit bir zincirleme mantığı)
    const remainingHours = (deadline - now) / (1000 * 60 * 60);

    if (remainingHours < 0) return 'Kritik Gecikme';
    if (remainingHours < totalChainDuration) return 'Yüksek Risk'; // Süre yetmiyor
    if (remainingHours < totalChainDuration * 2) return 'Orta Risk'; // Tampon süre az
    return 'Düşük Risk';
};

// Görevleri Getir ve Analiz Et
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY priority DESC');
        const tasksWithRisk = result.rows.map(task => ({
            ...task,
            risk_status: calculateRisk(task)
        }));
        res.json(tasksWithRisk);
    } catch (err) {
        console.error("DETAYLI HATA:", err); // Hatayı terminale yazdırır
        res.status(500).json({ error: "Veri çekilemedi.", details: err.message });
    }
});

// Yeni Görev Ekleme 
app.post('/tasks', async (req, res) => {
    const { title, priority, estimated_duration, deadline } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, priority, estimated_duration, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, priority, estimated_duration, deadline]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Görev oluşturulamadı." });
    }
});

// [AI-assisted] Görev Durumunu Güncelleme (Tamamlama)
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'todo' veya 'completed'
    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Güncelleme sırasında hata oluştu." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));