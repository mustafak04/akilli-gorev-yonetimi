// [AI-generated] Unit tests for risk calculation logic
const { calculateRisk } = require('./server_logic'); // Mantığı dışa aktardığını varsayıyoruz

test('Deadline geçmişse "Kritik Gecikme" dönmeli', () => {
    const task = {
        deadline: '2020-01-01',
        estimated_duration: 5
    };
    expect(calculateRisk(task)).toBe('Kritik Gecikme');
});

test('Yeterli vakit varsa "Düşük Risk" dönmeli', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 100);
    const task = {
        deadline: futureDate.toISOString(),
        estimated_duration: 5
    };
    expect(calculateRisk(task)).toBe('Düşük Risk');
});