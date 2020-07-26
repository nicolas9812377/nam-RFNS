function tablaAA() {
    $('#example').DataTable({
        "aLengthMenu": [
            [10, 15],
            [10, 15]
        ],
        "iDisplayLength": 5,
        "sAjaxSource": "/getAdmin",
        "sAjaxDataProp": "data",
        "aoColumns": [
            { "mData": "id_administrador" },
            { "mData": "cedula_administrador" },
            { "mData": "nombre_administrador" },
            { "mData": "apellido_administrador" },
            { "mData": "username_administrador" },
            { "mRender": () => { return `<i class="fa fa-pencil-square-o fa-2x" id="editar" ></i>`; } }
        ]
    });
    $('#example tbody ').on('click', '#editar', function() {
        var valores = [];
        $(this).parents('tr').find('td').each(function() {
            valores.push($(this).html());
        });
        $('#id').val(valores[0]);
        $('#cedula').val(valores[1]);
        $('#nombre').val(valores[2]);
        $('#apellido').val(valores[3]);
        $('#username').val(valores[4]);
        $('#boton').attr("disabled", false);
        $('#id').attr("disabled", false);
        $('#id').attr('readonly', 'readonly');
        $('#cedula').attr("disabled", false);
        $('#nombre').attr("disabled", false);
        $('#apellido').attr("disabled", false);
        $('#username').attr("disabled", false);
        window.location.href = "#main";
    });
}

function tablaRA() {
    $('#example').DataTable({
        "aLengthMenu": [
            [10, 15],
            [10, 15]
        ],
        "iDisplayLength": 5,
        "sAjaxSource": "/getRAdmin",
        "sAjaxDataProp": "data",
        "aoColumns": [
            { "mData": "id_administrador" },
            { "mData": "cedula_administrador" },
            { "mData": "nombre_administrador" },
            { "mData": "apellido_administrador" },
            { "mData": "fecha_comienzo" },
            { "mData": "fecha_terminado" },
            { "mData": "username_administrador" },
            { "mData": "descr_estado_administrador" }
            //{ "mRender": () => { return `<i class="fa fa-pencil-square-o fa-2x" id="editar" ></i>`; } }
        ]
    });
}
//tabla registro pagos
function tablaRP() {
    $('#example').DataTable({
        "aLengthMenu": [
            [10, 15],
            [10, 15]
        ],
        "iDisplayLength": 5,
        "sAjaxSource": "/getP",
        "sAjaxDataProp": "data",
        "aoColumns": [
            { "mData": "id_cobro" },
            { "mData": "num_vivienda" },
            { "mData": "nombres_persona" },
            { "mData": "apellidos_persona" },
            { "mData": "cant_pago" },
            { "mData": "fecha_pago" },
            { "mData": "mes_pago" },
            { "mData": "anio_pago" },
            { "mData": "estado" }
        ],

    });
    getNV();
}

function tablaD() {
    $('#example').DataTable({
        "aLengthMenu": [
            [10, 15],
            [10, 15]
        ],
        "iDisplayLength": 5,
        "sAjaxSource": "/getD",
        "sAjaxDataProp": "data",
        "aoColumns": [
            { "mData": "num_vivienda" },
            { "mData": "descr_tipo_vivenda" },
            { "mData": "estado_habitante_vivienda" },
            { "mRender": () => { return `<i class="fa fa-pencil-square-o fa-2x" id="editar" ></i>`; } }
        ]
    });
    $('#example tbody ').on('click', '#editar', function() {
        var valores = [];
        $(this).parents('tr').find('td').each(function() {
            valores.push($(this).html());
        });
        console.log(valores);
        $('#id').val(valores[0]);
        $('#tipo').val(valores[1]);
        $('#estado').val(valores[2]);
        $('#boton').attr("disabled", false);
        $('#id').attr("disabled", false);
        $('#id').attr('readonly', 'readonly');
        $('#tipo').attr("disabled", false);
        $('#tipo').attr('readonly', 'readonly');
        $('#estado').attr("disabled", false);

        window.location.href = "#main";
    });
}

function getTipoP() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `tipo_persona` },
        type: 'GET',
        success: function(msg) {
            let resp = '';
            msg.data.forEach(element => {
                resp += `<option value="${element.id_tipo_persona}">${element.descr_tipo_persona}</option>`
            });
            $('#tipoper').append(resp);
        },
        error: function(err) { console.log(err); }
    });
    getNV();
};


function getNV() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `vivienda` },
        type: 'GET',
        success: function(msg) {
            let resp = '';
            msg.data.forEach(element => {
                resp += `<option value="${element.num_vivienda}">${element.num_vivienda}</option>`
            });
            $('#numcasa').append(resp);
        },
        error: function(err) { console.log(err); }
    });

};

function getPCed() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `persona` },
        type: 'GET',
        success: function(msg) {
            console.log(msg);
            let resp = '';
            msg.data.forEach(element => {
                resp += `<option value="${element.cedula_persona}">${element.cedula_persona}</option>`
            });
            $('#cedula').append(resp);

        },
        error: function(err) { console.log(err); }
    });
    getTipoP();
    getEA();
};
//obtener persona encargada
function getPE() {
    $.ajax({
        url: '/getEstado',
        data: { estado: `habitante_vivienda, persona where habitante_vivienda.id_persona = persona.id_persona and num_vivienda = '${$('#numcasa').val()}' ` },
        type: 'POST',
        success: function(msg) {
            let resp = '<option value="#"  selected disabled>--Selecione Opcion--</option>';
            msg.forEach(element => {
                resp += `<option value="${element.id_persona}">${element.nombres_persona} ${element.apellidos_persona}</option>`
            });
            $('#perenc').html(resp);
            $('#perenc').attr("disabled", false);
            $('#mes').attr("disabled", false);
            $('#anio').attr("disabled", false);
            $('#monto').attr("disabled", false);
            $('#estado').attr("disabled", false);
            $('#boton').attr("disabled", false);
        },
        error: function(err) { console.log(err); }
    });
}

function getPId() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `persona,habitante_vivienda,estado_acceso where persona.id_persona = habitante_vivienda.id_persona and habitante_vivienda.id_estado_acceso = estado_acceso.id_estado_acceso and  cedula_persona = '${$('#cedula').val()}'` },
        type: 'GET',
        success: function(msg) {
            console.log(msg.data[0]);
            $('#nombre').val(msg.data[0].nombres_persona);
            $('#apellido').val(msg.data[0].apellidos_persona);
            $('#edad').val(msg.data[0].edad_persona);
            $('#tipoper').val(msg.data[0].id_tipo_persona);
            $('#numcasa').val(msg.data[0].num_vivienda);
            $('#estado').val(msg.data[0].id_estado_acceso);
            $('#fechaen').val(msg.data[0].entrada.toString().slice(0, 10));
            if (msg.data[0].fecha_salida !== null) { $('#fechater').val(msg.data[0].fecha_salida.toString().slice(0, 10)); }
            $('#cedula').attr('readonly', 'readonly');

            $('#nombre').attr("disabled", false);
            $('#apellido').attr("disabled", false);
            $('#edad').attr("disabled", false);
            $('#tipoper').attr("disabled", false);
            $('#numcasa').attr("disabled", false);
            $('#fechaen').attr("disabled", false);
            $('#fechater').attr("disabled", false);
            $('#estado').attr("disabled", false);
            $('#boton').attr("disabled", false);
            $('#btn-signup').attr("disabled", false);
        },
        error: function(err) { console.log(err); }
    });
};

function getEA() {
    $.ajax({
        url: '/getEstado',
        data: { estado: 'estado_acceso' },
        type: 'POST',
        success: function(msg) {
            let resp = '';
            msg.forEach(element => {
                resp += `<option value="${element.id_estado_acceso}">${element.descr_estado_acceso}</option>`
            });
            $('#estado').append(resp);
        },
        error: function(err) { console.log(err); }
    });
};

function getAdminById() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `administrador where id_administrador = '${$('#cedula').val()}'` },
        type: 'GET',
        success: function(msg) {
            console.log(msg.data[0]);
            $('#nombre').val(msg.data[0].nombre_administrador);
            $('#apellido').val(msg.data[0].apellido_administrador);
            $('#nombre').attr("disabled", false);
            $('#nombre').attr('readonly', 'readonly');
            $('#apellido').attr("disabled", false);
            $('#apellido').attr('readonly', 'readonly');
            $('#fechacom').attr("disabled", false);
            $('#fechater').attr("disabled", false);
            $('#estadoA').attr("disabled", false);
        },
        error: function(err) { console.log(err); }
    });
};

function getACed() {
    $.ajax({
        url: '/getAdmin',
        type: 'GET',
        success: function(msg) {
            let resp = '';
            msg.data.forEach(element => {
                resp += `<option value="${element.id_administrador}">${element.cedula_administrador}</option>`
            });
            $('#cedula').append(resp);
        },
        error: function(err) { console.log(err); }
    });
    getEstadoA();
    tablaRA();
};

function getEstadoA() {
    $.ajax({
        url: '/getEstado',
        data: { estado: 'estado_administrador' },
        type: 'POST',
        success: function(msg) {
            let resp = '';
            msg.forEach(element => {
                resp += `<option value="${element.id_estado_administrador}">${element.descr_estado_administrador}</option>`
            });
            $('#estadoA').append(resp);
        },
        error: function(err) { console.log(err); }
    });
};

function checkAll(bx) {
    var cbs = document.getElementsByTagName('input');
    for (var i = 0; i < cbs.length; i++) {
        if (cbs[i].type == 'checkbox') {
            cbs[i].checked = bx.checked;
        }
    }
};
let video = document.getElementById('video');
let contimg = 0;
let vector = [];

function takepicture() {
    contimg++;
    if (contimg > 1) {
        alert('1 Imagen Maximo')
        offcam();
        return;
    }
    video.pause();
    $('#carrusel').append(`<td><canvas id="img${contimg}" width="130" height="90">Imagen</canvas></td>`);
    var canvas = document.getElementById(`img${contimg}`)
    canvas.getContext('2d').drawImage(video, 0, 0, 130, 90);
    vector.push(canvas.toDataURL());
    video.play();
}

function powercam() {

    $('#boton1').attr('disabled', false);
    $('#boton').attr('disabled', true);
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    }).catch((err) => console.log(err));

}

function offcam() {
    $('#arregloFotos').val(vector);
    $('#boton1').attr('disabled', true);
    $('#boton').attr('disabled', false);
    $('#btn-signup').attr('disabled', false);
    video.pause();
    video.srcObject = null;
}

$(document).ready(function() {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function() {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function() {
        $('#wrapper').toggleClass('toggled');
    });
});