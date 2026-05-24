class OfficeApiService {
    constructor() {
        // URL de votre backend Cinephoria - à adapter selon votre configuration
        this.baseURL = 'http://localhost:3000/api/office';
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur HTTP! statut: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // Incidents
    async getIncidents() {
        return this.request('/incidents');
    }

    async getRoomIncidents(roomId) {
        return this.request(`/incidents/room/${roomId}`);
    }

    async createIncident(incidentData) {
        return this.request('/incidents', {
            method: 'POST',
            body: JSON.stringify(incidentData),
        });
    }

    async updateIncident(id, incidentData) {
        return this.request(`/incidents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(incidentData),
        });
    }

    async getIncidentStats() {
        return this.request('/incidents/stats');
    }

    // Salles
    async getRooms() {
        return this.request('/rooms');
    }

    async getRoomEquipment(roomId) {
        return this.request(`/rooms/${roomId}/equipment`);
    }
}

// Export singleton
const officeApiService = new OfficeApiService();