/**
 * Utilitaires pour accéder aux traceurs dans les tests
 */


/**
 * Récupère les traceurs depuis la session
 */
export async function getTraceursFromSession(page) {
  return await page.evaluate(() => {
    const session = window.Session;
    if (!session || !session.traceurs) {
      console.error('Session ou traceurs non disponibles:', session);
      return null;
    }

    return session.traceurs.map(traceur => {
      const dataObj = {};
      traceur.data.forEach((value, key) => {
        dataObj[key] = value;
      });

      const getDataValues = {};
      const cles = [
        'L1-1', 'L2-1', 'L3-1', 'L4-1',
        'L1-2', 'L2-2', 'L3-2', 'L4-2',
        'L1-3', 'L2-3', 'L3-3', 'L4-3'
      ];

      cles.forEach(cle => {
        try {
          getDataValues[cle] = traceur.getDataParNom(cle);
        } catch (e) {
          getDataValues[cle] = undefined;
        }
      });

      return {
        nom: traceur.nom,
        unite: traceur.unite,
        dateMesure: traceur.dateMesure,
        data: dataObj,
        getDataValues
      };
    });
  });
}


/**
 * Vérifie que les traceurs ont les propriétés attendues et les bonnes valeurs
 */
export function validateTraceurs(traceurs) {
  if (!traceurs) {
    console.error('Aucun traceur détecté. Vérifiez que window.Session.traceurs existe bien après l\'import du fichier de calibration.');
    return false;
  }

  if (traceurs.length === 0) {
    console.error('Aucun traceur n\'a été créé.');
    return false;
  }

  if (traceurs.length < 5) {
    console.error(`Nombre insuffisant de traceurs: ${traceurs.length} (attendu: au moins 5)`);
    return false;
  }

  for (const traceur of traceurs) {
    if (!traceur.nom) {
      console.error('Traceur sans nom détecté');
      return false;
    }

    if (Object.keys(traceur.data).length === 0) {
      console.error(`Traceur ${traceur.nom} sans données détecté`);
      return false;
    }

    console.log(`Vérification du traceur: ${traceur.nom}, Unité: ${traceur.unite}`);
    console.log(traceur.data);

    try {
      const values = traceur.getDataValues;

      if (traceur.unite === '') {
        validateSpecificValue(values['L1-1'], 1.19, `${traceur.nom} L1-1`);
        validateSpecificValue(values['L2-1'], 0.27, `${traceur.nom} L2-1`);
        validateSpecificValue(values['L3-1'], 0.61, `${traceur.nom} L3-1`);
        validateSpecificValue(values['L4-1'], 21.98, `${traceur.nom} L4-1`);
      } else if (traceur.nom === 'Uranine') {
        validateSpecificValue(values['L1-1'], 614.25, `${traceur.nom} L1-1`);
        validateSpecificValue(values['L2-1'], 40.56, `${traceur.nom} L2-1`);
        validateSpecificValue(values['L3-1'], 23.71, `${traceur.nom} L3-1`);
        validateSpecificValue(values['L4-1'], 24.43, `${traceur.nom} L4-1`);
        validateSpecificValue(values['L1-2'], 65.47, `${traceur.nom} L1-2`);
        validateSpecificValueIsNaN(values['L2-2'], `${traceur.nom} L2-2`);
        validateSpecificValueIsNaN(values['L3-2'], `${traceur.nom} L3-2`);
        validateSpecificValueIsNaN(values['L4-2'], `${traceur.nom} L4-2`);
      } else if (traceur.nom === "SrhodaminB") {
        validateSpecificValue(values['L1-1'], 41.29, `${traceur.nom} L1-1`);
        validateSpecificValue(values['L2-1'], 155.64, `${traceur.nom} L2-1`);
        validateSpecificValue(values['L3-1'], 2.52, `${traceur.nom} L3-1`);
        validateSpecificValue(values['L4-1'], 24.11, `${traceur.nom} L4-1`);
        validateSpecificValueIsNaN(values['L1-2'], `${traceur.nom} L1-2`);
        validateSpecificValue(values['L2-2'], 17.17, `${traceur.nom} L2-2`);
        validateSpecificValueIsNaN(values['L3-2'], `${traceur.nom} L3-2`);
        validateSpecificValueIsNaN(values['L4-2'], `${traceur.nom} L4-2`);
      } else if (traceur.nom === "AminoGacid") {
        validateSpecificValue(values['L1-1'], 2.2, `${traceur.nom} L1-1`);
        validateSpecificValue(values['L2-1'], 0.69, `${traceur.nom} L2-1`);
        validateSpecificValue(values['L3-1'], 47.38, `${traceur.nom} L3-1`);
        validateSpecificValue(values['L4-1'], 24.12, `${traceur.nom} L4-1`);
        validateSpecificValueIsNaN(values['L1-2'], `${traceur.nom} L1-2`);
        validateSpecificValueIsNaN(values['L2-2'], `${traceur.nom} L2-2`);
        validateSpecificValue(values['L3-2'], 6.24, `${traceur.nom} L3-2`);
        validateSpecificValueIsNaN(values['L4-2'], `${traceur.nom} L4-2`);
      } else {
        validateSpecificValue(values['L1-1'], 1.55, `${traceur.nom} L1-1`);
        validateSpecificValue(values['L2-1'], 0.5, `${traceur.nom} L2-1`);
        validateSpecificValue(values['L3-1'], 0.9, `${traceur.nom} L3-1`);
        validateSpecificValue(values['L4-1'], 38.23, `${traceur.nom} L4-1`);
        validateSpecificValue(values['L1-2'], 2.02, `${traceur.nom} L1-2`);
        validateSpecificValue(values['L2-2'], 0.74, `${traceur.nom} L2-2`);
        validateSpecificValue(values['L3-2'], 1.56, `${traceur.nom} L3-2`);
        validateSpecificValue(values['L4-2'], 151.93, `${traceur.nom} L4-2`);
        validateSpecificValue(values['L1-3'], 7.1, `${traceur.nom} L1-3`);
        validateSpecificValue(values['L2-3'], 2.92, `${traceur.nom} L2-3`);
        validateSpecificValue(values['L3-3'], 7.32, `${traceur.nom} L3-3`);
        validateSpecificValue(values['L4-3'], 1137.63, `${traceur.nom} L4-3`);
      }
    } catch (error) {
      console.error(`Erreur lors de la validation des valeurs pour ${traceur.nom}:`, error);
      return false;
    }
  }

  return true;
}


/**
 * Valide qu'une valeur est égale à une valeur attendue (avec une tolérance)
 * @param actual - Valeur réelle
 * @param expected - Valeur attendue
 * @param label - Label pour le message d'erreur
 */
function validateSpecificValue(actual, expected, label) {
  const tolerance = 0.01; // 1% de tolérance

  if (typeof expected === 'number') {
    const actualNum = parseFloat(actual);
    if (isNaN(actualNum)) {
      console.error(`${label}: la valeur attendue est numérique (${expected}), mais la valeur réelle n'est pas un nombre: ${actual}`);
      throw new Error(`${label} validation failed: expected ${expected}, got ${actual}`);
    }

    const diff = Math.abs((actualNum - expected) / expected);
    if (diff > tolerance) {
      console.error(`${label}: différence trop importante: ${actualNum} vs ${expected}, diff: ${diff}`);
      throw new Error(`${label} validation failed: expected ${expected}, got ${actualNum}`);
    }
  } else if (actual !== expected) {
    console.error(`${label}: valeurs non égales: ${actual} vs ${expected}`);
    throw new Error(`${label} validation failed: expected ${expected}, got ${actual}`);
  }
}


/**
 * Valide qu'une valeur est NaN
 * @param actual - Valeur à vérifier
 * @param label - Label pour le message d'erreur
 */
function validateSpecificValueIsNaN(actual, label) {
  if (actual !== "NaN" && !isNaN(actual)) {
    console.error(`${label}: la valeur devrait être NaN, mais c'est: ${actual}`);
    throw new Error(`${label} validation failed: expected NaN, got ${actual}`);
  }
}
