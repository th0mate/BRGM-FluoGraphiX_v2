/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 * Permet de gérer l'affichage des popups dans l'application
 * @deprecated Ce fichier est maintenu pour compatibilité - Utilisez popupService.ts à la place
 */

// Import du service de popup moderne
import { afficherPopup as showPopup, fermerPopup as closePopup } from './popupService';

// Réexporter les fonctions du nouveau service pour compatibilité
export const afficherPopup = showPopup;
export const fermerPopup = closePopup;

