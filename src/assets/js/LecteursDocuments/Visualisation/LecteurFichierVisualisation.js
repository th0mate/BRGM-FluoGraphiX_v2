// Classe mère pour la lecture de fichiers de visualisation
export class LecteurFichierVisualisation {
    constructor(fichier) {
        this.fichier = fichier;
        this.lignes = [];
        this.nbLignes = 0;
        this.premiereDate = '';
        this.derniereDate = '';
    }


    lireFichier() {
        throw new Error('Méthode lireFichier() à implémenter dans la sous-classe');
    }


    convertirDonneesToCSV() {
        throw new Error('Méthode convertirDonneesToCSV() à implémenter dans la sous-classe');
    }


    /**
     * Met à jour lignes, nbLignes, premiereDate, derniereDate à partir d'un contenu CSV
     * @param {string} contenuCSV
     */
    extraireInfosCSV(contenuCSV) {
        this.lignes = contenuCSV.split('\n').filter(l => l.trim() !== '');
        this.nbLignes = this.lignes.length;
        this.premiereDate = '';
        this.derniereDate = '';
        for (let i = 3; i < this.lignes.length; i++) {
            const date = this.lignes[i]?.split(';')[0];
            if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                this.premiereDate = date;
                break;
            }
        }
        for (let i = this.lignes.length - 1; i >= 3; i--) {
            const date = this.lignes[i]?.split(';')[0];
            if (date && date.match(/\d{2}\/\d{2}\/\d{2}/)) {
                this.derniereDate = date;
                break;
            }
        }
    }
}
