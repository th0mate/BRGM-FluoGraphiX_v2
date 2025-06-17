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
            calibrationWarning: 'Données potentiellement incohérentes détectées',
            calibrationWarningDescription: 'Les données calculées indiquent une potentielle erreur dans les données de calibration. Assurez-vous que les données de calibration sont correctes et cohérentes.',
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
    },
    calibration: {
        title: 'Partie',
        titleHighlight: 'Calibration',
        description: 'Vérifiez vos données de calibration de vos appareils de mesure, et exportez-les au format CSV simplifié.',
        supportedFiles: 'Types de fichiers pris en charge',
        supportedFilesList: {
            dat: 'Fichiers .dat pour les appareils Albillia sàrl',
            csv: 'Fichiers CSV issus de FluoGraphiX. En savoir plus sur les',
            csvLink: 'fichiers CSV de calibration',
            csvLinkEnd: 'de FluoGraphiX'
        },
        dataToDisplay: 'Données à afficher',
        buttons: {
            import: 'IMPORTER FICHIER',
            importTooltip: 'Importer un autre fichier de calibration',
            zoom: 'ZOOM',
            zoomTooltip: 'Réinitialiser l\'affichage du graphique',
            export: 'EXPORTER',
            exportTooltip: 'Exporter au format CSV',
            screenshot: 'Capture',
            screenshotTooltip: 'Copier une capture d\'écran'
        },
        equationUtility: {
            title: 'Utilitaire d\'équations',
            copy: 'Copier',
            noEquation: 'Aucune équation à afficher pour l\'instant.'
        }
    },
    visualization: {
        title: 'Partie',
        titleHighlight: 'Visualisation',
        description: 'Visualisez vos données de mesure, corrigez-les et exportez-les au format simplifié ou au format TRAC.',
        supportedFiles: 'Types de fichiers pris en charge',
        supportedFilesList: {
            calibration: 'Fichiers .dat et',
            calibrationLink: 'CSV issus de FluoGraphiX',
            calibrationLinkEnd: 'pour les données de calibration',
            measurements: 'Fichiers MV, CSV, XML et TXT pour les données de mesure'
        },
        dateFormat: 'Format de date :',
        dateFormats: {
            ddmmyyyy: 'jj/mm/aaaa',
            mmddyyyy: 'mm/jj/aaaa'
        },
        dataFromFile: 'Données issues du fichier'
    },
    carousel: {
        header: {
            title: 'Utilitaire de calculs et d\'export'
        },
        commons: {
            calculate: 'Calculer',
            calibrationAnomalyDetected: 'Certaines de vos données de calibration sont susceptibles d\'être incorrectes, veuillez les vérifier.',
            noCalibrationAnomaly: 'Aucune anomalie n\'a été détectée dans vos données de calibration.',
            noCalibrationImported: 'Aucun fichier de calibration importé, aucun calcul possible.',
            tooltips: {
                importMoreFiles: 'Importer d\'autres fichiers',
                lockUnlockXAxis: 'Bloquer/libérer les interactions sur l\'axe x',
                lockUnlockYAxis: 'Bloquer/libérer les interactions sur l\'axe y',
                resetChartDisplay: 'Réinitialiser l\'affichage du graphique',
                takeChartScreenshot: 'Prendre une capture d\'écran du graphique'
            }
        },
        home: {
            welcome: {
                title: 'Bienvenue dans l\'utilitaire de calculs et d\'export de FluoGraphiX',
                description: 'Réalisez ici les différentes opérations de correction et d\'export de vos courbes',
                resetChart: 'Réinitialiser le graphique'
            },
            renaming: {
                title: 'Vous devez renommer vos courbes en fonction de vos données de calibration :',
                labelColumn: 'Label',
                curveColumn: 'Courbe',
                select: 'Sélectionner...'
            },
            linkedSuccess: {
                title: 'Vos traceurs ont été liés à vos données avec succès. Aucun action n\'est requise de votre part'
            },
            noCalibration: {
                title: 'Vous devez importer un fichier de calibration pour effectuer des calculs supplémentaires',
                import: 'Importer un fichier de calibration'
            }
        },
        turbidity: {
            title: 'Correction de la turbidité',
            description: 'Corrigez l\'influence de la turbidité sur vos courbes',
            correctionLevel: 'Sélectionnez le niveau de correction à appliquer :',
            lampsToCorrect: 'Sélectionnez les lampes à corriger :'
        },
        interference: {
            title: 'Correction des interférences',
            tracersNumber: 'Sélectionnez le nombre de traceurs présents :',
            oneTracer: '1 traceur',
            twoTracers: '2 traceurs',
            tracersSelection: 'Sélectionnez les traceurs concernés :'
        },
        backgroundNoise: {
            title: 'Correction du bruit de fond',
            selectPeriod: 'Sélectionnez la période influencée par le traceur :',
            graphicalSelection: 'Sélection graphique',
            from: 'Du :',
            to: 'Au :',
            fromBeginning: 'Depuis le début',
            toEnd: 'Jusqu\'à la fin',
            explanatoryVariables: 'Sélectionnez les variables explicatives :'
        },
        concentration: {
            title: 'Conversion en concentration',
            description: 'Convertissez les courbes de vos traceurs en concentration',
            selectTracer: 'Sélectionnez le traceur à convertir :',
            convert: 'Convertir'
        },
        export: {
            csvTitle: 'Export des données au format CSV',
            exportCalculations: 'Exporter la liste des calculs effectués',
            export: 'Exporter',
            tracTitle: 'Export des données au format CSV TRAC',
            injectionDate: 'Choisissez la date d\'injection :',
            exportAsFile: 'Exporter en tant que fichier CSV',
            copyToClipboard: 'Copier dans le presse-papiers'
        },
        deleteCurves: {
            title: 'Supprimer des courbes',
            selectCurves: 'Sélectionnez les courbes à supprimer :',
            delete: 'Supprimer'
        }
    }
}
