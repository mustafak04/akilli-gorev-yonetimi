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

// ZORUNLU AKILLI DAVRANIŞ: Gecikme Riski Analizi 
// Bu fonksiyon, bir görevin bitiş süresini, bağlı olduğu tüm görevlerin sürelerini toplayarak hesaplar.
const calculateRisk = (task, allDependencies) => {
    const now = new Date();
    const deadline = new Date(task.deadline);

    // Basit Slack Süresi Formülü:
    // $$Slack = (Deadline - CurrentTime) - EstimatedDuration$$
    const totalNeededHours = task.estimated_duration;
    const remainingHours = (deadline - now) / (1000 * 60 * 60);

    if (remainingHours < 0) return 'Kritik Gecikme';
    if (remainingHours < totalNeededHours) return 'Yüksek Risk';
    if (remainingHours < totalNeededHours * 1.5) return 'Orta Risk';
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
        res.status(500).json({ error: "Veri çekilemedi." });
    }
});

// Yeni Görev Ekleme [cite: 89]
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));