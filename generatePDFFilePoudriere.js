import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import fontKit from '@pdf-lib/fontkit';
import convertPDFToPNG from './transformPDFToPNG.js';

function getDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear()-124;
    return `${day}.${month}.${year}`;
}

function createInvoiceNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `${randomNumber}`;
}

async function createPoudrierePdf(data) {

    const employee = JSON.parse(data)["employee"];
    const customer = JSON.parse(data)["customer"];
    const pourcentImposable = JSON.parse(data)["pourcentimposable"];
    const products = JSON.parse(data)["products"];
    const signature = JSON.parse(data)["signature"];

    const id = createInvoiceNumber();

    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontKit);

    const signatures = fs.readdirSync(path.join(process.cwd(), "signatures-poudriere"));

    const fontYoungHeartBytes = fs.readFileSync('Young-Heart.ttf');
    const fontYoungHeart = await pdfDoc.embedFont(fontYoungHeartBytes);

    const fontRailroadBytes = fs.readFileSync('IFC-Railroad.ttf');
    const fontRailroad = await pdfDoc.embedFont(fontRailroadBytes);

    const EastwoodBytes = fs.readFileSync('Eastwood.ttf');
    const fontEastwood = await pdfDoc.embedFont(EastwoodBytes);

    const TexasBoldBytes = fs.readFileSync('Texas-Bold.otf');
    const fontTexasBold = await pdfDoc.embedFont(TexasBoldBytes);

    const imageBytes = fs.readFileSync('Facture-Poudrière.png');
    const factureImage = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.addPage([factureImage.width, factureImage.height]);

    const fontSize = 60;

    const employeeName = (employee.split(" ")[0]).toLowerCase() + "-" + (employee.split(" ")[1]).toLowerCase();

    // | : x ; -- : y

    page.drawImage(factureImage, {
        x: 0,
        y: 0,
        width: factureImage.width,
        height: factureImage.height,
    });

    for(let i = 0; i < signatures.length; i++) {
        if(employeeName == signatures[i].split(".")[0]) {
            console.log("Signature trouvée pour l'employé : " + employee);
            const signatureImageBytes = fs.readFileSync(path.join(process.cwd(), "signatures-poudriere", signatures[i]));
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
            page.drawImage(signatureImage, {
                x: 1500,
                y: 200,
                width: signatureImage.width,
                height: signatureImage.height,
            });
        }
    }

    // Bill Serial Text
    page.drawText(`${id}`, {
        x: 2000,
        y: 2320,
        size: 90,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });


    // Customer > Civilite Text
    page.drawText(`${customer["civilite"]}`, {
        x: 420,
        y: 2720,
        size: fontSize,
        font: fontEastwood,
        color: rgb(0.17, 0.17,0.18),
    });

     // Customer > Lastname Text
    page.drawText(`${customer["lastname"]}`, {
        x: 300,
        y: 2650,
        size: fontSize,
        font: fontEastwood,
        color: rgb(0.17, 0.17,0.18),
    });

    // Customer > Firstname Text
    page.drawText(`${customer["firstname"]}`, {
        x: 420,
        y: 2590,
        size: fontSize,
        font: fontEastwood,
        color: rgb(0.17, 0.17,0.18),
    });

    let firstRowOfProductTableInY = 2060;

    let rowQuantiteInX = 370;
    let rowNameInX = 550;
    let rowSerialInX = 1390;
    let rowPriceInX = 1670;
    let rowRemiseInX = 1900;
    let rowSommesInX = 2150;

    let totalSommes = 0;
    let totalImposable = 0;

    products.forEach(product => {
        // Product > Name Text
        page.drawText(`${product["name"]}`, {
            x: rowNameInX,
            y: firstRowOfProductTableInY,
            size: fontSize,
            font: fontEastwood,
            color: rgb(0.17, 0.17,0.18),
        });

        // Product > Quantity Text
        page.drawText(`${product["quantity"]}`, {
            x: rowQuantiteInX,
            y: firstRowOfProductTableInY,
            size: fontSize,
            font: fontRailroad,
            color: rgb(0.17, 0.17,0.18),
        });

        // Product > Price Text
        page.drawText(`${Number(product["price"]).toFixed(2)}`, {
            x: rowPriceInX,
            y: firstRowOfProductTableInY,
            size: fontSize,
            font: fontRailroad,
            color: rgb(0.17, 0.17,0.18),
        });

        if(product["SIA"]["isit"] == true) {
            // Product > Serial Text
            page.drawText(`${product["SIA"]["serial"]}`, {
                x: rowSerialInX,
                y: firstRowOfProductTableInY,
                size: fontSize-12,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });
        }

        if(product["remise"]["isit"] == true) {
            // Product > Remise Text
            page.drawText(`${Number(product["price"]*product["remise"]["amount"]).toFixed(2)}`, {
                x: rowRemiseInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });
            

            // Product > Sommes Text
            page.drawText(`${Number(product["price"]*product["quantity"]-product["price"]*product["quantity"]*product["remise"]["amount"]).toFixed(2)}`, {
                x: rowSommesInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });

            totalSommes += product["price"]*product["quantity"]-product["price"]*product["quantity"]*product["remise"]["amount"];
            totalImposable += product["price"]*pourcentImposable*product["remise"]["amount"];
        }
        else{

            // Product > Sommes Text
            page.drawText(`${Number(product["price"]*product["quantity"]).toFixed(2)}`, {
                x: rowSommesInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });

            totalSommes += product["price"]*product["quantity"];
            totalImposable += product["price"]*pourcentImposable;
        }


       
        firstRowOfProductTableInY -= 93; // Move to the next row
    });

    // Product > Total Sommmes Text
    page.drawText(`${Number(totalSommes).toFixed(2)}`, {
        x: rowSommesInX,
        y: 540,
        size: fontSize,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });

    // Product > Total Imposable Text
    page.drawText(`${Number(totalImposable).toFixed(2)}`, {
        x: 2040,
        y: 470,
        size: fontSize,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });

        // Date Text
    page.drawText(`${getDate()}`, {
        x: 1850,
        y: 2250,
        size: 70,
        font: fontEastwood,
        color: rgb(0.17, 0.17,0.18),
    });

    // Employee Text
    page.drawText(`${employee}`, {
        x: 480,
        y: 2250,
        size: 70,
        font: fontEastwood,
        color: rgb(0.17, 0.17,0.18),
    });

    await fs.writeFileSync(path.join(process.cwd(), `factures-poudriere-pdf/${id}.pdf`), await pdfDoc.save());
    await convertPDFToPNG(path.join(process.cwd(), `factures-poudriere-pdf/${id}.pdf`), path.join(process.cwd(), `factures-poudriere-image/`), `${id}`);
    return `${id}.png`;
}

export default createPoudrierePdf;
