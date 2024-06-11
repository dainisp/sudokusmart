import { StrategyFinder } from './strategyfinder.js'
import { groups } from './groups.js'
export class GameField {
    constructor() {
      // this.height = height;
      // this.width = width;
    
  
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        this.pens[cellIndex] = Array()
        this.cells[cellIndex] = 0
        var icellGroups = Array()
        for (var groupIndex = 0; groupIndex < 27; groupIndex++) {
          if (groups[groupIndex].indexOf(cellIndex) >= 0)
            icellGroups.push(groupIndex)
        }
        this.cellGroups[cellIndex] = icellGroups;
      }
  
    }
    pens = Array()
    cells = Array()
    selectedCell = -1
    solved = Array()
    //groups = Array()
    draw = undefined
    selRect = undefined
    valueSelections = undefined
    strategyResults = undefined
    strategyPens = undefined
    strategyCellColor = '#a0ffa0'
    strategyUsableCellColor = '#ffa0a0'
    strategyPenColor = '#f0f010'
    selColor = '#80b0c0'
    selOpacity = 0.5
    timerOn = false
    cellGroups = Array()
  
  
    static loadFromJson(fieldJson) {
      var gameField = new GameField()
      gameField.loadGameJson(fieldJson)
      return gameField
    }
    playEndGame()
  {
    var x = document.getElementById("audio");
    x.volume = 0.5
    x.play()   
  }
  
  
    loadGameJson(gameJson) {
      this.clearGame()
      gameJson = JSON.parse(gameJson)
      var time = gameJson["time"]
      if (time !== undefined && time !== "") {
        $("#gametime")[0].innerText = time
        //  console.log($("#gametime")[0].value)
        this.timerOn = true
      }
      gameJson["cells"].forEach(cell => {
        //console.log(cell);
        var col = cell["position"][1]
        var row = cell["position"][0]
        var penslist = Array()
        this.cells[row * 9 + col] = cell["value"]
        if (cell["earmarks"].length > 0) {
          var penIndex = 0
          cell["earmarks"].forEach(penvalue => {
            penslist[penIndex] = penvalue
            penIndex++
          });
        }
        this.pens[row * 9 + col] = penslist
  
  
      });
      this.drawCells()
      this.drawPens()
    }
  
    drawCells() {
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        var cell = this.cells[cellIndex]
        if (cell > 0) {
          var col = cellIndex % 9;
          var row = (cellIndex - col) / 9
          this.draw.text(cell).move(45 + col * 90, 63 + row * 90).font({
            family: 'Helvetica'
            , size: 80
            , anchor: 'middle'
            , leading: '1.5em'
          }).attr("id", "cell" + cellIndex)
        }
      }
    }
  
  
  
    drawPens() {
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        var cellPens = this.pens[cellIndex]
        if (cellPens.length > 0) {
          var col = cellIndex % 9;
          var row = (cellIndex - col) / 9
          cellPens.forEach(pen => {
            var pencol = (pen - 1) % 3
            var penrow = (pen - 1 - pencol) / 3
            this.draw.text(pen).move(pencol * 30 + col * 90 + 14, penrow * 29 + row * 90 + 9).font({
              family: 'Helvetica'
              , size: 25
              , anchor: 'middle'
              , leading: '1.5em'
            }).attr("id", "pen" + cellIndex + "_" + pen)
          });
  
        }
      }
  
    }
    addValueSelections(cellValue) {
      if (!this.valueSelections)
        this.valueSelections = this.draw.group().back()
      else
        this.valueSelections.clear()
      var cellIndex = 0
      this.pens.forEach(cellPens => {
        if (cellPens.indexOf(cellValue) >= 0) {
          var col = cellIndex % 9;
          var row = (cellIndex - col) / 9
  
          var pencol = (cellValue - 1) % 3
          var penrow = (cellValue - 1 - pencol) / 3
          this.valueSelections.rect(30, 30).move(pencol * 30 + col * 90, penrow * 30 + row * 90).fill(this.selColor).back()
        }
        cellIndex++
      });
  
    }
    correctPens(cellIndex) {
      var cellValue = this.cells[cellIndex]
      this.cellGroups[cellIndex].forEach(groupIndex => {
        groups[groupIndex].forEach(gCellIndex => {
  
          if (gCellIndex != cellIndex && this.pens[gCellIndex].indexOf(cellValue) >= 0) {
            this.removePen(gCellIndex, cellValue)
          }
  
        });
      });
    }
  
    onStrategyClick() {
  
      var strategyFinder = new StrategyFinder(this.pens)
      var result = strategyFinder.findStrategies()
      if (result < 0)
        $("#strategylabel")[0].innerText = "Strategy unknown"
      else {
        // alert("Found strategy " + strategyFinder.strategyNames[result])
        $("#strategylabel")[0].innerText = "Strategy " + strategyFinder.strategyNames[result]
        if (this.strategyResults === undefined)
          this.strategyResults = this.draw.group().back()
        strategyFinder.strategyCells.forEach(cellIndex => {
          var col = cellIndex % 9
          var row = (cellIndex - col) / 9
          this.strategyResults.rect(90, 90).move(col * 90, row * 90).fill(this.strategyCellColor)
        });
        strategyFinder.strategyUsableCells.forEach(cellIndex => {
          var col = cellIndex % 9
          var row = (cellIndex - col) / 9
          this.strategyResults.rect(90, 90).move(col * 90, row * 90).fill(this.strategyUsableCellColor)
        });
  
  
  
        this.strategyPens = strategyFinder.strategyPens
  
        for (var cellIndex in this.strategyPens) {
          var cellPens = this.strategyPens[cellIndex]
          for (var penIndex = 0; penIndex < cellPens.length; penIndex++) {
            if (cellPens[penIndex] !== undefined) {
              var penId = "#pen" + cellIndex + "_" + cellPens[penIndex]
              this.draw.find(penId).fill(this.strategyPenColor)
            }
          };
        }
  
  
      }
    }
  
    clearStrategyResults() {
      $("#strategylabel")[0].innerText = ""
      if (this.strategyPens !== undefined) {
        for (var cellIndex in this.strategyPens) {
          var cellPens = this.strategyPens[cellIndex];
          cellPens.forEach(pen => {
            var penId = "#pen" + cellIndex + "_" + pen
            this.draw.find(penId).fill("#000000")
          });
        }
        this.strategyPens = undefined
      }
  
      if (this.strategyResults !== undefined)
        this.strategyResults.clear()
  
    }
  
    onCellClick(newSelectedCell) {
      newSelectedCell = Math.round(newSelectedCell)
      if (newSelectedCell < 0 || newSelectedCell >= 81)
        return
      if (newSelectedCell != this.selectedCell)
        this.selectedCell = newSelectedCell
      else
        this.selectedCell = -1
  
      if (this.selectedCell == -1) {
        this.selRect.hide()
        if (this.valueSelections)
          this.valueSelections.clear()
      }
      else {
        var col = this.selectedCell % 9
        var row = (this.selectedCell - col) / 9
        this.selRect.move(col * 90, row * 90).show()
        var value = this.cells[this.selectedCell]
        if (value > 0)
          this.addValueSelections(value)
        else if (this.valueSelections)
          this.valueSelections.clear()
      }
    }
  
  
  
    doValueClick(value, penChecked) {
      value = Number(value)
      if (this.selectedCell < 0)
        return
      if (penChecked) {
        if (this.cells[this.selectedCell] > 0)
          return
        this.clearStrategyResults()
        var penIndex = this.pens[this.selectedCell].indexOf(value)
        if (penIndex >= 0)
          this.removePen(this.selectedCell, value)
        else
          this.placePen(this.selectedCell, value)
      }
      else {
        this.clearStrategyResults()
        var cellValue = this.cells[this.selectedCell]
        if (cellValue != 0) {
          if (cellValue == value)
            this.removeCell(this.selectedCell)
  
        } else {
          var otherCellIndex = this.checkCellValue(this.selectedCell, value)
          if (otherCellIndex >= 0)
            this.onCellClick(otherCellIndex)
          if (this.solved.length == 81 && this.solved[this.selectedCell] != value) {
            alert("wrong value!")
            return
          }
          else {
  
            this.placeCell(this.selectedCell, value)
            if (this.checkDone())
              {
                this.playEndGame()
               // videojs(document.querySelector('video')).overlay();
               var video = $("#video")[0]
               video.style.visibility='visible'
               video.play()
               setTimeout(function(){
                video.pause();
                video.style.visibility='hidden'
            }, 5000); 
               this.timerOn = false
                alert("Good, you are winner!!!")
              }
            this.addValueSelections(value)
          }
        }
      }
    }
  
    setDraw(draw) {
  
      this.draw = draw
      this.valueSelections = draw.group().back()
      this.strategyResults = draw.group().back()
      this.selRect = this.draw.rect(90, 90).fill({ color: this.selColor, opacity: this.selOpacity }).hide()
      this.drawCells()
      this.drawPens()
  
    }
  
    removePensInCell(cellIndex) {
      for (var pen = 1; pen <= 9; pen++) {
        var elementId = "#pen" + cellIndex + "_" + pen
        this.draw.find(elementId).remove()
  
      }
      this.pens[cellIndex] = Array()
    }
  
    checkCellValue(cellIndex, cellValue) {
      this.cellGroups[cellIndex].forEach(groupIndex => {
  
        groups[groupIndex].forEach(gCellIndex => {
          if (gCellIndex != cellIndex && this.cells[gCellIndex] == cellValue)
            return gCellIndex;
        });
      });
      return -1
    }
  
  
    checkDone() {
      var tst = this.cells.indexOf(0)
      return tst < 0
    }
  
    placeCell(cellIndex, cellValue) {
  
      this.removePensInCell(cellIndex)
      this.cells[cellIndex] = cellValue
      var col = cellIndex % 9;
      var row = (cellIndex - col) / 9
      this.draw.text(cellValue).move(45 + col * 90, 63 + row * 90).font({
        family: 'Helvetica'
        , size: 80
        , anchor: 'middle'
        , leading: '1.5em'
      }).attr("id", "cell" + cellIndex)
      this.correctPens(cellIndex);
    }
    removeCell(cellIndex) {
      var elementId = "#cell" + cellIndex
      var cellNumberSvg = this.draw.find(elementId)
      if (!cellNumberSvg)
        return
      cellNumberSvg.remove()
      this.cells[cellIndex] = 0
    }
  
    getGameJson() {
      var cellsArray = Array()
      var tstarr = "["
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        var cellJson = JSON
        var cellPens = this.pens[cellIndex]
        cellJson["earmarks"] = cellPens
        var col = cellIndex % 9
        var row = (cellIndex - col) / 9
        var position = Array(row, col)
        cellJson["position"] = position
        cellJson["value"] = this.cells[cellIndex]
        cellsArray.push(cellJson)
        var tst = JSON.stringify(cellJson)
        tstarr += tst + ","
      }
      var gameJsonStr = tstarr.substring(0, tstarr.length - 1) + "]"
      /*
      var newTimestamp = Date.now()
      var time = (newTimestamp - this.timestamp)/1000
      var hours = (time - time%3600)/3600
      time -= hours*3600
      var mins = (time - time%60)/60
      var secs = Math.round( time - mins*60)    
      */
      var time = $("#gametime")[0].innerText
  
      gameJsonStr = "{\"cells\":" + gameJsonStr + ",\"difficulty_category\":\"easy\",\"time\":\"" + time + "\"}"
      //gameJson["difficulty_category"] = "easy"
      //gameJson["cells"] = cellsArray
      return gameJsonStr
  
    }
  
    removePen(cellIndex, pen) {
      var elementId = "#pen" + cellIndex + "_" + pen
      var penSvg = this.draw.find(elementId)
      /*
        if(!penSvg)
        return
      */
      penSvg.remove()
      this.pens[cellIndex].splice(this.pens[cellIndex].indexOf(pen), 1)
  
    }
  
    placePen(cellIndex, pen) {
      this.pens[cellIndex].push(pen)
      var col = cellIndex % 9;
      var row = (cellIndex - col) / 9
  
      var pencol = (pen - 1) % 3
      var penrow = (pen - 1 - pencol) / 3
      this.draw.text(pen).move(pencol * 28 + col * 90 + 14, penrow * 28 + row * 90 + 14).font({
        family: 'Helvetica'
        , size: 25
        , anchor: 'middle'
        , leading: '1.5em'
      }).attr("id", "pen" + cellIndex + "_" + pen)
  
  
    }
    loadNewGame(sudoku) {
  
      this.clearGame()
      var solvedStr = sudoku["solution"]
      if (this.solved.length > 0)
        this.solved = Array()
      for (var cellIndex = 0; cellIndex < 81; cellIndex++)
        this.solved[cellIndex] = Number(solvedStr[cellIndex])
      var puzzle = sudoku["puzzle"]
  
      for (var charIndex = 0; charIndex < 81; charIndex++) {
        if (puzzle[charIndex] != "-") {
          this.cells[charIndex] = Number(puzzle[charIndex])
        }
      }
      this.placeAllPens()
      this.drawCells()
      this.drawPens()
      var timestamp = Date.now()
      $("#gametime")[0].innerText = "00:00:00"
      this.timerOn = true
    }
  
    placeAllPens() {
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        if (this.cells[cellIndex] == 0) {
          var groupValues = Array()
          this.cellGroups[cellIndex].forEach(groupIndex => {
            groups[groupIndex].forEach(gCellIndex => {
              var value = this.cells[gCellIndex]
              if (value > 0 && groupValues.indexOf(value)) {
                groupValues.push(value)
              }
            });
          });
  
          for (var penvalue = 1; penvalue <= 9; penvalue++) {
            if (groupValues.indexOf(penvalue) < 0)
              this.pens[cellIndex].push(penvalue)
          }
  
        }
  
      }
  
    }
  
  
    clearGame() {
      this.selectedCell = -1;
      this.selRect.hide()
      this.valueSelections.clear()
      this.clearStrategyResults()
      this.draw.find("text").remove()
      for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
        this.cells[cellIndex] = 0;
        this.pens[cellIndex] = Array();
      }
    }
  
  
  } // end class
  
  