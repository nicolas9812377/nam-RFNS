const pdf = require('html-pdf');
const pool = require('../config/bd_config');
const express = require('express');
const generarPDF = async(req, res) => {

    let name_reporte = req.body.name_reporte;
    let content = `
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <title>Reporte</title>
        <style>
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
          }
          
          a {
            color: #5D6975;
            text-decoration: underline;
          }
          
          body {
            position: relative;
            width: 100%;  
            height: 100%; 
            margin: 0 auto; 
            color: #001028;
            background: #FFFFFF; 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            font-family: Arial;
          }
          
          header {
            padding: 10px 0;
            margin-bottom: 30px;
          }
          
          #logo {
            text-align: center;
            margin-bottom: 10px;
          }
          
          #logo img {
            width: 90px;
          }
          
          h1 {
            border-top: 1px solid  #5D6975;
            border-bottom: 1px solid  #5D6975;
            color: #5D6975;
            font-size: 2.4em;
            line-height: 1.4em;
            font-weight: normal;
            text-align: center;
            margin: 0 0 20px 0;
            background: url(dimension.png);
          }
          
          #project {
            float: left;
          }
          
          #project span {
            color: #5D6975;
            text-align: right;
            width: 52px;
            margin-right: 10px;
            display: inline-block;
            font-size: 0.8em;
          }
          
          #company {
            float: right;
            text-align: right;
          }
          
          #project div,
          #company div {
            white-space: nowrap;        
          }
          
          table {
            width: 90%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 20px;
            margin-left: auto;
            margin-right: auto;
          }
          
          table tr:nth-child(2n-1) td {
            background: #F5F5F5;
          }
          
          table th,
          table td {
            text-align: center;
          }
          
          table th {
            padding: 5px 10px;
            color: #5D6975;
            border-bottom: 1px solid #C1CED9;
            white-space: nowrap;        
            font-weight: normal;
            font-size: 12pt;
          }
          
          table .service,
          table .desc {
            text-align: left;
          }
          
          table td {
            padding: 10px;
            text-align: center;
          }
          
          table td.service,
          table td.desc {
            vertical-align: top;
          }
          
          table td.unit,
          table td.qty,
          table td.total {
            font-size: 10pt;
            text-align: right !important;
          }
          
          table td.grand {
            border-top: 1px solid #5D6975;;
          }
          
          #notices .notice {
            color: #5D6975;
            font-size: 10pt;
          }
          
          footer {
            color: #5D6975;
            width: 100%;
            height: 30px;
            position: absolute;
            bottom: 0;
            border-top: 1px solid #C1CED9;
            padding: 8px 0;
            text-align: center;
          }
          </style>
    </head>
    
    <body>
        <header class="clearfix">
            <div id="logo">
                <img src="https://i.ibb.co/yS7X9sM/logoNAM.jpg">
            </div>
            <h1>Reporte ${name_reporte}</h1>
            <div id="company" class="clearfix" style="margin-right:35px;">
                <div>CONJUNTO RESIDENCIAL</div>
                <div>"BOSQUES DE QUITUMBE IV",<br /> AV. LIRA ÑAN Y CONDOR ÑAN</div>
                <div>(602) 519-0450</div>
            </div>
            <div id="project" style="margin-left:5px;">
                <div><span>PROJECT</span> Reconocimiento Facial NAM</div>
            </div>
        </header>
    <main>
        <table>
            <thead>
            `;



    if (name_reporte === 'Alicuotas') {
        let where = '';
        if (req.body.numcasa !== 'all') {
            where += ` and num_vivienda='${req.body.numcasa}'`;
        }
        if (req.body.estado !== 'all') {
            where += ` and estado='${req.body.estado}'`;
        }
        const resp = await pool.queryG(`cobros, persona where persona.id_persona = cobros.id_persona ${where}`);
        content += `
        <tr>
            <th> # </th> 
            <th> # VIVIENDA </th>
            <th> PERSONA </th> 
            <th> MONTO </th>
            <th> FECHA </th>
            <th> MES PAGO </th>
            <th> AÑO PAGO </th>
            <th> ESTADO </th>
        </tr>
        </thead> 
        <tbody>
        `;
        let acum = 0
        resp.forEach(element => {
            acum += Number(element.cant_pago);
            let fecha = element.fecha_pago.toISOString().substring(0, 10);
            content += `<tr><td class="unit"> ${element.id_cobro}</td><td class="unit"> ${element.num_vivienda}</td> <td class="unit"> ${element.nombres_persona} ${element.apellidos_persona} </td> <td class="unit">$${element.cant_pago} </td> <td class="unit"> ${fecha} </td> <td class="unit"> ${element.mes_pago} </td> <td class="unit"> ${element.anio_pago} </td> <td class="unit"> ${element.estado} </td>  </tr> `;

        });
        content += `        
        <tr>
        <td colspan="7" class="grand total"> TOTAL </td> 
        <td class="grand total"> $${acum} </td> 
        </tr>`;
    } else if (name_reporte === 'Habitantes') {
        let where = '';
        if (req.body.numcasa !== 'all') {
            where += ` and habitante_vivienda.num_vivienda='${req.body.numcasa}' `;
        }
        if (req.body.estado !== 'all') {
            where += ` and estado_acceso.id_estado_acceso=${req.body.estado} `;
        }
        if (req.body.estadov !== 'all') {
            where += ` and vivienda.estado_habitante_vivienda='${req.body.estadov}' `;
        }
        const { rows } = await pool.pool.query(`select habitante_vivienda.num_vivienda, persona.cedula_persona, persona.nombres_persona, persona.apellidos_persona,estado_acceso.descr_estado_acceso,persona.entrada,persona.fecha_salida,vivienda.estado_habitante_vivienda from habitante_vivienda, persona,estado_acceso,vivienda where habitante_vivienda.id_persona = persona.id_persona and estado_acceso.id_estado_acceso = habitante_vivienda.id_estado_acceso and habitante_vivienda.num_vivienda = vivienda.num_vivienda ${where} group by habitante_vivienda.num_vivienda, persona.cedula_persona, persona.nombres_persona, persona.apellidos_persona,estado_acceso.descr_estado_acceso,persona.entrada,persona.fecha_salida,vivienda.estado_habitante_vivienda`);
        content += `
        <tr>
            <th> # VIVIENDA </th>
            <th> CEDULA </th>
            <th> PERSONA </th>
            <th> F. ENTRADA </th>
            <th> F. SALIDA </th>
            <th> E. PERSONA </th>
            <th> E. VIVIENDA </th>
        </tr>
        </thead> 
        <tbody>
        `;
        rows.forEach(element => {
            let fechaentra = element.entrada.toISOString().substring(0, 10);
            let fechasalida = element.entrada.toISOString().substring(0, 10);
            content += `<tr><td class="unit"> ${element.num_vivienda}</td><td class="unit"> ${element.cedula_persona}</td> <td class="unit"> ${element.nombres_persona} ${element.apellidos_persona} </td> <td class="unit">${fechaentra} </td> <td class="unit"> ${fechasalida} </td> <td class="unit"> ${element.descr_estado_acceso} </td><td class="unit"> ${element.estado_habitante_vivienda} </td>  </tr> `;

        });
    }


    content += ` 
        </tbody> 
        </table>
        </main> 
        <footer>
        Reporte Generado 
        </footer> 
        </body>
        </html>`;

    await pdf.create(content, [{ "format": "A4", "orientation": "portrait", "border": "0" }]).toFile('./reports/reporte.pdf', function(err, resp) {
        if (err) {
            console.log(err);
        } else {
            //console.log(resp);
            return res.download('./reports/reporte.pdf');
        }
    });


}

module.exports = { generarPDF }