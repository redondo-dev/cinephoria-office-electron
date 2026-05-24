class IncidentsManager {
    constructor() {
        this.incidents = [];
        this.rooms = [];
        this.equipment = [];
        this.currentUser = 'employe@cinephoria.com';
        
        this.apiService = new OfficeApiService();
        this.exportManager = new ExportManager(this);
        
        this.initializeElements();
        this.bindEvents();
        this.setupMenuListeners();
        this.loadInitialData();
    }

    initializeElements() {
        // Éléments principaux
        this.incidentsList = document.getElementById('incidentsList');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.querySelector('.error-text');
        
        // Filtres
        this.roomFilter = document.getElementById('roomFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        
        // Boutons
        this.refreshBtn = document.getElementById('refreshBtn');
        this.newIncidentBtn = document.getElementById('newIncidentBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.retryBtn = document.getElementById('retryBtn');
        
        // Modal
        this.modal = document.getElementById('incidentModal');
        this.incidentForm = document.getElementById('incidentForm');
        this.roomSelect = document.getElementById('roomSelect');
        this.equipmentSelect = document.getElementById('equipmentSelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.descriptionTextarea = document.getElementById('description');
        this.closeModal = document.getElementById('closeModal');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Statistiques
        this.totalIncidents = document.getElementById('totalIncidents');
        this.openIncidents = document.getElementById('openIncidents');
        this.criticalIncidents = document.getElementById('criticalIncidents');
    }

    bindEvents() {
        // Boutons d'action
        this.refreshBtn.addEventListener('click', () => this.loadIncidents());
        this.newIncidentBtn.addEventListener('click', () => this.openModal());
        this.exportBtn.addEventListener('click', () => this.exportManager.showExportMenu());
        this.retryBtn.addEventListener('click', () => this.loadInitialData());
        
        // Filtres
        this.roomFilter.addEventListener('change', () => this.filterIncidents());
        this.statusFilter.addEventListener('change', () => this.filterIncidents());
        this.priorityFilter.addEventListener('change', () => this.filterIncidents());
        
        // Modal
        this.closeModal.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.incidentForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.roomSelect.addEventListener('change', (e) => this.loadRoomEquipment(e.target.value));
        
        // Fermer la modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    setupMenuListeners() {
        if (window.electronAPI) {
            window.electronAPI.onMenuNewIncident(() => this.openModal());
            window.electronAPI.onMenuExportIncidents(() => this.exportManager.showExportMenu());
        }
    }

    async loadInitialData() {
        try {
            this.hideError();
            this.showLoading();
            
            await Promise.all([
                this.loadRooms(),
                this.loadIncidents(),
                this.loadStats()
            ]);
            
            this.hideLoading();
        } catch (error) {
            this.showError('Erreur lors du chargement des données initiales');
        }
    }

    async loadRooms() {
        try {
            this.rooms = await this.apiService.getRooms();
            this.populateRoomSelects();
        } catch (error) {
            throw new Error('Impossible de charger les salles');
        }
    }

    async loadIncidents() {
        try {
            this.incidents = await this.apiService.getIncidents();
            this.renderIncidents();
        } catch (error) {
            throw new Error('Impossible de charger les incidents');
        }
    }

    async loadStats() {
        try {
            const stats = await this.apiService.getIncidentStats();
            this.updateStats(stats);
        } catch (error) {
            console.error('Erreur stats:', error);
        }
    }

    async loadRoomEquipment(roomId) {
        if (!roomId) {
            this.equipmentSelect.innerHTML = '<option value="">Sélectionnez un équipement</option>';
            return;
        }

        try {
            this.equipment = await this.apiService.getRoomEquipment(roomId);
            this.populateEquipmentSelect();
        } catch (error) {
            this.showError('Erreur lors du chargement des équipements');
        }
    }

    populateRoomSelects() {
        this.roomFilter.innerHTML = '<option value="">Toutes les salles</option>';
        this.roomSelect.innerHTML = '<option value="">Sélectionnez une salle</option>';
        
        this.rooms.forEach(room => {
            const option = `<option value="${room.id}">${room.name}</option>`;
            this.roomFilter.innerHTML += option;
            this.roomSelect.innerHTML += option;
        });
    }

    populateEquipmentSelect() {
        this.equipmentSelect.innerHTML = '<option value="">Sélectionnez un équipement</option>';
        
        this.equipment.forEach(equip => {
            this.equipmentSelect.innerHTML += `
                <option value="${equip.id}">${equip.name} (${equip.type})</option>
            `;
        });
    }

    renderIncidents() {
        const filteredIncidents = this.filterIncidents();
        
        if (filteredIncidents.length === 0) {
            this.incidentsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>Aucun incident trouvé</h3>
                    <p>Aucun incident ne correspond aux critères de filtrage.</p>
                </div>
            `;
            return;
        }

        this.incidentsList.innerHTML = filteredIncidents.map(incident => `
            <div class="incident-card">
                <div class="incident-header">
                    <div class="incident-title">
                        ${incident.equipment?.name || 'Équipement non spécifié'} - ${incident.room?.name}
                    </div>
                    <div class="incident-priority priority-${incident.priority}">
                        ${AppUtils.getPriorityLabel(incident.priority)}
                    </div>
                </div>
                <div class="incident-details">
                    <div><strong>Statut:</strong> ${AppUtils.getStatusLabel(incident.status)}</div>
                    <div><strong>Signalé par:</strong> ${incident.reported_by}</div>
                    <div><strong>Date:</strong> ${AppUtils.formatDate(incident.created_at)}</div>
                    <div><strong>Salle:</strong> ${incident.room?.name}</div>
                </div>
                <div class="incident-description">
                    ${incident.description}
                </div>
            </div>
        `).join('');
    }

    filterIncidents() {
        const roomFilter = this.roomFilter.value;
        const statusFilter = this.statusFilter.value;
        const priorityFilter = this.priorityFilter.value;
        
        let filtered = this.incidents;
        
        if (roomFilter) {
            filtered = filtered.filter(incident => incident.room_id == roomFilter);
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(incident => incident.status === statusFilter);
        }
        
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(incident => incident.priority === priorityFilter);
        }
        
        return filtered;
    }

    updateStats(stats) {
        this.totalIncidents.textContent = stats.total || this.incidents.length;
        this.openIncidents.textContent = stats.byStatus?.open || 
            this.incidents.filter(i => i.status === 'open').length;
        this.criticalIncidents.textContent = this.incidents.filter(i => i.priority === 'critical').length;
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.incidentForm.reset();
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.incidentForm.reset();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            room_id: this.roomSelect.value,
            equipment_id: this.equipmentSelect.value,
            description: this.descriptionTextarea.value,
            priority: this.prioritySelect.value,
            reported_by: this.currentUser
        };

        try {
            await this.apiService.createIncident(formData);
            this.closeModal();
            await this.loadIncidents();
            await this.loadStats();
            this.showSuccess('Incident signalé avec succès');
        } catch (error) {
            this.showError('Erreur lors de la création de l\'incident');
        }
    }

    // Méthodes d'interface utilisateur
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.incidentsList.classList.add('hidden');
    }

    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
        this.incidentsList.classList.remove('hidden');
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.hideLoading();
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <span class="success-icon">✅</span>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new IncidentsManager();
    console.log('🚀 Gestionnaire d\'incidents initialisé');
});