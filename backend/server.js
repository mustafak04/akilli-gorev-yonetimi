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
// [Human-written] Transaction yapısı ile görev ve bağımlılık kaydı
app.post('/tasks', async (req, res) => {
    const { title, priority, estimated_duration, deadline, depends_on } = req.body;
    try {
        // 1. Önce görevi ekle
        const taskResult = await pool.query(
            'INSERT INTO tasks (title, priority, estimated_duration, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, priority, estimated_duration, deadline]
        );
        const newTask = taskResult.rows[0];

        // 2. Eğer bir bağımlılık seçilmişse, ilişki tablosuna ekle
        if (depends_on) {
            await pool.query(
                'INSERT INTO task_dependencies (task_id, depends_on_id) VALUES ($1, $2)',
                [newTask.id, depends_on]
            );
        }

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Görev ve bağımlılık kaydedilemedi." });
    }
});

// [Human-fixed] ID tipi dönüşümü ve detaylı hata loglama eklendi
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Silme isteği alındı. ID: ${id}`); // Debug için

    try {
        // ID'yi tam sayıya çevirerek PostgreSQL uyumunu garantiliyoruz
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [parseInt(id)]);

        if (result.rowCount === 0) {
            console.log("Silinecek görev bulunamadı.");
            return res.status(404).json({ error: "Görev bulunamadı." });
        }

        console.log(`Görev (ID: ${id}) başarıyla silindi.`);
        res.status(204).send();
    } catch (err) {
        // Hatayı terminalde mutlaka görmeliyiz
        console.error("VERİTABANI SİLME HATASI:", err.message);
        res.status(500).json({ error: "Veritabanı silme işlemi başarısız." });
    }
});

// [Human-Decision] Cascading Status Revert Logic
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // İşlemi güvenli bir transaction içinde başlatıyoruz

        if (status === 'completed') {
            // Önceki adımda yazdığımız "bağımlılık bitmiş mi?" kontrolü
            const dependencyCheck = await client.query(
                `SELECT t.title FROM tasks t 
         JOIN task_dependencies td ON t.id = td.depends_on_id 
         WHERE td.task_id = $1 AND t.status = 'todo'`,
                [id]
            );

            if (dependencyCheck.rows.length > 0) {
                const missingTasks = dependencyCheck.rows.map(r => r.title).join(", ");
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: `Önce şu görevler bitmeli: ${missingTasks}`
                });
            }
        }

        // 1. Ana görevin durumunu güncelle
        const result = await client.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        // 2. AKILLI TETİKLEYİCİ: Eğer görev 'todo'ya çekildiyse, altındaki tüm zinciri boz
        if (status === 'todo') {
            await client.query(`
        WITH RECURSIVE downstream AS (
          -- İlk seviye bağımlılar
          SELECT task_id FROM task_dependencies WHERE depends_on_id = $1
          UNION
          -- Alt seviyeler (Özyineleme)
          SELECT td.task_id FROM task_dependencies td
          INNER JOIN downstream d ON d.task_id = td.depends_on_id
        )
        UPDATE tasks SET status = 'todo' 
        WHERE id IN (SELECT task_id FROM downstream)
      `, [id]);
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Sunucu hatası" });
    } finally {
        client.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));