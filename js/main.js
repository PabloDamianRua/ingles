var timer;
var lineas;
var ultLineaMostrada=0;
var ultLineaLeida=0;
var totalDeLineas=0;
let voces;
let voiceListLoaded = false; 
var leyendo = false; 
var puedoLeerSiguienteLinea = true;
var textoLectura ="";
var repeticiones =0;
var timerLectura;
var timerWords;
var word1;
var word2;

document.getElementById('file-input').addEventListener('change', leerArchivo, false);

 function getvoiceChoosed(voiceChoosed) {
   
    return voces.find(function(voz){
        return voz.name == voiceChoosed;
    });
};
function voiceChoosed() {
    if (!voiceListLoaded) {
        var sintetizador = window.speechSynthesis;
        voces = sintetizador.getVoices();
        if (voces.length > 0) {
            voces.forEach( v => {
                let optVoz = document.createElement('option');
                optVoz.textContent = `${v.name} - ${v.lang}`;
                if (v.default) optVoz.selected = true;
                optVoz.setAttribute('data-voz', v.name);
            });
            voiceListLoaded = true;
        }
    }
}

function speakInEnglish(txt) {
    var sintetizador = window.speechSynthesis;
    
    if (!sintetizador) {
        return; //No soportado 
    }

    if (sintetizador.speaking) {
        sintetizador.cancel();
    }
    
    if (txt) {
        voiceChoosed();
        let declaracion = new SpeechSynthesisUtterance(txt);
        declaracion.voice =getvoiceChoosed("Google US English") ;
        declaracion.rate = 0.7; //Speed
        declaracion.pitch = 1;
        leyendo = true;
        sintetizador.speak(declaracion);
        waitForTheEndOfTheReading(sintetizador);
    }
}

function speakInSpanish(txt) {
    var sintetizador = window.speechSynthesis;
  
    if (!sintetizador) {
        return; //No soportado 
    }

    if (sintetizador.speaking) {
        sintetizador.cancel();
    }
    
    if (txt) {
        voiceChoosed();
        let declaracion = new SpeechSynthesisUtterance(txt);
        declaracion.voice =getvoiceChoosed("Microsoft Laura - Spanish (Spain)") ;
        declaracion.rate = 0.7; //Speed
        declaracion.pitch = 1;
        leyendo = true;
        sintetizador.speak(declaracion);
        waitForTheEndOfTheReading(sintetizador);
    }
}

function notificacion(ingles, español) {
if (Notification) 
{
    speakInEnglish(ingles);

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
        traduction(ingles);
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

function traduction(word)
{
    debugger;
    var url = document.getElementById("translator").value.replace("@WordToTraslate", word) ; 
    window.open(url, "nombre de la ventana", "width=700, height=600");
}

function start()
{
    if(totalDeLineas> 0)
    {
        const intervaloSeg = Number.parseInt(document.getElementById('intervalSeg').value); 
        const intervaloMin = Number.parseInt(document.getElementById('intervalMin').value); 
        
        if(Number.isInteger(intervaloSeg) && Number.isInteger(intervaloMin))
        {
            if(intervaloMin > 0)
            {
                intervaloSeg = intervaloMin * 60 + intervaloSeg;
            }
            timer = setInterval('generarNotificaciones()', intervaloSeg * 1000);
        }
        else
        {
            alert("Por favor ingresar numero entero");
        }
    }
    else
    {
        alert("You didn't select a file of words. Please, need to select a file words.")
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

function startReading()
{
    if(totalDeLineas> 0)
    {
        timerWords = setInterval('getReadingWords()', 2000);
        timerLectura = setInterval('read()', 3000);
    }
    else
    {
        alert("You didn't select a file of words. Please, need to select a file words.")
    }
}

function stoptReading()
{
    clearInterval(timerWords);
    clearInterval(timerLectura);
}

function getReadingWords()
{
    var textoLecturaActual = document.getElementById('lecto');
    if(puedoLeerSiguienteLinea == true)
    {
        var lineaActual=0;
        for(var linea of lineas) {
            if(ultLineaLeida === totalDeLineas)
            {
                ultLineaLeida =0;   
            }
            lineaActual = lineaActual +1;
            if(lineaActual > ultLineaLeida)
            {
                repeticiones = repeticiones + 1;
                if(repeticiones < 3)
                {
                    ultLineaLeida = ultLineaLeida - 1;
                }
                else
                {
                    repeticiones=0;
                }

                ultLineaLeida = ultLineaLeida + 1;
                var palabra = linea.split("|");
                word1 = palabra[0];
                word2 = palabra[1];
                textoLecturaActual.innerHTML =  "<p>"+ word1 + " - " + word2 + "</p>";
                wait(1000);
                break;
            }
        }
    }
}
function read()
{
    puedoLeerSiguienteLinea = false;
    speakInEnglish(word1);
    wait(2000);
    speakInSpanish(word2);
    wait(2000);
    puedoLeerSiguienteLinea = true;
}

function wait(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }
  function  waitForTheEndOfTheReading(sintetizador)
  {
      var start = new Date().getTime();

      while(new Date().getTime() < start + 50000)
      {
          if(sintetizador.pending == false)
          {
              leyendo = false;
              break;
          }
      };
  }

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}