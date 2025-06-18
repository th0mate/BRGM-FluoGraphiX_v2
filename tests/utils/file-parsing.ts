/**
 * Utilitaires pour parser les fichiers de données dans les tests
 */


/**
 * Parse le contenu d'un fichier selon son type
 * @param content - Contenu du fichier à parser
 * @param ext - Extension du fichier (csv, mv, txt, xml)
 * @returns Object contenant les en-têtes et les premières/dernières lignes de données
 */
export function parseFileContent(content: string, ext: string) {
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (ext === 'csv') {
        const dataLines = lines.filter(l => l.match(/^[0-9]{2}\/\d{2}\/\d{2}/));
        const headers = lines.find(l => l.includes(';'))?.split(';').map(h => h.trim()) || [];
        return {
            headers,
            first: dataLines[0]?.split(';').map(x => x.trim()),
            last: dataLines.at(-1)?.split(';').map(x => x.trim())
        };
    }
    if (ext === 'mv') {
        const headerLine = lines.find(l => l.match(/Tracer/));
        let headers = headerLine ? headerLine.trim().split(/\s{2,}|\t|  +| (?=\S)/g).map(h => h.trim()) : [];
        for (let i = 0; i < headers.length - 1; i++) {
            if (/^(tracer|traceur|battery|baseline|conductiv)$/i.test(headers[i]) && /^\d+|v|sn$/i.test(headers[i+1])) {
                headers[i] = headers[i] + ' ' + headers[i+1];
                headers.splice(i+1, 1);
                i--;
            }
        }
        const dataLines = lines.filter(l => l.match(/^\s*\d+ /));
        return {
            headers,
            first: dataLines[0]?.trim().split(/\s+/),
            last: dataLines.at(-1)?.trim().split(/\s+/)
        };
    }
    if (ext === 'txt') {
        let headers = lines[0].split('\t').map(h => h.trim()).filter(h => h && h.match(/[a-zA-Z0-9]/));
        const dataLines = lines.slice(1);
        const clean = line => line.split('\t').filter((_, i) => headers[i] !== undefined);
        return {
            headers,
            first: clean(dataLines[0] || ''),
            last: clean(dataLines.at(-1) || '')
        };
    }
    if (ext === 'xml') {
        const timeBlocks = Array.from(content.matchAll(/<time [^>]*>([\s\S]*?)<\/time>/g));
        const getVals = block => block ? Array.from(block[1].matchAll(/<a\d+ v=\"([\d.]+)\"/g)).map(m => m[1]) : [];
        return {
            headers: [],
            first: getVals(timeBlocks[0]),
            last: getVals(timeBlocks.at(-1))
        };
    }
    return {headers: [], first: [], last: []};
}


/**
 * Normalise une chaîne de caractères pour faciliter la comparaison
 * @param str - Chaîne à normaliser
 * @returns Chaîne normalisée
 */
export function normalize(str: string): string {
    return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/traceur/g, 'tracer')
        .replace(/[^a-z0-9]/g, '');
}


/**
 * Trouve l'index d'une colonne dans les en-têtes
 * @param label - Libellé à rechercher
 * @param headers - En-têtes dans lesquels rechercher
 * @returns Index de la colonne ou -1 si non trouvé
 */
export function findColIdx(label: string, headers: string[]): number {
    const normLabel = normalize(label);
    if (normLabel === 't') return headers.findIndex(h => ['t','tdegc','tcc','tdeg'].includes(normalize(h)));
    if (normLabel === 'turbidity') return headers.findIndex(h => normalize(h) === 'turbidity');
    if (/^tracer\d+$/.test(normLabel)) return headers.findIndex(h => normalize(h) === normLabel);
    return headers.findIndex(h => normalize(h) === normLabel);
}
