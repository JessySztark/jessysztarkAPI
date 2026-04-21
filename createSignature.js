import fs from 'fs';
import path from 'path';

async function createSignature(fileBytes, employee) {
    var name = employee.split(" ")[0].toLowerCase() + "-" + employee.split(" ")[1].toLowerCase();
    const signaturesDir = path.join(process.cwd(), "signatures-poudriere");
    await fs.writeFileSync(path.join(signaturesDir, `${name}.png`), Buffer.from(fileBytes, 'base64'));
    return `Signature de ${employee} enregistrée avec succès!`;
}

export default createSignature;