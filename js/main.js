   

var timer;
var lineas;
var ultLineaMostrada=0;
var totalDeLineas=0;

let voces;
let listaVocesCargada = false; 
let sintetizador = window.speechSynthesis;
let vozElegida = "Google US English";
document.getElementById('file-input').addEventListener('change', leerArchivo, false);

 function getVozElegida() {
   
    return voces.find(function(voz){
        return voz.name == vozElegida;
    });
};
function vocesCargadas() {
    if (!listaVocesCargada) {
        voces = sintetizador.getVoices();
        if (voces.length > 0) {
            voces.forEach( v => {
                let optVoz = document.createElement('option');
                optVoz.textContent = `${v.name} - ${v.lang}`;
                if (v.default) optVoz.selected = true;
                optVoz.setAttribute('data-voz', v.name);
            });
            listaVocesCargada = true;
        }
    }
}

function hablar(txt) {
    if (!sintetizador) {
        return; //No soportado 
    }
    
    if (sintetizador.speaking) {
        sintetizador.cancel();
    }
    else {
        if (txt) {
            vocesCargadas();
            let declaracion = new SpeechSynthesisUtterance(txt);
            declaracion.voice =getVozElegida() ;
            declaracion.lang = declaracion.voice.lang;  //Necesario en móviles
            declaracion.rate = 0.7; //Velocidad
            declaracion.pitch = 1;

            sintetizador.speak(declaracion);
        }
    }
}

function notificacion(ingles, español) {
if (Notification) 
{
    vozElegida = "Google US English";
    hablar(ingles);

    vozElegida = "Microsoft Laura - Spanish (Spain)";
    setTimeout( function() { hablar(español) }, 1000)

    if (Notification.permission !== "granted") 
    {
        Notification.requestPermission()
    }

    var options = {
        body: español,
        silent: true
    }
    var noti = new Notification( ingles, options)
    noti.onclick = function () {
        traduccion(ingles);
    };

    noti.onclose = {
    // Al cerrar
    }
    setTimeout( function() { noti.close() }, 30000)
    }
}

function generarNotificaciones()
{
    var lineaActual=0;
    for(var linea of lineas) {
    if(ultLineaMostrada === totalDeLineas)
    {
        ultLineaMostrada =0;   
    }
        lineaActual = lineaActual +1;
        if(lineaActual >ultLineaMostrada)
        {
            ultLineaMostrada = ultLineaMostrada + 1;
            var palabra = linea.split("|");
            notificacion(palabra[0], palabra[1]);
            break;
        }
    }

}

function traduccion(palabra)
{
    var url = 'https://translate.google.com.ar/?hl=es&sl=en&tl=es&text=' + palabra +'&op=translate';
    window.open(url, "nombre de la ventana", "width=700, height=600");
}

function start()
{
    const intervalo = Number.parseInt(document.getElementById('interval').value); 
    
    if(Number.isInteger(intervalo))
    {
        timer = setInterval('generarNotificaciones()',intervalo * 60000);
    }
    else
    {
        alert("Por favor ingresar numero entero");
    }
}

function stop()
{
    clearInterval(timer);
}

function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }

  var lector = new FileReader();
  lector.onload = function(e) {
      var contenido = e.target.result;
      mostrarContenido(contenido);
      totalDeLineas = contenido.split("\r").length;
    };
    lector.readAsText(archivo);
}

function mostrarContenido(contenido) {
    lineas = contenido.split('\n');
    var ing = document.getElementById('contenido-archivo-in');
    var esp = document.getElementById('contenido-archivo-es');
    var palabrasIng="";
    var palabraEsp="";

  for(var linea of lineas) {
      if(linea != "")
      {
          var palabra = linea.split("|");
          palabrasIng =palabrasIng + palabra[0].trim() + "\r";
          palabraEsp = palabraEsp + palabra[1].trim() + "\r";
      }
    }

  ing.innerHTML = palabrasIng;
  esp.innerHTML = palabraEsp;
}