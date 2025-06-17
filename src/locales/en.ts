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
            alt: 'Error image'
        },
        warning: {
            title: 'Warning',
            confirmAction: 'Action confirmation',
            alt: 'Warning image',
            correlationCoefficient: 'Warning - correlation coefficient',
            correlationMessage: 'The Pearson correlation coefficient for "{traceurName}" is {coeffValue}. It is advisable to check for instrumental drift or choose a different data range for this calculation.'
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
        info: 'Information',
        correlationInfo: 'The Pearson correlation coefficient for "{traceurName}" is {coeffValue}.'
    }
}
