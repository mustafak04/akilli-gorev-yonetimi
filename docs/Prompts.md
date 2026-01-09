# AI Prompt Log & Interaction History

Bu döküman, projenin geliştirme sürecinde Yapay Zeka (Gemini/ChatGPT) ile kurulan teknik etkileşimleri içerir.

## 1. Mimari Tasarım ve Rol Atama
Prompt: "Kıdemli bir Yazılım Mimarı rolünü üstlen. Akıllı Görev Yönetim Sistemi için React, Node.js ve PostgreSQL tabanlı bir mimari öner. Görevler arası bağımlılığı (Dependency) destekleyecek bir veritabanı şeması oluştur."

## 2. Akıllı Risk Analiz Algoritması
Prompt: "Sistemin gecikme riskini hesaplaması gerekiyor. Tahmini süre ve teslim tarihi verilerini kullanarak bir risk skoru üretmek istiyorum. Bana şu formülü temel alan bir JS fonksiyonu yazar mısın? Slack = (Deadline - CurrentTime) - Tahmini_Sure"

## 3. İleri Seviye Veritabanı İşlemleri (Recursive CTE)
Prompt: "PostgreSQL kullanıyorum. Bir ana görev 'todo' durumuna geri çekildiğinde, ona bağlı olan tüm alt görevlerin de zincirleme olarak 'todo' durumuna düşmesini sağlayan özyinelemeli (recursive) bir sorgu yazar mısın?"

## 4. Hata Ayıklama (Maintenance)
Prompt: "npm audit fix --force komutundan sonra react-scripts bozuldu. package.json dosyamdaki sürümlerin 0.0.0 olduğunu görüyorum. Bunu manuel olarak nasıl düzeltebilirim?"