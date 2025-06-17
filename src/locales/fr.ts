export default {
    message: {
        hello: 'Bonjour',
        welcome: 'Bienvenue sur FluoGraphiX',
        language: 'Langue',
        french: 'Français',
        english: 'Anglais'
    },
    nav: {
        home: 'ACCUEIL',
        calibration: 'CALIBRATION',
        visualization: 'VISUALISATION',
        documentation: 'DOCUMENTATION',
        download: 'TÉLÉCHARGEMENT'
    },
    buttons: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        start: 'Commencer',
        back: 'Retour',
        close: 'Fermer',
        discover: 'DÉCOUVRIR',
        download: 'TÉLÉCHARGER',
        seeMore: 'VOIR PLUS',
        try: 'ESSAYER'
    },
    home: {
        heroTitle: 'FluoGraphiX : l\'outil de visualisation et de traitement de données issues de fluorimètres',
        cards: {
            visualize: 'Visualisez, corrigez et convertissez vos données de mesure',
            calibration: 'Consultez vos données de calibration et vérifiez leur conformité',
            documentation: 'Consultez la documentation pour obtenir les réponses à vos questions',
            seeMore: 'Voir plus'
        },
        welcome: {
            title: 'Bienvenue sur',
            subtitle: 'Une nouvelle façon de traiter vos données issues de campagnes de traçage hydrogéologique.'
        },
        features: {
            title: 'Des fonctionnalités',
            titleHighlight: 'innovantes',
            mobile: {
                title: 'Mobile, comme vous',
                description: 'Disponible sur tous vos appareils : PC, téléphones, tablettes, même sans connexion internet'
            },
            versatile: {
                title: 'Polyvalent',
                description: 'FluoGraphiX prend en charge les fichiers DAT, CSV, XML et MV pour afficher vos données'
            },
            compatible: {
                title: 'Pensé pour vos outils',
                description: 'Exports des données de concentration compatibles avec l\'outil du BRGM TRAC'
            },
            performance: {
                title: 'Haute performances',
                description: 'Des performances optimales, même avec des fichiers volumineux complexes à traiter'
            },
            calibration: {
                title: 'Calibration simplifiée',
                description: 'Profitez de la prise en charge des fichiers de calibration au format simplifié CSV pour éditer vos données de calibration'
            },
            interactive: {
                title: 'Graphiques interactifs',
                description: 'Profitez du zoom et du déplacement sur les graphiques pour analyser de près toutes vos données'
            }
        },
        install: {
            title: 'Installez',
            titleEnd: 'maintenant',
            subtitle: 'Une nouvelle façon de traiter vos données issues de campagnes de traçage hydrogéologique.'
        },
        visualization: {
            title: 'Visualisation',
            titleEnd: 'de vos données',
            description1: 'Visualisez vos données de mesure, en profitant de graphiques interactifs fluides.',
            description2: 'De nombreuses options de calculs sont possibles : correction de turbidité, de bruit de fond, d\'interférences et conversion en concentrations.',
            description3: 'Vous pouvez également exporter vos données au format CSV ou TRAC.'
        },
        calibrationSection: {
            title: 'Données de',
            titleEnd: 'calibration',
            description1: 'Consultez vos données de calibration, en profitant de tableaux simplifiées et de fonctionnalités innovantes',
            description2: 'Vérifiez en direct l\'intégrité de vos données de calibration grâce aux courbes dédiées : soyez alertés en cas de suspicion de données invalides.'
        },
        contribute: {
            title: 'Vous aussi,',
            titleEnd: 'contribuez',
            description: 'Rendez-vous sur le Github pour participer au projet, suivre les mises à jour, signaler des bugs ou proposer des idées... Et bien plus encore !'
        }
    },
    footer: {
        cookieManagement: 'Gestion des cookies',
        legalNotices: 'Mentions légales & crédits',
        contentSources: 'Sources du contenu',
        seeMore: 'Voir plus',
        copyright: '© BRGM 2023-2025. Tous droits réservés.'
    },
    popups: {
        error: {
            title: 'Erreur',
            unexpectedCalculation: 'Erreur inattendue lors du calcul',
            generalError: 'Une erreur est survenue. Veuillez vérifier vos données et réessayer ultérieurement. Si le problème persiste, veuillez ouvrir une issue sur le dépôt Github.',
            alt: 'Image d\'erreur',
            tooLargeGap: 'Écart entre deux fichiers trop important',
            tooLargeGapDescription: 'L\'écart entre deux fichiers de mesures importés est supérieur à 9 jours. Import annulé.',
        },
        warning: {
            title: 'Attention',
            confirmAction: 'Confirmation de l\'action',
            alt: 'Image d\'avertissement',
            correlationCoefficient: 'Avertissement - coefficient de corrélation',
            correlationMessage: 'Le coefficient de corrélation de Pearson pour "{traceurName}" est de {coeffValue}. Il est conseillé de vérifier l\'absence de dérive instrumentale ou de choisir une plage de donnée différente pour ce calcul.',
            noDataCalibration: 'Aucun fichier de mesures trouvé',
            noDataCalibrationDescription: 'Veuillez importer au moins un fichier de mesures en plus d\'un fichier de calibration ou utiliser la page "calibration" pour vos fichiers de calibration seuls.',
        },
        success: {
            title: 'Succès',
            operationComplete: 'Opération terminée avec succès',
            alt: 'Image de succès'
        },
        info: {
            title: 'Information',
            alt: 'Image d\'information',
            selectRange: 'Sélectionnez une zone sur le graphique',
            selectRangeDescription: 'Commencez par sélectionner la période influencée par le traceur en cliquant et en maintenant le clic gauche sur le graphique, puis en relâchant le clic à la fin de la zone à sélectionner.',
        },
        loading: {
            title: 'Chargement en cours',
            description: 'Chargement des fichiers importés, veuillez patienter...',
        }
    },
    notifications: {
        info: {
            title: 'Information',
            correlationInfo: 'Le coefficient de corrélation de Pearson pour "{traceurName}" est de {coeffValue}.',
            zoomReset: 'Le zoom du graphique a été réinitialisé.',
        },
        warning: {
            title: 'Avertissement',
            notEnoughData: 'Pas assez de données pour la correction du bruit de fond',
            notYetImplemented: 'Correction d\'interférences pour plus de 2 traceurs non implémentée',
            noDataToExport: 'Aucun fichier à télécharger : aucune donnée à exporter'
        },
        error: {
            title: 'Erreur',
            noTrackerForNoise: 'Aucun traceur disponible pour la correction du bruit de fond',
            notGreatNumberTrackersForNoise: 'La correction de bruit de fond n\'est possible qu\'avec un ou deux traceurs',
            notGreatNumberVariablesForNoise: 'Veuillez sélectionner au moins une variable explicative',
            undefinedTrackerColumn: 'Colonnes non trouvées pour le traceur "{traceurName}"',
            undefinedElementIntoDOM: 'Element introuvable dans le DOM',
            errorCopyPictureClipboard: 'Impossible de copier l\'image dans le presse-papiers',
            errorCopyTextClipboard: 'Impossible de copier le texte dans le presse-papiers',
            noData: 'Aucune données exploitable trouvée',
            failDateFormatDetection: 'La détection du format de date a échoué. Veuillez réessayer sans le fichier Calibrat.dat.',
            undefinedError: 'Une erreur inattendue est survenue lors du traitement du fichier',
            invalidDateFormat: 'Format de date invalide',
            invalidPeriod: 'Veuillez sélectionner une période valide pour la correction du bruit de fond.',
            invalidPeriodSelection: 'Une erreur est survenue lors de la sélection de la période.',
            undefinedWaterTracker: 'Traceur eau non trouvé. Vérifiez vos données de calibration',
            failBackgroundNoiseCorrection: 'Une erreur s\'est produite lors de la correction du bruit de fond',
            oneTrackerForConcentrationNeeded: 'Veuillez sélectionner un traceur pour la conversion en concentrations',
            needsForTracExport: 'Veuillez sélectionner un traceur & une date d\'injection pour l\'export TRAC',
            noCommonLamp: 'Impossible de trouver une lampe commune pour la correction',
        },
        success: {
            title: 'Succès',
            copyPictureClipboard: 'Image copiée dans le presse-papiers',
            copyTexteToClipboard: 'Texte copié dans le presse-papiers',
            calibrationLoaded: 'Fichier de calibration chargé avec succès',
            backgroundNoiseCorrection: 'Correction du bruit de fond effectuée avec succès',
            zoomEnabled: "Paramètres de zoom et d'interaction sur le graphique modifiés",
            zoomDisabled: "Paramètres de zoom et d'interaction sur le graphique désactivés",
            resetChart: 'Le graphique a été réinitialisé avec les données importées au départ',
            downloadedFile: 'Fichier téléchargé avec succès',
            deleteCourbs: 'Les courbes sélectionnées ont été supprimées du graphique',
        }
    }
}
