# AI Errors & Critical Analysis

## 1. Bağımlılık Ağacı Çökmesi (NPM Audit Incident)
- Hata: 'npm audit fix --force' önerisinin temel paketleri (react-scripts) silerek projeyi çalışmaz hale getirmesi.
- Analiz: Otomatik araçların sunduğu yüksek riskli çözümlerin proje bütünlüğünü bozabileceği saptanmıştır.
- Çözüm: Mühendis refleksiyle package.json manuel olarak onarılmış ve sürümler sabitlenmiştir.

## 2. Fonksiyonel Körlük (UI Override)
- Hata: YZ'nin modern bir tasarım sunarken, işlevsel React bileşenlerini (TaskForm) statik HTML ile değiştirmesi.
- Analiz: YZ'nin görsel iyileştirmelere odaklanırken uygulamanın asenkron veri akışını göz ardı ettiği görülmüştür.
- Çözüm: Tasarım parçalanarak işlevsel bileşenler manuel olarak sisteme yeniden monte edilmiştir.

## 3. Mantıksal Bypass (Validation Eksikliği)
- Hata: YZ'nin görev bağımlılıklarını sadece görsel bir etiket olarak kurgulaması ve mantıksal kilitleri atlaması.
- Analiz: Bu durumun "Akıllı Davranış" ilkesini bozduğu (öncül iş bitmeden ardıl işin bitirilebilmesi) saptanmıştır.
- Çözüm: PostgreSQL ve Express seviyesinde mantıksal denetleyiciler el ile yazılmıştır.