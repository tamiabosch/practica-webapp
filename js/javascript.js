
var counter = 1;

function addCruz(bloque) {
  var borra = document.createElement("div");
	borra.classList.add("borra");
	var node = document.createTextNode("\u2612");
	borra.appendChild(node);
	borra.addEventListener('click', borraPregunta);
  bloque.insertBefore(borra, bloque.firstChild);
  
}

function addPin(bloque){
  var pin = document.createElement("i");
  var fixed = false;
  pin.classList.add("fa");
  pin.classList.add("pin");
  pin.classList.add("fa-thumb-tack");
  pin.classList.add("notfixed")
  bloque.setAttribute('data-fijado', false);
  pin.addEventListener('click', function(){
    console.log(bloque);
    var cruz = bloque.querySelector('.borra');
    var x = bloque["data-fijado"];
    console.log(x);
    if(pin.classList.contains('notfixed')) {
      pin.classList.remove("notfixed");
      pin.classList.remove("fixed");
      pin.classList.add("fixed");
      cruz.classList.add("hide");
      bloque["data-fijado"] = true;
      console.log("test fixed: "+ x);
      alert("You have pined this question");
    } else {
      pin.classList.remove("notfixed");
      pin.classList.remove("fixed");
      pin.classList.add("notfixed");
      cruz.classList.remove('hide');
      bloque["data-fijado"] = false;
      console.log("test not fixed: "+ x);
      alert("You have unfixed this question");
    }

    });

  bloque.insertBefore(pin, bloque.firstChild);
}


function fixPin() {
  //var form = queryAncestorSelector(this, ".formulario");
  //var section = queryAncestorSelector(form, "section");

  alert("You have pined this question");
}


function borraPregunta() {
	var bloque = queryAncestorSelector(this, ".bloque");
	var section = queryAncestorSelector(bloque, "section");
	bloque.remove();
	var sectionChilds = section.querySelector(".bloque");
	if (sectionChilds === null) {
    section.remove();
    document.querySelector("a[href='#" + section.id + "']").parentNode.remove();
  }
}

function queryAncestorSelector (node,selector) {
  var parent= node.parentNode;
  var all = document.querySelectorAll(selector);
  var found= false;
  while (parent !== document && !found) {
    for (var i = 0; i < all.length && !found; i++) {
      found= (all[i] === parent)?true:false;
    }
    parent= (!found)?parent.parentNode:parent;
  }
  return (found)?parent:null;
}

function init() {
	document.querySelectorAll('.bloque').forEach(function(bloque) {
    addCruz(bloque);
  });
  document.querySelectorAll('section').forEach(function(section) {
    addFormPregunta(section, section.id);
  });
  var formular = document.getElementById("nuevoCuestionario");
  formular.querySelector("input[type='button']").addEventListener('click', addCuestionario);

  //var bool = false;
  document.querySelectorAll('.bloque').forEach(function(bloque) {
    addPin(bloque);
  });
}

window.onload = function(e){ 
  init();
}

/**
 * Einfügeformulare für Fragen hinzufügen

Im Gegensatz zum Formular zur Fragebogenerstellung wird für jeden Fragebogen dynamisch ein neues Formular zur Frageaddition angelegt. 
Sie erstellen nun eine Funktion addFormFormQuestion, um dies zu handhaben. 
Diese Funktion erhält als Parameter den Knoten, der dem Abschnittselement eines bestimmten Fragebogens entspricht, 
erstellt dynamisch ein Formular wie das folgende und fügt es nach dem Titel des Fragebogens (vor der ersten Frage, falls vorhanden) ein:
 */

function addFormPregunta(parent, temaValue) {
  var formulario = document.createElement("div");
  formulario.classList.add("formulario");
  formulario.innerHTML = "<ul><li><label>Enunciado de la pregunta:</label><input type='text' name='" + parent.id + "_pregunta'></li><li><label>Respuesta:</label><input type='radio' name='" + parent.id + "_respuesta' value='verdadero' checked>Verdadero<input type='radio' name='" + parent.id + "_respuesta' value='falso'>Falso</li><li><input type='button' value='Añadir nueva pregunta'></li></ul>";
  parent.insertBefore(formulario, parent.querySelector(".bloque"));
  formulario.querySelector("input[type='button']").addEventListener('click', addPregunta);  
  //addWikipedia(temaValue, parent);
  //addFlickr(temaValue, parent);
}

function addPregunta() {
  var form = queryAncestorSelector(this, ".formulario");
  var section = queryAncestorSelector(form, "section");
  var textInput = form.querySelector("input[type='text']");
  var radioTrue = form.querySelector("input[value='verdadero']");
  var radioFalse = form.querySelector("input[value='falso']");
  if (textInput.value === "") {
    alert('Please enter a question.');
  } else if (!radioTrue.checked && !radioFalse.checked) {
    alert('Please enter if the answer is wrong or correct.');
  } else {
    var bloque = document.createElement("div");
    bloque.classList.add("bloque");
    var pregunta = document.createElement("div");
    pregunta.classList.add("pregunta");
    var respuesta = document.createElement("div");
    respuesta.classList.add("respuesta");
    pregunta.appendChild(document.createTextNode(textInput.value));
    if(radioTrue.checked){
      respuesta.setAttribute('data-valor', true);
    } else if(radioFalse.checked){
      respuesta.setAttribute('data-valor', false);
    }
    bloque.appendChild(pregunta);
    bloque.appendChild(respuesta);
    addCruz(bloque);
    addPin(bloque);
    section.insertBefore(bloque, section.querySelector(".bloque"));
    textInput.value = "";
    radioTrue.checked = true;
    radioFalse.checked = false;
  }
}

function addCuestionario() {
  var form = queryAncestorSelector(this, "#nuevoCuestionario");
  var temaInput = form.querySelector("input[type='text']");
  if (temaInput.value === "") {
    alert('Please enter a Tema.');
  } else {
    var section = document.createElement("section");
    section.setAttribute("id", 'c'+counter);
    /*var headline = document.createElement("h2");
    headline.appendChild(document.createTextNode("Cuestionario sobre "+temaInput.value))
    section.appendChild(headline);*/
    document.querySelector("main").appendChild(section);
    var cabeza = document.createElement("encabezado-cuestionario");
    cabeza.setAttribute("tema", temaInput.value);
    section.appendChild(cabeza);

    var index = document.querySelector("nav");
    var newIndexElement = document.createElement("li");
    newIndexElement.innerHTML = "<a href='#c"+counter+"'>"+temaInput.value+"</a>";
    index.querySelector("ul").appendChild(newIndexElement);

    addFormPregunta(section, temaInput.value);
    temaInput.value = "";
    counter++;
    
  }
}

