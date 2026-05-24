// Utilitaires pour l'application
class AppUtils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static getPriorityLabel(priority) {
        const labels = {
            low: 'Basse',
            medium: 'Moyenne',
            high: 'Haute',
            critical: 'Critique'
        };
        return labels[priority] || priority;
    }

    static getStatusLabel(status) {
        const labels = {
            open: 'Ouvert',
            in_progress: 'En cours',
            resolved: 'Résolu'
        };
        return labels[status] || status;
    }

    static showNotification(message, type = 'info') {
        // Implémentation simple de notification
        console.log(`[${type.toUpperCase()}] ${message}`);
       
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}