const pdf = require('html-pdf');

const generarPDF = async(req, res) => {
    const content = `<h1>Título en el PDF creado con el paquete html-pdf</h1><p>Generando un PDF con un HTML sencillo</p>`;

    await pdf.create(content).toFile('./reports/reporte.pdf', function(err, res) {
        if (err) {
            console.log(err);
        }
    });
    return res.download('./reports/reporte.pdf');

}
module.exports = { generarPDF }