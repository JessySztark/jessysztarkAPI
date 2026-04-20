import fs from 'fs';
import path from 'path';

function createSignature(fileBytes, employee) {
    fs.writeFileSync(path.join(process.cwd(), `signatures-poudriere/${employee}.png`), Buffer.from(fileBytes, 'base64'));
    return `Signature de ${employee} enregistrée avec succès!`;
}

export default createSignature;