class IncidentsManager {
    constructor() {
        this.incidents = [];
        this.rooms = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
    }

    initializeElements() {
        this.incidentsList = document.getElementById('incidentsList');
        this.roomSelect = document.getElementById('roomSelect');
        this.equipmentSelect = document.getElementById('equipmentSelect');
        this.descriptionTextarea = document.getElementById('description');
        this.incidentForm = document.getElementById('incidentForm');
    }

    bindEvents() {
        this.incidentForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.roomSelect.addEventListener('change', () => this.loadEquipmentForRoom());
    }

    async loadInitialData() {
        try {
            await Promise.all([
                this.loadRooms(),
                this.loadIncidents()
            ]);
        } catch (error) {
            this.showError('Erreur lors du chargement des données');
        }
    }

    async loadRooms() {
        try {
            this.rooms = await officeApiService.getRooms();
            this.populateRoomSelect();
        } catch (error) {
            console.error('Erreur chargement salles:', error);
        }
    }

    async loadIncidents() {
        try {
            this.incidents = await officeApiService.getIncidents();
            this.renderIncidents();
        } catch (error) {
            console.error('Erreur chargement incidents:', error);
        }
    }

    populateRoomSelect() {
        this.roomSelect.innerHTML = '<option value="">Sélectionnez une salle</option>';
        this.rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.nom;
            this.roomSelect.appendChild(option);
        });
    }

    loadEquipmentForRoom() {
        // Les équipements sont déjà dans le select
        // On peut filtrer ou garder tous les choix
    }

    renderIncidents() {
        if (this.incidents.length === 0) {
            this.incidentsList.innerHTML = '<div class="empty-state">Aucune installation défaillante signalée</div>';
            return;
        }

        this.incidentsList.innerHTML = this.incidents.map(incident => `
            <div class="incident-card">
                <div class="incident-header">
                    <span class="incident-salle">Salle : ${incident.salle?.nom || 'N/A'}</span>
                    <span class="incident-equipment">${incident.titre}</span>
                </div>
                <div class="incident-description">
                    ${incident.description}
                </div>
                <div class="incident-footer">
                    <span>Signalé par : ${incident.utilisateur?.email || 'Employé'}</span>
                    <span>Le : ${new Date(incident.date_incident).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
        `).join('');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const salle_id = this.roomSelect.value;
        const titre = this.equipmentSelect.value;
        const description = this.descriptionTextarea.value;

        if (!salle_id || !titre || !description) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const formData = {
            titre: titre,
            description: description,
            priorite: 'moyenne',
            statut: 'ouvert',
            salle_id: parseInt(salle_id),
            utilisateur_id: 1  // ID employé par défaut
        };

        try {
            await officeApiService.createIncident(formData);
            this.incidentForm.reset();
            await this.loadIncidents();
            alert('Incident signalé avec succès !');
        } catch (error) {
            alert('Erreur lors du signalement');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('main').prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new IncidentsManager();
});