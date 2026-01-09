# Akıllı Görev ve Öncelik Yönetim Sistemi (Karar Destek Sistemi)

Bu proje, İzmir Bakırçay Üniversitesi Bilgisayar Mühendisliği Bölümü BİL440 dersi kapsamında geliştirilmiştir. Uygulama, klasik bir yapılacaklar listesinin ötesine geçerek görevler arasındaki hiyerarşik bağımlılıkları analiz eden ve gecikme risklerini matematiksel modellerle hesaplayan bir Akıllı Karar Destek Sistemi'dir.

## 🛠️ Teknik Mimari
* Frontend: React.js & Tailwind CSS
* Backend: Node.js & Express.js
* Veritabanı: PostgreSQL (İlişkisel Model)
* Algoritma: Ağırlıklı Slack Skoru Analizi

## 🚀 Kurulum ve Çalıştırma

### 1. Veritabanı Kurulumu (PostgreSQL)
Yerel PostgreSQL sunucunuzda bir veritabanı oluşturun ve aşağıdaki SQL sorgularını çalıştırın:

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')), 
  estimated_duration INTEGER NOT NULL,
  deadline TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'todo'
);

CREATE TABLE task_dependencies (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE
);

### 2. Backend Yapılandırması
1. 'backend' klasörüne gidin.
2. '.env' dosyası oluşturun: DATABASE_URL=postgresql://postgres:SIFRENIZ@localhost:5432/akilli_gorev_yonetimi
3. Bağımlılıkları yükleyin: npm install
4. Sunucuyu başlatın: node server.js

### 3. Frontend Yapılandırması
1. 'frontend' klasörüne gidin.
2. Bağımlılıkları yükleyin: npm install
3. Uygulamayı başlatın: npm start

## 🧠 Zorunlu Akıllı Davranış Özellikleri
1. Gecikme Riski Analizi: Sistem, her görev için anlık risk skoru hesaplar.
2. Bağımlılık Kilidi (Dependency Lock): Bir görev, bağlı olduğu görevler tamamlanmadan bitirilemez.
3. Özyinelemeli Durum Geri Alma (Recursive Cascading Revert): Ana görev iptal edilirse alt görevler otomatik sıfırlanır.