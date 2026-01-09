import { hasCircularDependency } from '../utils/cycleChecker';

test('A -> B ve B -> A döngüsünü tespit etmeli', () => {
    const tasks = [
        { id: 1, dependencies: [2] },
        { id: 2, dependencies: [] }
    ];
    // 2 numaralı göreve 1'i bağımlı yapmaya çalışıyoruz (Döngü!)
    expect(hasCircularDependency(tasks, 2, 1)).toBe(true);
});