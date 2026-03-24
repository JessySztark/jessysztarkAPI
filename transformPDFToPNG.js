import { exec } from "child_process";
import path from "path";

function convertPDFToPNG(pdfPath, outputPath, id) {
    return new Promise((resolve, reject) => {
        const outputFile = path.join(outputPath, `${id}.png`);

        const command = `convert "${pdfPath}[0]" "${outputFile}"`;

        exec(command, (err, stdout, stderr) => {
            if (err) return reject(stderr || err);
            resolve(stdout);
        });
    });
}

export default convertPDFToPNG;
