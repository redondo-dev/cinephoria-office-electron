class ExportManager {
    constructor(incidentsManager) {
        this.incidentsManager = incidentsManager;
    }

    // Affiche le menu de sélection d'export
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
        
        // Gérer les clics sur les options
        modal.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                modal.remove();
                this.handleExport(format);
            });
        });
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Gère l'export selon le format
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

    // Export PDF
    async exportToPDF() {
        try {
            this.incidentsManager.showSuccess('Génération du PDF en cours...');
            
            const pdf = new jspdf.jsPDF();
            
            // Titre
            pdf.setFontSize(20);
            pdf.setTextColor(229, 9, 20);
            pdf.text('Cinephoria - Rapport des Incidents', 20, 20);
            
            // Date
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
            
            // Statistiques
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            const incidents = this.incidentsManager.incidents;
            pdf.text(`Total des incidents: ${incidents.length}`, 20, 45);
            pdf.text(`Incidents ouverts: ${incidents.filter(i => i.status === 'open').length}`, 20, 55);
            pdf.text(`Incidents critiques: ${incidents.filter(i => i.priority === 'critical').length}`, 20, 65);
            
            let yPosition = 80;
            
            // En-tête du tableau
            pdf.setFillColor(229, 9, 20);
            pdf.setTextColor(255, 255, 255);
            pdf.rect(20, yPosition, 170, 10, 'F');
            pdf.text('Salle', 22, yPosition + 7);
            pdf.text('Équipement', 60, yPosition + 7);
            pdf.text('Priorité', 110, yPosition + 7);
            pdf.text('Statut', 140, yPosition + 7);
            pdf.text('Date', 160, yPosition + 7);
            
            yPosition += 15;
            
            // Données des incidents
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
                
                pdf.text(incident.room?.name || 'N/A', 22, yPosition + 6);
                pdf.text(incident.equipment?.name || 'N/A', 60, yPosition + 6);
                
                const priorityColors = {
                    'critical': [229, 9, 20],
                    'high': [255, 107, 53],
                    'medium': [255, 165, 0],
                    'low': [76, 175, 80]
                };
                
                pdf.setTextColor(...priorityColors[incident.priority] || [0, 0, 0]);
                pdf.text(AppUtils.getPriorityLabel(incident.priority).replace(/[🟢🟡🟠🔴]/g, '').trim(), 110, yPosition + 6);
                pdf.setTextColor(0, 0, 0);
                
                pdf.text(AppUtils.getStatusLabel(incident.status).replace(/[🔓🔄✅]/g, '').trim(), 140, yPosition + 6);
                pdf.text(AppUtils.formatDate(incident.created_at), 160, yPosition + 6);
                
                yPosition += 10;
                
                // Description
                if (yPosition > 270) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(7);
                pdf.setTextColor(100, 100, 100);
                const description = incident.description.length > 80 
                    ? incident.description.substring(0, 80) + '...' 
                    : incident.description;
                pdf.text(`Description: ${description}`, 22, yPosition + 6);
                pdf.setFontSize(8);
                pdf.setTextColor(0, 0, 0);
                
                yPosition += 8;
            });
            
            // Pied de page
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Page ${i} sur ${pageCount}`, 180, 285, { align: 'right' });
            }
            
            // Sauvegarder
            const filename = `incidents-cinephoria-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
            this.incidentsManager.showSuccess('PDF généré avec succès !');
            
        } catch (error) {
            console.error('Erreur génération PDF:', error);
            this.incidentsManager.showError('Erreur lors de la génération du PDF');
        }
    }

    // Export JSON
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

    // Export CSV
    exportToCSV() {
        try {
            const headers = ['Salle', 'Équipement', 'Description', 'Priorité', 'Statut', 'Signalé par', 'Date'];
            const csvData = [
                headers.join(','),
                ...this.incidentsManager.incidents.map(incident => [
                    `"${incident.room?.name || ''}"`,
                    `"${incident.equipment?.name || ''}"`,
                    `"${incident.description.replace(/"/g, '""')}"`,
                    `"${AppUtils.getPriorityLabel(incident.priority)}"`,
                    `"${AppUtils.getStatusLabel(incident.status)}"`,
                    `"${incident.reported_by}"`,
                    `"${AppUtils.formatDate(incident.created_at)}"`
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
}