# AI Decision Log (Yapay Zeka Karar Günlüğü)

Bu günlük, projenin geliştirilme sürecinde Yapay Zeka tarafından sunulan öneriler ile mühendislik refleksiyle verilen nihai kararlar arasındaki farkları ve gerekçeleri dökümante eder.

| Aşama | Kullanılan YZ | YZ Önerisi | Nihai Karar (İnsan) | Gerekçe / Analiz |
| :--- | :--- | :--- | :--- | :--- |
| **Veri Modelleme** | Gemini | MongoDB (NoSQL) kullanımı | **PostgreSQL (RDBMS)** | Görev bağımlılıklarının karmaşık JOIN ve Recursive sorgular gerektirmesi nedeniyle ilişkisel modelin veri bütünlüğü açısından daha güvenli olması. |
| **Bağımlılık Yapısı** | ChatGPT | Görev tablosunda `parent_id` sütunu | **Bağımlılık Tablosu (Many-to-Many)** | Bir görevin birden fazla göreve bağlı olabileceği (Multi-dependency) senaryoların desteklenmesi ve normalizasyon kuralları. |
| **Risk Analizi** | Gemini | Basit tarih karşılaştırması | **Ağırlıklı Slack Skoru Algoritması** | Sadece tarihin yetersiz kalması; görevin tahmini süresi ve mevcut zaman baskısının birleştirilerek daha gerçekçi bir analiz sunulması. |
| **Validasyon** | ChatGPT | Sadece Frontend üzerinde kontrol | **Backend + DB Level Constraint** | Güvenlik ve veri tutarlılığı için kısıtlamaların sunucu seviyesinde olması zorunluluğu. API üzerinden yapılabilecek bypass işlemlerini engelleme. |
| **UI Geliştirme** | Gemini | Statik Dashboard tasarımı | **Dynamic Component Architecture** | Tasarımın iyileştirilmesi sırasında asenkron veri akışının bozulmaması için işlevsel React bileşenlerinin korunarak arayüze monte edilmesi. |
| **Durum Yönetimi** | Gemini | Manuel durum güncelleme | **Recursive Cascading Update** | Bir üst görev iptal edildiğinde alt görevlerin tamamlanmış kalmasının mantıksal bir hata olması; veri bütünlüğünün otomatik korunması. |
| **Altyapı** | ChatGPT | Supabase Bulut Veritabanı | **Yerel (Local) PostgreSQL** | DNS çözümleme hataları ve internet bağımlılığının geliştirme sürecini aksatması nedeniyle daha stabil olan yerel kuruluma geçiş. |