class ExportManager {
    constructor(incidentsManager) {
        this.incidentsManager = incidentsManager;
    }

    showExportMenu() {
        const exportMenu = `
            <div class="export-modal">
                <div class="export-options">
                    <h3>Exporter les incidents</h3>
                    <button class="export-option" data-format="json">
                        <span class="export-icon">📊</span>
                        <span class="export-text">
                            <strong>JSON</strong>
                            <small>Format brut, idéal pour l'analyse</small>
                        </span>
                    </button>
                    <button class="export-option" data-format="pdf">
                        <span class="export-icon">📄</span>
                        <span class="export-text">
                            <strong>PDF</strong>
                            <small>Rapport formaté pour impression</small>
                        </span>
                    </button>
                    <button class="export-option" data-format="csv">
                        <span class="export-icon">📋</span>
                        <span class="export-text">
                            <strong>CSV</strong>
                            <small>Tableur Excel/Google Sheets</small>
                        </span>
                    </button>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = exportMenu;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                modal.remove();
                this.handleExport(format);
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    handleExport(format) {
        switch (format) {
            case 'json':
                this.exportToJSON();
                break;
            case 'pdf':
                this.exportToPDF();
                break;
            case 'csv':
                this.exportToCSV();
                break;
        }
    }

    async exportToPDF() {
        try {
            this.incidentsManager.showSuccess('Génération du PDF en cours...');
            
            const pdf = new jspdf.jsPDF();
            
            pdf.setFontSize(20);
            pdf.setTextColor(229, 9, 20);
            pdf.text('Cinephoria - Rapport des Incidents', 20, 20);
            
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
            
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            const incidents = this.incidentsManager.incidents;
            pdf.text(`Total des incidents: ${incidents.length}`, 20, 45);
            pdf.text(`Incidents ouverts: ${incidents.filter(i => i.statut === 'ouvert').length}`, 20, 55);
            pdf.text(`Incidents critiques: ${incidents.filter(i => i.priorite === 'critical').length}`, 20, 65);
            
            let yPosition = 80;
            
            pdf.setFillColor(229, 9, 20);
            pdf.setTextColor(255, 255, 255);
            pdf.rect(20, yPosition, 170, 10, 'F');
            pdf.text('Salle', 22, yPosition + 7);
            pdf.text('Titre', 60, yPosition + 7);
            pdf.text('Priorité', 110, yPosition + 7);
            pdf.text('Statut', 140, yPosition + 7);
            pdf.text('Date', 160, yPosition + 7);
            
            yPosition += 15;
            
            pdf.setFontSize(8);
            pdf.setTextColor(0, 0, 0);
            
            incidents.forEach((incident, index) => {
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                if (index % 2 === 0) {
                    pdf.setFillColor(245, 245, 245);
                    pdf.rect(20, yPosition, 170, 8, 'F');
                }
                
                pdf.text(incident.salle?.nom || 'N/A', 22, yPosition + 6);
                pdf.text(incident.titre || 'N/A', 60, yPosition + 6);
                
                const priorityColors = {
                    'critical': [229, 9, 20],
                    'high': [255, 107, 53],
                    'medium': [255, 165, 0],
                    'low': [76, 175, 80]
                };
                
                pdf.setTextColor(...priorityColors[incident.priorite] || [0, 0, 0]);
                const priorityText = this.getPriorityLabel(incident.priorite);
                pdf.text(priorityText, 110, yPosition + 6);
                pdf.setTextColor(0, 0, 0);
                
                const statusText = this.getStatusLabel(incident.statut);
                pdf.text(statusText, 140, yPosition + 6);
                
                const date = new Date(incident.date_incident).toLocaleDateString('fr-FR');
                pdf.text(date, 160, yPosition + 6);
                
                yPosition += 10;
                
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(7);
                pdf.setTextColor(100, 100, 100);
                const description = incident.description?.length > 80 
                    ? incident.description.substring(0, 80) + '...' 
                    : incident.description || '';
                pdf.text(`Description: ${description}`, 22, yPosition + 6);
                pdf.setFontSize(8);
                pdf.setTextColor(0, 0, 0);
                
                yPosition += 8;
            });
            
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Page ${i} sur ${pageCount}`, 180, 285, { align: 'right' });
            }
            
            const filename = `incidents-cinephoria-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
            this.incidentsManager.showSuccess('PDF généré avec succès !');
            
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            this.incidentsManager.showError('Erreur lors de la génération du PDF');
        }
    }

    exportToJSON() {
        const data = JSON.stringify(this.incidentsManager.incidents, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `incidents-cinephoria-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.incidentsManager.showSuccess('Incidents exportés en JSON avec succès');
    }

    exportToCSV() {
        try {
            const headers = ['Salle', 'Titre', 'Description', 'Priorité', 'Statut', 'Signalé par', 'Date'];
            const csvData = [
                headers.join(','),
                ...this.incidentsManager.incidents.map(incident => [
                    `"${incident.salle?.nom || ''}"`,
                    `"${incident.titre || ''}"`,
                    `"${(incident.description || '').replace(/"/g, '""')}"`,
                    `"${this.getPriorityLabel(incident.priorite)}"`,
                    `"${this.getStatusLabel(incident.statut)}"`,
                    `"${incident.utilisateur?.email || 'Anonyme'}"`,
                    `"${new Date(incident.date_incident).toLocaleDateString('fr-FR')}"`
                ].join(','))
            ].join('\n');
            
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `incidents-cinephoria-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.incidentsManager.showSuccess('Incidents exportés en CSV avec succès');
        } catch (error) {
            console.error('Erreur export CSV:', error);
            this.incidentsManager.showError('Erreur lors de l\'export CSV');
        }
    }

    getPriorityLabel(priority) {
        const labels = {
            low: 'Basse',
            medium: 'Moyenne',
            high: 'Haute',
            critical: 'Critique'
        };
        return labels[priority] || priority;
    }

    getStatusLabel(status) {
        const labels = {
            ouvert: 'Ouvert',
            in_progress: 'En cours',
            resolved: 'Résolu',
            fermé: 'Fermé'
        };
        return labels[status] || status;
    }
}