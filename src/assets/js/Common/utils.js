/**
 * Réalisé par Thomas LOYE pour le compte du BRGM en 2025
 * www.thomasloye.fr
 */
import { afficherToast } from "./toastService";
import Session from "@/assets/js/Session/Session.js";
import {t} from '@/locales/i18nService';


/**
 * Ajoute des espaces pour aligner les chiffres
 * @param n le nombre à aligner
 * @param e le nombre d'espaces à ajouter au maximum
 * @returns {string} le nombre aligné avec le bon nombre d'espaces
 */
export function setEspaces(n, e) {
    return n.toString().padStart(e, " ");
}


/**
 * Convertit une date ISO en date et heure au format "dd/mm/yy-hh:mm:ss"
 * @param string la date ISO à convertir
 * @returns {string} la date et l'heure au format attendu
 */
export function getTime(string) {
    let date;

    // Détection Webkit/Safari
    const isWebkit = typeof navigator !== 'undefined' && /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (isWebkit && typeof string === 'string') {
        const match = string.trim().match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}) ([0-9]{2}:[0-9]{2}:[0-9]{2})/);
        if (match) {
            date = new Date(match[1] + 'T' + match[2]);
        } else {
            date = new Date(string);
        }
    } else {
        date = new Date(string);
    }
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString().substring(2, 4);
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year}-${hour}:${minutes}:${seconds}`;
}


/**
 * Convertit une date au format dd/mm/yy-hh:mm:ss ou yy/mm/dd-hh:mm:ss en date au format dd/mm/yy-hh:mm:ss
 * format = 0 : le format donné est dd/mm/yy-hh:mm:ss
 * format = 1 : le format donné est dd/mm/yy-hh:mm:ss
 * format = 2 : le format donné est yy/mm/dd-hh:mm:ss
 * @param string la date à convertir
 */
export function getTimeFromMV(string) {
    if (Session.getInstance().formatDates.toString() === '0') {
        afficherMessageFlash("notifications.error.title","notifications.error.failDateFormatDetection", 'error');
        throw new Error("Erreur : La détection du format de date a échoué. Veuillez réessayer sans le fichier Calibrat.dat.");
    } else if (Session.getInstance().formatDates.toString() === '1') {
        return string;
    } else if (Session.getInstance().formatDates.toString() === '2') {
        const date = string.substring(0, 8);
        const hour = string.substring(9, 17);
        return date.substring(6, 8) + "/" + date.substring(3, 5) + "/" + date.substring(0, 2) + "-" + hour;
    }
}


/**
 * Vérifie le nombre de décimales et ajoute des zéros si nécessaire pour avoir 2 décimales après la virgule en arrondissant
 * @param double le nombre à traiter
 * @returns {number|string} le nombre avec 2 décimales après la virgule
 */
export function around(double) {

    if (double === '') {
        return '';
    }

    if (double === 0.001) {
        return double;
    }
    const trait = Math.round(double * 100) / 100;
    const parts = trait.toString().split(".");

    if (trait.toString().length === 7) {
        return trait.toFixed(1);
    }
    if (trait.toString().length > 7) {
        return Math.round(trait);
    } else if (parts.length < 2 || parts[1].length < 2) {
        return trait.toFixed(2);
    } else {
        return trait;
    }
}


/**
 * Retourne la date d'aujourd'hui en toutes lettres en français
 * @returns {string} la date en question
 */
export function getDateAujourdhui() {
    const date = new Date();
    const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()}`;
}


/**
 * Retourne un tableau contenant la date au format dd/mm/yyyy et l'heure au format hh:mm:ss depuis le format dd/mm/yyyy-hh:mm:ss
 * @param date {string} la date au format dd/mm/yyyy-hh:mm:ss
 */
export function getDateHeure(date) {
    const dateHeure = date.split('-');
    return [dateHeure[0], dateHeure[1]];
}


/**
 * Arrondi le chiffre passé en paramètre à 2 décimales
 * @param chiffre {number} le chiffre à arrondir
 * @returns {number} le chiffre arrondi à 2 décimales
 */
export function arrondirA2Decimales(chiffre) {
    return Math.round(chiffre * 100) / 100;
}


/**
 * Affiche un message flash à l'utilisateur via une notification Vue.js
 * @param titre {string|null} le titre de la notification ou clé de traduction. Si null, un titre par défaut sera choisi selon le type.
 * @param message {string} le message à afficher dans la notification ou clé de traduction.
 * @param type {string} le type de notification ('success', 'info', 'warn', 'error'). Par défaut, 'success'.
 * @param params {Object} paramètres optionnels pour l'interpolation de variables dans les traductions
 */
export function afficherMessageFlash(titre = null, message, type = 'success', params = {}) {
    const titreTraite = titre ? (titre.includes('.') ? t(titre) : titre) : null;
    const messageTraite = message.includes('.') ? t(message, params) : message;
    afficherToast(titreTraite, messageTraite, type);
}
