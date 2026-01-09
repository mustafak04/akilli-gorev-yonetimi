export const hasCircularDependency = (tasks, newTaskId, dependsOnId) => {
    const adjList = new Map();
    tasks.forEach(t => adjList.set(t.id, t.dependencies || []));

    // Geçici olarak yeni bağımlılığı ekle
    const currentDeps = adjList.get(newTaskId) || [];
    adjList.set(newTaskId, [...currentDeps, dependsOnId]);

    const visited = new Set();
    const stack = new Set();

    const dfs = (node) => {
        if (stack.has(node)) return true; // Döngü bulundu!
        if (visited.has(node)) return false;

        visited.add(node);
        stack.add(node);

        const neighbors = adjList.get(node) || [];
        for (let neighbor of neighbors) {
            if (dfs(neighbor)) return true;
        }

        stack.delete(node);
        return false;
    };

    // Tüm düğümler için kontrol et
    for (let node of adjList.keys()) {
        if (dfs(node)) return true;
    }
    return false;
};