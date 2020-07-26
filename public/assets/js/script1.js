function generarP() {
    var cantidad = $('#cantp').val();
    var casa = $('#numcasa').val();
    var tipoper = $('#tipoper').val();
    var fechaen = $('#fechaen').val();
    if (cantidad.length <= 0 || casa === null || tipoper.length <= 0 || fechaen.length <= 0) {
        alert('Campos Requerido');
        return;
    }
    let respuesta = '';

    for (let i = 0; i < cantidad; i++) {
        respuesta += `<div class="row"> 
        <div class="panel panel-info" style="width: 73%; height: 175px;">
                        <div class="panel-heading">
                            <div class="panel-title">Datos Personales ${i+1}</div>
                        </div>  

                        <div class="panel-body" >
                                <div class="form-group">
                                    <label for="cedula" class="col-md-1 control-label">Cedula</label>
                                    <div class="col-md-3">
                                        <input type="text" class="form-control" name="cedula" id="cedula" placeholder="Cedula">
                                    </div>
                                    <label for="firstname" class="col-md-1 control-label">Nombre</label>
                                    <div class="col-md-3">
                                        <input type="text" class="form-control" name="firstname" placeholder="Nombre" required>
                                    </div>
                                    <label for="lastname" class="col-md-1 control-label">Apellido</label>
                                    <div class="col-md-3">
                                        <input type="text" class="form-control" name="lastname" placeholder="Apellido" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="edad" class="col-md-1 control-label">Edad</label>
                                    <div class="col-md-3">
                                        <input type="number" class="form-control" name="edad" placeholder="Edad" required>
                                    </div>
                                </div>                 
                        </div>
        </div>   
        <div id="contF${i+1}" style="font-size: 16pt;box-sizing: border-box;display: inline-block; margin-left: 10px; text-align: center; margin-top: -10px; margin-bottom: 70px; width: 25%;" >
            <div>
                <label> Captura de Imagen <i class="fa fa-camera"></i></label>
            </div>
            <div id="contFT" style="border: 1px solid black; background-color: #e0e0e0;">
                <video src="" id="video${i+1}" width="350" height="150" style="margin-top: 1px;margin-bottom: -5px;margin-left:-60px"></video>
            </div>
            <button id="boton${i+1}" type="button" class="btn btn-primary" onclick="powercamR(${i+1})" style="margin-top: 5px;"><i class="icon-hand-right"  ></i> &nbsp Prender Camara</button> 
            <button id="boton1${i+1}" type="button" class="btn btn-success" onclick="takepictureR(${i+1})" style="margin-top: 5px;" disabled><i class="icon-hand-right"  ></i> &nbsp Capturar</button> 
        </div> 
</div>`;
    }
    respuesta += `<div class="row" style="margin-bottom: 5%;">
    <div class="col-md-offset-4">
    <button id="btn-register" type="submit" class="btn btn-success" disabled><i class="icon-hand-right"></i> &nbsp Registrarse</button> 
    </div>
    </div>`;
    $('#contendorinfo').html(respuesta);
}

function takepictureR(i) {
    let video = document.getElementById(`video${i}`);
    video.pause();
    $(`#contF${i} #contFT`).html(`<canvas id="img${i}" width="230" height="140">Imagen</canvas>`);
    var canvas = document.getElementById(`img${i}`);
    canvas.getContext('2d').drawImage(video, 0, 0, 220, 140);

    $(`#boton1${i}`).attr('disabled', true);
    $(`#boton${i}`).attr('disabled', false);
    saveF(i);
}

function powercamR(i) {
    $(`#boton1${i}`).attr('disabled', false);
    $(`#boton${i}`).attr('disabled', true);
    $(`#contF${i} #contFT`).html(`<video src="" id="video${i}" width="350" height="150" style="margin-top: 1px;margin-bottom: -5px;margin-left:-60px"></video>`);
    let video = document.getElementById(`video${i}`);
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    }).catch((err) => console.log(err));

}

function saveF(g) {
    let vector = [];
    var cantidad = $('#cantp').val();

    if (g == cantidad) {
        try {
            for (let i = 0; i < cantidad; i++) {
                var canvas = document.getElementById(`img${i+1}`);
                vector.push(canvas.toDataURL());
            }
            $('#arregloFotos').val(vector);
            $('#btn-register').attr('disabled', false);
        } catch (error) {
            alert('Completar fotos');
        }
    }
}

function getTipoPs() {
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
    getNVD();
};

function getNVD() {
    $.ajax({
        url: '/getAdminByID',
        data: { estado: `vivienda where estado_habitante_vivienda = 'Disponible'` },
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
}