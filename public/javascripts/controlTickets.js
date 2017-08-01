var btnloginBinded = false,
    btnRegisterBinded = false;


//cuando jqueryMobile se ha cargado
$('#horarios').on('pagecreate', horarios_onLoad);
$('#lista_horarios').on('click','a', lista_horarios_onClick);

//funciones de inicio
$(document).on("mobileinit", function(e){
    $.mobile.loader.prototype.options.text = "Please Wait";
    $.mobile.loader.prototype.options.textVisible = true;

    $.ajaxSetup({
        xhrFields:{
            withCredentials:true
        }
    });
});

$(document).ajaxError(function(e, xhr, set, err){
    if(xhr.status===403){
        change_page("login");
    }
});


$(document).on("pagecontainerbeforeshow", function(e, ui) {
    var pageid = ui.toPage.attr("id");
    switch (pageid) {
        case "login":
            if(!btnloginBinded){
                btnloginBinded = true;
                $("#btnLgnIn").on("click", btnLgnIn_onclick);
            }
            break;
        case "register":
            if(!btnRegisterBinded){
                btnRegisterBinded = true;
                $("#btnRegLgn").on("click", btnRegLgn_onclick);
            }
            break;
    }
});

//handlers
var _currentHorario = "";
function horarios_onLoad(e){
  console.log("hola");
  obtenerHorarios(
    function(err, horarios){
      if (err) {
        return console.log("Error al cargar horarios");
      }
      console.log("hola");
      var htmlstr = horarios.map(
        function(horario, i){
          return '<li><a href="#detalle_horario" data-id="'+horario._id+'"><h4>'+horario.tanda+'</h4><p>Cupos disponibles: 15</p></a></li>';
        }
      ).join("");

      $("#lista_horarios").html(htmlstr).listview("refresh");
    }
  );
}//end horarios_onLoad

function lista_horarios_onClick(e){
  e.preventDefault();
  e.stopPropagation();
  var sender = $(this);
  _currentHorario = sender.data("id");
  console.log(_currentHorario);
}//horarios_onClick

//ajax
//configurar ajax
var settings = {
  "async": true,
  "crossDomain": true,
  "dataType":"json",
  "headers": {
    "cache-control": "no-cache"
  }
}

$.ajaxSetup(settings);

function obtenerHorarios(despues){
  $.ajax(
    {
      "url":"api/horarios",
      "method":"get",
      "data":{},
      "success": function(data, txtSucess, xhrq){
        despues(null, data);
      },
      "error": function(xhrq, errTxt, data){
        despues(true,null);
      }
    }
  );
}

function obtenerHorario(id, despues){
  $.ajax(
    {
      "url":"api/horarios",
      "method":"get",
      "data":{},
      "success": function(data, txtSucess, xhrq){
        despues(null, data);
      },
      "error": function(xhrq, errTxt, data){
        despues(true,null);
      }
    }
  );
}


function btnLgnIn_onclick(e){
    e.preventDefault();
    e.stopPropagation();
    var formValuesArray = $("#frm_login").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post("api/login",
        formObject,
        function(data,success,xhr){
            $("#frm_login").get()[0].reset();
            change_page("horarios");
        },
        "json"
    ).fail(function(xhr,fail,data){
        alert("Log In Failed! Try Again");
    });
}

function btnRegLgn_onclick(e){
    e.preventDefault();
    e.stopPropagation();
    var formValuesArray = $("#frm_register").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post("api/register",
        formObject,
        function(data,success,xhr){
            $("#frm_register").get()[0].reset();
            change_page("login");
        },
        "json"
    ).fail(function(xhr,fail,data){
        alert("Sign Up Failed! Try Again");
    });
}

// Funcion para cambiar de pagina
function change_page(to) {
    $(":mobile-pagecontainer").pagecontainer("change", "#" + to);
}

function showLoading(){
    $.mobile.loading( 'show');
}
function hideLoading(){
    $.mobile.loading( 'hide');
}
