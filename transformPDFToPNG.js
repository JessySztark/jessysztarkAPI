import pdf from "pdf-poppler";

function convertPDFToPNG(pdfPath, outputPath, id) {
    let option = {
        format: "png",
        out_dir: outputPath,
        out_prefix: id,
        page: null
    }
    pdf.convert(pdfPath, option)
    .then(() => {
            console.log("Successfully converted PDF to PNG");
        })
    .catch(error => {
            console.error("Error converting PDF to PNG:", error);
        });
}

export default convertPDFToPNG;