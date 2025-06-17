export default {
    message: {
        hello: 'Hello',
        welcome: 'Welcome to FluoGraphiX',
        language: 'Language',
        french: 'French',
        english: 'English'
    },
    nav: {
        home: 'HOME',
        calibration: 'CALIBRATION',
        visualization: 'VISUALIZATION',
        documentation: 'DOCUMENTATION',
        download: 'DOWNLOAD'
    },
    buttons: {
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        start: 'Start',
        back: 'Back',
        close: 'Close',
        discover: 'DISCOVER',
        download: 'DOWNLOAD',
        seeMore: 'SEE MORE',
        try: 'TRY NOW'
    },
    home: {
        heroTitle: 'FluoGraphiX: the visualization and processing tool for fluorometer data',
        cards: {
            visualize: 'View, correct and convert your measurement data',
            calibration: 'Check your calibration data and verify their compliance',
            documentation: 'Consult the documentation to get answers to your questions',
            seeMore: 'See more'
        },
        welcome: {
            title: 'Welcome to',
            subtitle: 'A new way to process your data from hydrogeological tracing campaigns.'
        },
        features: {
            title: 'Innovative',
            titleHighlight: 'features',
            mobile: {
                title: 'Mobile, like you',
                description: 'Available on all your devices: PC, phones, tablets, even without internet connection'
            },
            versatile: {
                title: 'Versatile',
                description: 'FluoGraphiX supports DAT, CSV, XML and MV files to display your data'
            },
            compatible: {
                title: 'Designed for your tools',
                description: 'Concentration data exports compatible with BRGM\'s TRAC tool'
            },
            performance: {
                title: 'High performance',
                description: 'Optimal performance, even with large complex files to process'
            },
            calibration: {
                title: 'Simplified calibration',
                description: 'Take advantage of the support for calibration files in simplified CSV format to edit your calibration data'
            },
            interactive: {
                title: 'Interactive charts',
                description: 'Enjoy zooming and panning on charts to analyze all your data closely'
            }
        },
        install: {
            title: 'Install',
            titleEnd: 'now',
            subtitle: 'A new way to process your data from hydrogeological tracing campaigns.'
        },
        visualization: {
            title: 'Visualization',
            titleEnd: 'of your data',
            description1: 'View your measurement data, benefiting from smooth interactive charts.',
            description2: 'Many calculation options are available: turbidity correction, background noise, interference and conversion to concentrations.',
            description3: 'You can also export your data in CSV or TRAC format.'
        },
        calibrationSection: {
            title: 'Calibration',
            titleEnd: 'data',
            description1: 'View your calibration data, taking advantage of simplified tables and innovative features',
            description2: 'Check the integrity of your calibration data in real time using dedicated curves: be alerted in case of suspicious invalid data.'
        },
        contribute: {
            title: 'You too,',
            titleEnd: 'contribute',
            description: 'Visit GitHub to participate in the project, follow updates, report bugs or suggest ideas... And much more!'
        }
    },
    footer: {
        cookieManagement: 'Cookie Management',
        legalNotices: 'Legal Notices & Credits',
        contentSources: 'Content Sources',
        seeMore: 'See more',
        copyright: '© BRGM 2023-2025. All rights reserved.'
    },
    popups: {
        error: {
            title: 'Error',
            unexpectedCalculation: 'Unexpected error during calculation',
            generalError: 'An error has occurred. Please check your data and try again later. If the problem persists, please open an issue on the Github repository.',
            alt: 'Error image',
            tooLargeGap: 'Gap between two files too large',
            tooLargeGapDescription: 'The gap between two imported measurement files is greater than 9 days. Import canceled.',
        },
        warning: {
            title: 'Warning',
            confirmAction: 'Action confirmation',
            alt: 'Warning image',
            correlationCoefficient: 'Warning - correlation coefficient',
            correlationMessage: 'The Pearson correlation coefficient for "{traceurName}" is {coeffValue}. It is advisable to check for instrumental drift or choose a different data range for this calculation.',
            noDataCalibration: 'No measurement files found',
            noDataCalibrationDescription: 'Please import at least one measurement file in addition to a calibration file or use the "calibration" page for your calibration files only.',
            calibrationWarning: 'Potentially inconsistent data detected',
            calibrationWarningDescription: 'The calculated data indicates a potential error in the calibration data. Ensure that the calibration data is correct and consistent.',
        },
        success: {
            title: 'Success',
            operationComplete: 'Operation completed successfully',
            alt: 'Success image'
        },
        info: {
            title: 'Information',
            alt: 'Information image',
            selectRange: 'Select a range on the chart',
            selectRangeDescription: 'Start by selecting the period influenced by the tracer by clicking and holding the left mouse button on the chart, then releasing the click at the end of the area to be selected.'
        },
        loading: {
            title: 'Loading in progress',
            description: 'Loading imported files, please wait...'
        }
    },
    notifications: {
        info: {
            title: 'Information',
            correlationInfo: 'The Pearson correlation coefficient for "{traceurName}" is {coeffValue}.',
            zoomReset: 'The zoom of the chart has been reset',
        },
        warning: {
            title: 'Warning',
            notEnoughData: 'Not enough data for background noise correction',
            notYetImplemented: 'Correction of interferences for more than 2 tracers not implemented',
            noDataToExport: 'No file to download: no data to export',
        },
        error: {
            title: 'Error',
            noTrackerForNoise: 'No tracer available for background noise correction',
            notGreatNumberTrackersForNoise: 'Background noise correction is only possible with one or two tracers',
            notGreatNumberVariablesForNoise: 'Please select at least one explanatory variable',
            undefinedTrackerColumn: 'Columns not found for the tracer "{traceurName}"',
            undefinedElementIntoDOM: 'Element not found in the DOM',
            errorCopyPictureClipboard: 'Unable to copy the image to the clipboard',
            errorCopyTextClipboard: 'Unable to copy the text to the clipboard',
            noData: 'No exploitable data found',
            failDateFormatDetection: 'Date format detection failed. Please try again without the Calibrat.dat file.',
            undefinedError: 'An unexpected error occurred while processing the file',
            invalidDateFormat: 'Invalid date format',
            invalidPeriod: 'Please select a valid period for background noise correction',
            invalidPeriodSelection: 'An error occurred while selecting the period.',
            undefinedWaterTracker: 'Water tracer not found. Please check your calibration data',
            failBackgroundNoiseCorrection: 'An error occurred during background noise correction',
            oneTrackerForConcentrationNeeded: 'Please select a tracer for conversion to concentrations',
            needsForTracExport: 'Please select a tracer and an injection date for TRAC export',
            noCommonLamp: 'Unable to find a common lamp for correction',
        },
        success: {
            title: 'Success',
            copyPictureClipboard: 'Image copied to clipboard',
            copyTexteToClipboard: 'Text copied to clipboard',
            calibrationLoaded: 'Calibration file loaded successfully',
            backgroundNoiseCorrection: 'Background noise correction completed successfully',
            zoomEnabled: "Chart zoom and interaction settings modified",
            zoomDisabled: "Chart zoom and interaction settings disabled",
            resetChart: 'The chart has been reset with the initially imported data',
            downloadedFile: 'File downloaded successfully',
            deleteCourbs: 'The selected curves have been removed from the chart',
        }
    },
    calibration: {
        title: 'Section',
        titleHighlight: 'Calibration',
        description: 'Check your measuring device calibration data and export it to simplified CSV format.',
        supportedFiles: 'Supported file types',
        supportedFilesList: {
            dat: '.dat files for Albillia sàrl devices',
            csv: 'CSV files from FluoGraphiX. Learn more about',
            csvLink: 'calibration CSV files',
            csvLinkEnd: 'from FluoGraphiX'
        },
        dataToDisplay: 'Data to display',
        buttons: {
            import: 'IMPORT FILE',
            importTooltip: 'Import another calibration file',
            zoom: 'ZOOM',
            zoomTooltip: 'Reset chart view',
            export: 'EXPORT',
            exportTooltip: 'Export to CSV format',
            screenshot: 'Screenshot',
            screenshotTooltip: 'Copy screenshot'
        },
        equationUtility: {
            title: 'Equation utility',
            copy: 'Copy',
            noEquation: 'No equations to display yet.'
        }
    },
    visualization: {
        title: 'Section',
        titleHighlight: 'Visualization',
        description: 'Visualize your measurement data, correct it and export it to simplified format or TRAC format.',
        supportedFiles: 'Supported file types',
        supportedFilesList: {
            calibration: '.dat files and',
            calibrationLink: 'CSV files from FluoGraphiX',
            calibrationLinkEnd: 'for calibration data',
            measurements: 'MV, CSV, XML and TXT files for measurement data'
        },
        dateFormat: 'Date format:',
        dateFormats: {
            ddmmyyyy: 'dd/mm/yyyy',
            mmddyyyy: 'mm/dd/yyyy'
        },
        dataFromFile: 'Data from file'
    },
    carousel: {
        header: {
            title: 'Calculation and export utility'
        },
        commons: {
            calculate: 'Calculate',
            calibrationAnomalyDetected: 'Some of your calibration data may be incorrect, please check them.',
            noCalibrationAnomaly: 'No anomaly has been detected in your calibration data.',
            noCalibrationImported: 'No calibration file imported, no calculation possible.',
            tooltips: {
                importMoreFiles: 'Import more files',
                lockUnlockXAxis: 'Lock/unlock interactions on the x axis',
                lockUnlockYAxis: 'Lock/unlock interactions on the y axis',
                resetChartDisplay: 'Reset chart display',
                takeChartScreenshot: 'Take a screenshot of the chart'
            }
        },
        home: {
            welcome: {
                title: 'Welcome to the FluoGraphiX calculation and export utility',
                description: 'Perform various correction and export operations on your curves here',
                resetChart: 'Reset chart'
            },
            renaming: {
                title: 'You need to rename your curves based on your calibration data:',
                labelColumn: 'Label',
                curveColumn: 'Curve',
                select: 'Select...'
            },
            linkedSuccess: {
                title: 'Your tracers have been successfully linked to your data. No action is required on your part'
            },
            noCalibration: {
                title: 'You need to import a calibration file to perform additional calculations',
                import: 'Import calibration file'
            }
        },
        turbidity: {
            title: 'Turbidity correction',
            description: 'Correct the influence of turbidity on your curves',
            correctionLevel: 'Select the correction level to apply:',
            lampsToCorrect: 'Select the lamps to correct:'
        },
        interference: {
            title: 'Interference correction',
            tracersNumber: 'Select the number of tracers present:',
            oneTracer: '1 tracer',
            twoTracers: '2 tracers',
            tracersSelection: 'Select the tracers concerned:'
        },
        backgroundNoise: {
            title: 'Background noise correction',
            selectPeriod: 'Select the period influenced by the tracer:',
            graphicalSelection: 'Graphical selection',
            from: 'From:',
            to: 'To:',
            fromBeginning: 'From the beginning',
            toEnd: 'To the end',
            explanatoryVariables: 'Select the explanatory variables:'
        },
        concentration: {
            title: 'Concentration conversion',
            description: 'Convert your tracer curves to concentration',
            selectTracer: 'Select the tracer to convert:',
            convert: 'Convert'
        },
        export: {
            csvTitle: 'Export data to CSV format',
            exportCalculations: 'Export the list of calculations performed',
            export: 'Export',
            tracTitle: 'Export data to CSV TRAC format',
            injectionDate: 'Choose the injection date:',
            exportAsFile: 'Export as CSV file',
            copyToClipboard: 'Copy to clipboard'
        },
        deleteCurves: {
            title: 'Delete curves',
            selectCurves: 'Select curves to delete:',
            delete: 'Delete'
        }
    }
}
