/* global fabric, $ */
// var c = document.getElementById('canvas');

$(document).ready(function () {
/*  var buttons = [];
  for (var object in canvasObjects) {
    var button = '<button onclick="addObject(\'' + object + '\')">' + object + '</button>';
    buttons.push(button);
  }
  $('#canvas-objects').append(buttons);
*/


});


//initialise all variables
var canvas = new fabric.Canvas('canvas');
var width = $('#board').width;

canvas.setWidth(1200);
canvas.setHeight(600);

canvas.imagesmoothing=false;
canvas.isDrawingMode= true;
canvas.renderOnAddRemove=false;
$("#drawing-color").spectrum("set", '#0000ff');

//$('#drawing-color').val('#468499');

$('#btn').on('click', function () {
    ('#btn').value='hello';//$("#draw-color").spectrum("get");
});

canvas.transparentcorners = false;
var index=0;
var mode="draw";
var pencilwidth=2;
var circle, isDown, origX, origY;
canvas.freeDrawingBrush.width = pencilwidth;


 canvas.freeDrawingBrush.color = '#0000ff';//


/*$('#draw-mode').on('click', function () {
  console.log(this);
  canvas.isDrawingMode = !canvas.isDrawingMode;
  if (canvas.isDrawingMode) { $(this).html('Draw Mode: On'); }
  if (!canvas.isDrawingMode) { $(this).html('Draw Mode: Off'); }
});*/

 //pen colour - working
/* $('#drawing-color').on('change', function() {
    canvas.freeDrawingBrush.color = $("#drawing-color").spectrum("get");

  });*/

/*working*/
$('#draw').on('click', function () {
  canvas.isDrawingMode = true;
  canvas.selection=true;
    canvas.freeDrawingBrush.strokeLineJoin = "round";
  canvas.freeDrawingBrush.strokeLineCap ="round";
  
  
  canvas.freeDrawingBrush.width = pencilwidth;
  canvas.freeDrawingBrush.opacity=1;
  canvas.freeDrawingBrush.color = $("#drawing-color").spectrum("get");
  mode="draw";});

/*working*/
$('#edit').on('click', function () {
  canvas.isDrawingMode = false;
  canvas.selection=true;
   canvas.freeDrawingBrush.strokeLineJoin = "round";
  canvas.freeDrawingBrush.strokeLineCap ="round";
  canvas.freeDrawingBrush.opacity=1;
  mode="edit";
    
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.forEachObject(function(o){ o.setCoords()});
    canvas.calcOffset();
});


/*working*/
$('#highlight').on('click', function () {
  canvas.isDrawingMode = true;
  canvas.selection=true;
  canvas.freeDrawingBrush.strokeLineJoin = "bevel";
  canvas.freeDrawingBrush.strokeLineCap ="square";
  canvas.freeDrawingBrush.width = 20;
  //var dcolour= $("#drawing-color").spectrum("get");
 
  canvas.freeDrawingBrush.color= 'rgba(255,255,0,0.65)';// dcolour;//

  mode="highlight";
 // canvas.freeDrawingBrush.color = $("#drawing-color").spectrum("get");
//changepalette();
});

$('#clear').on('click', function () {
  /*canvas.setWidth(1200);
canvas.setHeight(600);*/
//canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
  canvas.clear();
  //canvas.dispose();
  mode="drawing";
  canvas.isDrawingMode = true;
});


//working
$('#plus').on('click', function () {
  if (canvas.freeDrawingBrush.width <=20) {
    pencilwidth=pencilwidth+2;
    $('#size').html('Size ' + (pencilwidth)/2);}
 else{pencilwidth=20}
canvas.freeDrawingBrush.width = pencilwidth;
});


//working
$('#minus').on('click', function () {
  if (canvas.freeDrawingBrush.width >0) {
    pencilwidth=pencilwidth-2;
    $('#size').html('Size ' + (pencilwidth)/2);}
 else{pencilwidth=0}
canvas.freeDrawingBrush.width = pencilwidth;
});



$('#undo').on('click', function () {
/*  canvas.isDrawingMode = false;
   var canvas_objects = canvas._objects;
    if(canvas_objects.length !== 0){
     var last = canvas_objects[canvas_objects.length -1]; }
     
    //Get last object   
     canvas.remove(last);
     last--;

     */
     undo();});


/* mouse circle */
$('#circle').on('click', function () {
 /*canvas.add(
    new fabric.Circle({ top: 140, left: 230, radius: 105, fill: 'green' })
  );*/
canvas.calcOffset();
  canvas.isDrawingMode = false;
  canvas.selection=false;
  canvas.selectable=false;
mode="circle";
});

$('#rectangle').on('click', function () {
  canvas.isDrawingMode = false;
  canvas.selection=false;
  canvas.selectable=false;
  mode="rectan";
  // create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 100,
  height: 100
})

canvas.add(rect);

rect.animate('left', 500, {
  onChange: canvas.renderAll.bind(canvas),
  duration: 1000,
  easing: fabric.util.ease.easeOutBounce
});


//var path = new fabric.Path('M 0 0 L 0 0');
var path = new fabric.Path('M 0 0 L 200 0 L 0 200 z');
path.set({ left: 120, top: 120 });
canvas.add(path);
});

// "add" rectangle onto canvas


/* mouse line */
$('#line').on('click', function () {
  canvas.isDrawingMode = false;
  mode="line";
});


$('#redo').on('click', function () {
/*  canvas.isDrawingMode = false;
   var canvas_objects = canvas._objects;
    if(canvas_objects.length !== 0){
     var last = canvas_objects[canvas_objects.length -1]; }
     
    //Get last object   
     canvas.remove(last);
     last--;

     */
     redo();
});




canvas.on('mouse:down', function(o){
  isDown = true;

       var pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;
        if (mode=="edit") {return;}

          if (mode=="circle") {

              circle = new fabric.Circle({
                        left: pointer.x,
                        top: pointer.y,
                        radius: Math.sqrt((origX - pointer.x)*(origX - pointer.x)+(origY - pointer.y)*(origY - pointer.y) ),
                        strokeWidth: canvas.freeDrawingBrush.width,
                        stroke: 'red',//$('#drawing-color').val(),
                        fill: 'red',//$('#drawing-color').val(),
                        originX: 'center', originY: 'center',
                        hoverCursor: "pointer"
                      }); 
         canvas.selection = false;
      canvas.forEachObject(function(o) {
        o.selectable = false;
      });

        canvas.add(circle);
      };



      });



canvas.on('mouse:move', function(o){
  if (!isDown) return;
  if(!mode=="edit") return;
  var pointer = canvas.getPointer(o.e);
  
//circle draw
  if (mode=="circle"){circle.set({ radius: Math.sqrt((origX - pointer.x)*(origX - pointer.x)+(origY - pointer.y)*(origY - pointer.y) )});}

 

//line draw
  if (mode=="line"){line.set({ x2: pointer.x, y2: pointer.y });}


//rectangle draw
if (mode=="rectan"){
      if(origX>pointer.x){
        rect.set({ left: Math.abs(pointer.x) });
    }
    if(origY>pointer.y){
        rect.set({ top: Math.abs(pointer.y) });
    }
    
    rect.set({ width: Math.abs(origX - pointer.x) });
    rect.set({ height: Math.abs(origY - pointer.y) });
     
}

});

canvas.on('mouse:up', function(o){
 
  isDown = false;
  //canvas.setActiveObject(last);
  //canvas.getActiveObject();
  canvas.renderAll();});




$("#drawing-color").spectrum({
    color: 'blue',
    showPaletteOnly: true,
    showPalette:true,
    togglePaletteMoreText: 'more',
    togglePaletteLessText: 'less',
    hideAfterPaletteSelect:true,
    change: function(color) {canvas.freeDrawingBrush.color = color;},

    
    palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ]
});


function changepalette(){

$("#drawing-color").spectrum({
    showPaletteOnly: true,
    showPalette:true,
    hideAfterPaletteSelect:true,

    color: 'blue',
    palette: [
        ['black', 'white', 'red', 'orange', 'yellow',
        'green', 'blue', 'indigo', 'violet', 'rgba(0,255,0,0.75)']
    ]
});

 /* if (mode=="highlight") {
            var op=0.65;
            $("#drawing-color").spectrum({
                showPaletteOnly: true,
                showPalette:true,
                hideAfterPaletteSelect:true,

                color: 'blue',
                palette: [
                    ['black', 'white', 'red', 'orange', 'yellow',
                      'rgba(0,128,0,0.65)',//'green', 
                      'rgba(0,0,255,0.65)', 
                      'rgba(75,0,130,0.65)',//'indigo', 
                      'rgba(238,130,238,0.65)',//'violet', 
                      'rgba(255,255,0,0.65)']
                ];
            });
          }
            else { 
              /*$("#drawing-color").spectrum({
                color: 'blue',
                palette: [
                            ['black', 'white', 'red', 'orange', 'yellow',
                            'green', 'blue', 'indigo', 'violet', 'rgba(255,255,0,0.75)']
                ]}
              };*/
  };


function addObject (obj) {
  canvasObjects[obj]();
}

// Delete Button
window.deleteObject = function () {
  canvas.getActiveObject().remove();
};
document.addEventListener('keydown', function (event) {
  console.log(event);
  if (event.keyCode === 8 || event.keyCode === 46) {
    event.preventDefault();
    canvas.getActiveObject().remove();
  }
}, false);

/*canvasObjects.redCircle();
canvasObjects.blueCircle();
canvasObjects.greenCircle();
*/


var canvasObjects = {
  redCircle: function () {
    var redCircle = new fabric.Circle({
      top: 100,
      left: 100,
      radius: 30,
      fill: 'crimson',
      stroke: 'black',
      strokeWidth: 5
    });
    canvas.add(redCircle);
  },
  blueCircle: function () {
    var blueCircle = new fabric.Circle({
      top: 100,
      left: 200,
      radius: 30,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 5
    });
    canvas.add(blueCircle);
  },
  greenCircle: function () {
    var greenCircle = new fabric.Circle({
      top: 100,
      left: 300,
      radius: 30,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 5
    });
    canvas.add(greenCircle);
  }
};





//RESIZING CANVAS ******************



initialize();
      function initialize() {
        // Register an event listener to
        // call the resizeCanvas() function each time 
        // the window is resized.
        window.addEventListener('resize', resizeCanvas, false);
        
        // Draw canvas border for the first time.
        resizeCanvas();
      }
    
      // Runs each time the DOM window resize event fires.
      // Resets the canvas dimensions to match window,
      // then draws the new borders accordingly.
      function resizeCanvas() {
        //var inner_w = 800;//window.innerWidth;
         // var inner_h = 800;
          //var innw=window.innerWidth-25; //working!!!!!!
          
          //var innh=window.innerHeight-25; //working!!!!!!
        var innw=$('#canClass').width()-50;
        var innh=$('#canClass').height()-100;
        //$('#canClass').width=inner_w;
        //$('#canClass').width=inner_h;

        //$('#canClass').width(innw); //workin!!!!
        //$('#canClass').height(innh);//working!!!!
      
          //$('#canClass').height();
        canvas.setWidth(innw);
        canvas.setHeight(innw*3/4);
        //canvas.setWidth(window.innerWidth-100) ;
        //canvas.setHeight(window.innerHeight-500);
        canvas.calcOffset();

        var innVidW=$('#videoCard').width();
        //$('#lbl').html(innVidW);
  /*      var innVidH=$('#videoCard').height();
        */
        $('#video').width(innVidW);
  $('#video').height(innVidW*3/4);

       

        redraw();
      }