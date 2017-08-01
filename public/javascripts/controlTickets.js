//cuando jqueryMobile se ha cargado
$('#horarios').on('pagecreate', horarios_onLoad);
$('#lista_horarios').on('click','a', lista_horarios_onClick);
//funciones de inicio


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
