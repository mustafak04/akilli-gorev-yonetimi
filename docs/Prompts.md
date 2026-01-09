## AI Decision Log 
| Aşama | Kullanılan YZ | YZ Önerisi | Nihai Karar | Gerekçe |
| :--- | :--- | :--- | :--- | :--- |
| **Teknoloji Seçimi** | Gemini | Veri esnekliği için MongoDB (NoSQL) kullanımı. | **PostgreSQL (Supabase)** | Görev bağımlılıkları (Task Dependencies) ilişkisel bir yapı gerektirir. "JOIN" işlemleri ve veri bütünlüğü için SQL daha güvenlidir. |
| **Mimari Yaklaşım** | ChatGPT | Monolitik (Tek parça) yapı. | **Client-Server (REST API)** | Web tabanlı gereksinim ve gelecekte mobil uygulama eklenebilme esnekliği için modülerlik sağlar. |
| **Akıllı Mantık** | Gemini | Sadece teslim tarihine (deadline) bakılması. | **Kritik Yol & Slack Analizi** | Gecikme riskini gerçekçi ölçmek için bağımlı görevlerin sürelerinin de hesaba katılması gerekir. |