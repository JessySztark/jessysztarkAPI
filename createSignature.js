import fs from 'fs';
import path from 'path';

async function createSignature(fileBytes, employee) {
    await fs.writeFileSync(path.join(process.cwd(), `signatures-poudriere/${employee}.png`), Buffer.from(fileBytes, 'base64'));
    return `Signature de ${employee} enregistrée avec succès!`;
}

export default createSignature;