import { SVG } from '@svgdotjs/svg.js'
import { getSudoku } from 'sudoku-gen'
import {getCookie,setCookie} from "./cookies.js"
import jQuery from 'jquery'
import * as videojs from 'videojs-overlay'
import { GameField } from './gamefield.js'
window.$ = jQuery




export function cellClick(event) {
  var rect = $("#svgtag")[0].getBoundingClientRect()
  //checkTag = $("#svgtag")[0].y
//console.log(rect.top, rect.right, rect.bottom, rect.left);
  var cellWidth = rect.height/9;
  var offsetTop = event.clientY-rect.y 
  var offsetLeft = event.clientX-rect.x
  var col = Math.trunc(offsetLeft / cellWidth);
  var row = Math.trunc(offsetTop / cellWidth);
  var newSelectedCell = row * 9 + col;
  gameField.onCellClick(newSelectedCell)

}

/*
export function doClick() {
  var cells = Array()
  for (row = 0; row < 9; row++) {
    for (col = 0; col < 9; col++) {
      cells[row * 9 + col] = col + 1
    }
  }
  var pens = Array()
  for (cellIndex = 0; cellIndex < 81; cellIndex++) {
    penlist = Array();
    for (pen = 1; pen <= 9; pen++) {
      penlist[pen - 1] = pen
    }
    pens[cellIndex] = penlist
  }

  //  var draw = SVG().addTo('body').size(300, 300) 
  //var defs = draw.defs()
  //var line = draw.line(0, 0, 100, 150).stroke({color: 'red', width: 1 }) 
  drawPens(pens)
  //alert("fuck!")
}
*/
export function doNumberClick(element) {
  var isChecked = $("#penCheck").is(":checked")
  //var isChecked = penCheck.value //penCheck
  gameField.doValueClick(element.target.value, isChecked)

}

export function onStrategyClick()
{
  gameField.onStrategyClick()
}

export function onNewGameClick() {
  var levelEl = $("#level")[0]
  var level = levelEl.value
  const sudoku = getSudoku(level)
  gameField.loadNewGame(sudoku)
}

export function onUploadClick() {
  var gameJson = gameField.getGameJson();
  var data = new Blob([gameJson]);
  var downloadLink = document.getElementById("aDownloadCsv2");

  if (downloadLink == null) {
    downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'sudoku.json');
    downloadLink.setAttribute('id', 'aDownloadCsv2');

    document.body.appendChild(downloadLink);
  }

  downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  downloadLink.href = URL.createObjectURL(data);

  downloadLink.style.display = 'none';
  downloadLink.click();
}

setInterval(function () {
  if (gameField.timerOn) {
    var time = $("#gametime")[0].innerText
    time = time.split(":")
    time = Number(time[0]) * 3600 + Number(time[1]) * 60 + Number(time[2])
    time++
    var hour = time % 3600
    hour = (time - hour) / 3600
    time = time % 3600
    var sec = time % 60
    var min = (time - sec) / 60
    var timeStr = zeroPad(hour, 2) + ":" + zeroPad(min, 2) + ":" + zeroPad(sec, 2)
    $("#gametime")[0].innerText = timeStr
  }
}, 1000);

const zeroPad = (num, places) => String(num).padStart(places, '0')
let gameField = new GameField()
gameField.setDraw(SVG('#svgtag'))


jQuery(document).ready(function ($) {

  let fileInput = document.getElementById('file-input')
  
  fileInput.onchange = () => {
    const reader = new FileReader()
    reader.onload = (e) => { 
      //console.log('file contents:', e.target.result)
      gameField.loadGameJson(e.target.result)
    }
    
    for (let file of fileInput.files) {
      reader.readAsText(file)
    }
  }


  let cookie_consent = getCookie("user_cookie_consent");
  if (cookie_consent != "") {
    document.getElementById("cookieNotice").style.display = "none";
  } else {
    document.getElementById("cookieNotice").style.display = "block";
  }

  var gameJson = getCookie("game")
  if (gameJson !== undefined && gameJson != "") {
    gameField.loadGameJson(gameJson)
  }

});

$(window).on("beforeunload", function () {

  if (gameField.timerOn) {
    var gameJson = gameField.getGameJson()
    //setCookie(cname, cvalue, exdays)
    setCookie("game", gameJson, 10)

  }
  //return confirm("Do you really want to close?"); 
});
