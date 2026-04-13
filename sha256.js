import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function checkPassword(password) {
    const actualPassword = fs.readFileSync(path.join(process.cwd(), "pwd.txt"), "utf-8").trim();
    return encryptToSha256(password) === actualPassword;
}

function changePassword(newPassword) {
    const newHash = encryptToSha256(newPassword);
    fs.writeFileSync(path.join(process.cwd(), "pwd.txt"), newHash);
    return true;
}

function encryptToSha256(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

export default { checkPassword, changePassword, encryptToSha256 };