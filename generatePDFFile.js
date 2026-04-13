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

async function createPdf(data) {

    const employee = JSON.parse(data)["employee"];
    const customer = JSON.parse(data)["customer"];
    const pourcentImposable = JSON.parse(data)["pourcentimposable"];
    const products = JSON.parse(data)["products"];

    const id = createInvoiceNumber();

    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontKit);

    const fontYoungHeartBytes = fs.readFileSync('Young-Heart.ttf');
    const fontYoungHeart = await pdfDoc.embedFont(fontYoungHeartBytes);

    const fontRailroadBytes = fs.readFileSync('IFC-Railroad.ttf');
    const fontRailroad = await pdfDoc.embedFont(fontRailroadBytes);

    const imageBytes = fs.readFileSync('Facture-vierge.png');
    const factureImage = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.addPage([factureImage.width, factureImage.height]);

    const fontSize = 60;

    page.drawImage(factureImage, {
        x: 0,
        y: 0,
        width: factureImage.width,
        height: factureImage.height,
    });

    // Bill Serial Text
    page.drawText(`${id}`, {
        x: 950,
        y: 2240,
        size: 90,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });


    // Customer > Civilite Text
    page.drawText(`${customer["civilite"]}`, {
        x: 1650,
        y: 2490,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    // Customer > Firstname Text
    page.drawText(`${customer["firstname"]}`, {
        x: 1900,
        y: 2490,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    // Customer > Lastname Text
    page.drawText(`${customer["lastname"]}`, {
        x: 2150,
        y: 2490,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    // Customer > Company Text
    page.drawText(`${customer["companyname"]}`, {
        x: 1650,
        y: 2380,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    // Customer > Company Text
    page.drawText(`${customer["companybusiness"]}`, {
        x: 1650,
        y: 2270,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

        // Customer > Company Text
    page.drawText(`${customer["town"]}`, {
        x: 1650,
        y: 2160,
        size: fontSize,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    let firstRowOfProductTableInY = 1360;

    let rowQuantiteInX = 300;
    let rowNameInX = 500;
    let rowPriceInX = 1500;
    let rowRemiseInX = 1700;
    let rowImposableInX = 2000;
    let rowSommesInX = 2250;

    let totalSommes = 0;
    let totalImposable = 0;

    products.forEach(product => {
        // Product > Name Text
        page.drawText(`${product["name"]}`, {
            x: rowNameInX,
            y: firstRowOfProductTableInY,
            size: fontSize,
            font: fontRailroad,
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

        if(product["remise"]["isit"] == true) {
            // Product > Remise Text
            page.drawText(`${Number(product["price"]-product["price"]*product["remise"]["amount"]).toFixed(2)}`, {
                x: rowRemiseInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });

            // Product > Imposable Text
            page.drawText(`${Number(product["remise"]["amount"]*product["price"]*(pourcentImposable/100)).toFixed(2)}`, {
                x: rowImposableInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });

            // Product > Sommes Text
            page.drawText(`${Number(product["remise"]["amount"]*product["price"]*product["quantity"]).toFixed(2)}`, {
                x: rowSommesInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });
        }
        else{
            // Product > Imposable Text
            page.drawText(`${Number(product["price"]*pourcentImposable).toFixed(2)}`, {
                x: rowImposableInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });

            // Product > Sommes Text
            page.drawText(`${Number(product["price"]*product["quantity"]).toFixed(2)}`, {
                x: rowSommesInX,
                y: firstRowOfProductTableInY,
                size: fontSize,
                font: fontRailroad,
                color: rgb(0.17, 0.17,0.18),
            });
        }


        totalSommes += product["price"]*product["quantity"];
        totalImposable += product["price"]*pourcentImposable;
        firstRowOfProductTableInY -= 100; // Move to the next row
    });

    // Product > Total Sommmes Text
    page.drawText(`${Number(totalSommes).toFixed(2)}`, {
        x: rowSommesInX,
        y: 170,
        size: fontSize,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });

    // Product > Total Imposable Text
    page.drawText(`${Number(totalImposable).toFixed(2)}`, {
        x: 2100,
        y: 100,
        size: fontSize,
        font: fontRailroad,
        color: rgb(0.17, 0.17,0.18),
    });

        // Date Text
    page.drawText(`${getDate()}`, {
        x: 680,
        y: 1775,
        size: 70,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    // Employee Text
    page.drawText(`${employee}`, {
        x: 1750,
        y: 1775,
        size: 70,
        font: fontYoungHeart,
        color: rgb(0.17, 0.17,0.18),
    });

    await fs.writeFileSync(path.join(process.cwd(), `factures-pdf/${id}.pdf`), await pdfDoc.save());
    await convertPDFToPNG(path.join(process.cwd(), `factures-pdf/${id}.pdf`), path.join(process.cwd(), `factures-image/`), `${id}`);
    return `${id}.png`;
}

export default createPdf;
