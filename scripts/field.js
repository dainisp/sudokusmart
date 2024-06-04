//import "main.js"
class StrategyFinder {
  pens = Array()
  groups = Array()
  cellGroups = Array()
  strategyCells = Array()
  strategyUsableCells = Array()
  strategyPens = Array()
  strategyNames = Array()
  hiddenNakedSelectedCells = Array()
  hiddenNakedIsHidden = false
  constructor(pens) {
    this.groups =
      [[0, 1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 32, 33, 34, 35],
      [36, 37, 38, 39, 40, 41, 42, 43, 44],
      [45, 46, 47, 48, 49, 50, 51, 52, 53],
      [54, 55, 56, 57, 58, 59, 60, 61, 62],
      [63, 64, 65, 66, 67, 68, 69, 70, 71],
      [72, 73, 74, 75, 76, 77, 78, 79, 80],
      [0, 9, 18, 27, 36, 45, 54, 63, 72],
      [1, 10, 19, 28, 37, 46, 55, 64, 73],
      [2, 11, 20, 29, 38, 47, 56, 65, 74],
      [3, 12, 21, 30, 39, 48, 57, 66, 75],
      [4, 13, 22, 31, 40, 49, 58, 67, 76],
      [5, 14, 23, 32, 41, 50, 59, 68, 77],
      [6, 15, 24, 33, 42, 51, 60, 69, 78],
      [7, 16, 25, 34, 43, 52, 61, 70, 79],
      [8, 17, 26, 35, 44, 53, 62, 71, 80],
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80]];
    this.strategyNames[0] = "Single"
    this.strategyNames[1] = "Claimed"
    this.strategyNames[2] = "Pointing"
    this.strategyNames[3] = "Naked pair"
    this.strategyNames[4] = "Hidden pair"
    this.strategyNames[5] = "Naked tripple"
    this.strategyNames[6] = "Hidden tripple"
    this.strategyNames[7] = "Naked quad"
    this.strategyNames[8] = "Hidden quad"
    this.strategyNames[9] = "XYWing"

    this.strategyNames[-1] = "Unknown"


    for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
      this.pens[cellIndex] = Array()
      var icellGroups = Array()
      for (var groupIndex = 0; groupIndex < 27; groupIndex++) {
        if (this.groups[groupIndex].indexOf(cellIndex) >= 0)
          icellGroups.push(groupIndex)
      }
      this.cellGroups[cellIndex] = icellGroups;
    }
    this.pens = pens
  }

  penCounts(groupIndex) {
    var penCounts = Array()

    var groupCells = this.groups[groupIndex]
    groupCells.forEach(cellIndex => {
      this.pens[cellIndex].forEach(pen => {
        if (penCounts[pen] === undefined) {
          var cellValues = Array()
          cellValues.push(cellIndex)
          penCounts[pen] = cellValues;
        }
        else
          penCounts[pen].push(cellIndex)
      });
    });


    return penCounts
  }



  getSingle(groupIndex) {
    var penCounts = this.penCounts(groupIndex)



    for (let [pen, penIndexes] of penCounts.entries()) {
      //console.log('%d: %s', i, value);
      // var penIndexes = penCounts[pen];
      if (penIndexes !== undefined && penIndexes.length == 1) {
        var cellIndex = penIndexes[0];
        this.strategyUsableCells.push(cellIndex)
        var cellPens = Array()
        cellPens.push(pen)
        this.strategyPens[cellIndex] = cellPens
        return 0
      }
    }

    for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
      if (this.pens[cellIndex].length == 1) {
        this.strategyUsableCells.push(cellIndex)
        var cellPens = Array()
        cellPens.push(this.pens[cellIndex][0])
        this.strategyPens[cellIndex] = cellPens
        return 0
      }
    }


    return -1
  }




  getClaimedPointing(pen) {

    //horizontales

    var boxOffset = 0
    while (boxOffset < 3) {
      var boxData = Array()
      var rowOffset = 0
      while (rowOffset < 3) {
        var rowData = Array()
        var groupCells = this.groups[boxOffset * 3 + rowOffset]

        for (var cellIndex = 0; cellIndex < 9; cellIndex++) {
          var tripleIndex = (cellIndex - cellIndex % 3) / 3
          if (this.pens[groupCells[cellIndex]].indexOf(pen) >= 0 && rowData.indexOf(tripleIndex) < 0) {
            rowData.push(tripleIndex)
          }
        }


        boxData.push(rowData)
        rowOffset++
      }

      for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {
        if (boxData[boxDataIndex].length == 1) {
          var tripleIndex = boxData[boxDataIndex]
          for (var cboxDataIndex = 0; cboxDataIndex < 3; cboxDataIndex++) {
            if (boxDataIndex != cboxDataIndex) {
              var otherTrippleIndex = boxData.indexOf(tripleIndex)
              if (otherTrippleIndex >= 0) {
                var groupCells = this.groups[boxOffset * 3 + boxDataIndex]
                var cellFirstIndex = tripleIndex * 3
                var counter = 0;
                while (counter < 3) {
                  var cellIndex = groupCells[cellFirstIndex]
                  if (this.pens[cellIndex].indexOf(pen) >= 0) {
                    this.strategyCells.push(cellIndex)

                  }
                  cellFirstIndex++
                  counter++
                }
                groupCells = this.groups[boxOffset * 3 + cboxDataIndex]
                var cellFirstIndex = tripleIndex * 3
                var counter = 0;
                while (counter < 3) {
                  var cellIndex = groupCells[cellFirstIndex]
                  if (this.pens[cellIndex].indexOf(pen) >= 0) {
                    this.strategyUsableCells.push(cellIndex)
                    var cellPens = Array()
                    cellPens.push(pen)
                    this.strategyPens[cellIndex] = cellPens
                    return 1
                  }
                  cellFirstIndex++
                  counter++
                }

                this.strategyCells = Array()


              }
            }
          }

        }

      }

      var trippleBox = -1;
      var tripleIndex = -1;
      for (tripleIndex = 0; tripleIndex < 3; tripleIndex++) {
        var trippleBox = -1;
        for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {

          if (boxData[boxDataIndex].indexOf(tripleIndex) >= 0) {
            if (trippleBox >= 0) {
              trippleBox = -1
              break
            }
            else
              trippleBox = boxDataIndex
          }

        }

        if (trippleBox >= 0 && boxData[trippleBox].length > 1) {

          var groupCells = this.groups[boxOffset * 3 + trippleBox]
          var cellFirstIndex = tripleIndex * 3
          var counter = 0;
          while (counter < 3) {
            var cellIndex = groupCells[cellFirstIndex]
            if (this.pens[cellIndex].indexOf(pen) >= 0) {
              this.strategyCells.push(cellIndex)

            }
            cellFirstIndex++
            counter++
          }

          boxData[trippleBox].forEach(otherTripple => {
            if (otherTripple != tripleIndex) {
              var cellFirstIndex = otherTripple * 3
              var counter = 0;
              while (counter < 3) {
                var cellIndex = groupCells[cellFirstIndex]
                if (this.pens[cellIndex].indexOf(pen) >= 0) {
                  this.strategyUsableCells.push(cellIndex)
                  var cellPens = Array()
                  cellPens.push(pen)
                  this.strategyPens[cellIndex] = cellPens
                  return 2;

                }
                cellFirstIndex++
                counter++
              }


            }
          });

          this.strategyCells = Array()




        }


      }


      boxOffset++

    }
    //vertikales


    var boxOffset = 0
    while (boxOffset < 3) {
      var boxData = Array()
      var rowOffset = 0
      while (rowOffset < 3) {
        var rowData = Array()
        var groupCells = this.groups[9 + boxOffset * 3 + rowOffset]

        for (var cellIndex = 0; cellIndex < 9; cellIndex++) {
          var tripleIndex = (cellIndex - cellIndex % 3) / 3
          if (this.pens[groupCells[cellIndex]].indexOf(pen) >= 0 && rowData.indexOf(tripleIndex) < 0) {
            rowData.push(tripleIndex)
          }
        }


        boxData.push(rowData)
        rowOffset++
      }

      for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {
        if (boxData[boxDataIndex].length == 1) {
          var tripleIndex = boxData[boxDataIndex]
          for (var cboxDataIndex = 0; cboxDataIndex < 3; cboxDataIndex++) {
            if (boxDataIndex != cboxDataIndex) {
              var otherTrippleIndex = boxData.indexOf(tripleIndex)
              if (otherTrippleIndex >= 0) {
                var groupCells = this.groups[9 + boxOffset * 3 + boxDataIndex]
                var cellFirstIndex = tripleIndex * 3
                var counter = 0;
                while (counter < 3) {
                  var cellIndex = groupCells[cellFirstIndex]
                  if (this.pens[cellIndex].indexOf(pen) >= 0) {
                    this.strategyCells.push(cellIndex)

                  }
                  cellFirstIndex++
                  counter++
                }
                groupCells = this.groups[9 + boxOffset * 3 + cboxDataIndex]
                var cellFirstIndex = tripleIndex * 3
                var counter = 0;
                while (counter < 3) {
                  var cellIndex = groupCells[cellFirstIndex]
                  if (this.pens[cellIndex].indexOf(pen) >= 0) {
                    this.strategyUsableCells.push(cellIndex)
                    var cellPens = Array()
                    cellPens.push(pen)
                    this.strategyPens[cellIndex] = cellPens
                    return 1
                  }
                  cellFirstIndex++
                  counter++
                }


                this.strategyCells = Array()

              }
            }
          }

        }

      }

      var trippleBox = -1;
      var tripleIndex = -1;
      for (tripleIndex = 0; tripleIndex < 3; tripleIndex++) {
        var trippleBox = -1;
        for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {

          if (boxData[boxDataIndex].indexOf(tripleIndex) >= 0) {
            if (trippleBox >= 0) {
              trippleBox = -1
              break
            }
            else
              trippleBox = boxDataIndex
          }

        }

        if (trippleBox >= 0 && boxData[trippleBox].length > 1) {

          var groupCells = this.groups[boxOffset * 3 + trippleBox]
          var cellFirstIndex = tripleIndex * 3
          var counter = 0;
          while (counter < 3) {
            var cellIndex = groupCells[cellFirstIndex]
            if (this.pens[cellIndex].indexOf(pen) >= 0) {
              this.strategyCells.push(cellIndex)

            }
            cellFirstIndex++
            counter++
          }

          boxData[trippleBox].forEach(otherTripple => {
            if (otherTripple != tripleIndex) {
              var cellFirstIndex = otherTripple * 3
              var counter = 0;
              while (counter < 3) {
                var cellIndex = groupCells[cellFirstIndex]
                if (this.pens[cellIndex].indexOf(pen) >= 0) {
                  this.strategyUsableCells.push(cellIndex)
                  var cellPens = Array()
                  cellPens.push(pen)
                  this.strategyPens[cellIndex] = cellPens
                  return 2

                }
                cellFirstIndex++
                counter++
              }


            }
          });
          this.strategyCells = Array()

        }


      }
      boxOffset++
    }

  }

  getHiddenNaked(groupIndex) {
    this.hiddenNakedSelectedCells = Array()
    var penCells = Array()
    this.groups[groupIndex].forEach(cellIndex => {
      if (this.pens[cellIndex].length > 0)
        penCells.push(cellIndex);

    });


    if (penCells.length < 3)
      return -1;
    this.hiddenNakedSelectedCells.push(penCells[0]);
    this.hiddenNakedSelectedCells.push(penCells[1]);

    var isNext = true;
    var selectedCount = 2
    var selectedCellIndexes = Array()
    selectedCellIndexes.push(0)
    selectedCellIndexes.push(1)
    while (selectedCount < penCells.length && selectedCount < 5) {
      // ------------------------------start check process
      this.hiddenNakedIsHidden = false
      var selectedPens = Array()
      var unSelectedPens = Array()
      this.hiddenNakedSelectedCells.forEach(cellIndex => {
        this.pens[cellIndex].forEach(pen => {
          if (selectedPens.indexOf(pen) < 0)
            selectedPens.push(pen)
        });

      });
      if (selectedPens.length == this.hiddenNakedSelectedCells.length) {
        penCells.forEach(cellIndex => {
          if (this.hiddenNakedSelectedCells.indexOf(cellIndex) < 0) {
            this.pens[cellIndex].forEach(pen => {
              if (selectedPens.indexOf(pen) >= 0) {
                this.hiddenNakedSelectedCells.forEach(strategyCell => {
                  this.strategyCells.push(strategyCell)
                });
                this.strategyUsableCells.push(cellIndex)
                var cellPens = Array()
                cellPens.push(pen)
                this.strategyPens[cellIndex] = cellPens
                return 3 + (this.hiddenNakedSelectedCells.length - 2) * 2 + Number(this.hiddenNakedIsHidden)
              }
            });
          }
        });
      } else {
        penCells.forEach(cellIndex => {
          if (this.hiddenNakedSelectedCells.indexOf(cellIndex) < 0) {
            this.pens[cellIndex].forEach(pen => {
              if (unSelectedPens.indexOf(pen) < 0) {
                unSelectedPens.push(pen)
              }
            });
          }
        });


        var selectedPenCount = 0
        selectedPens.forEach(pen => {
          if (unSelectedPens.indexOf(pen) < 0) {
            selectedPenCount++
          }
        });

        if (selectedPenCount == this.hiddenNakedSelectedCells.length) {
          var startUsable = false
          this.hiddenNakedSelectedCells.forEach(cellIndex => {
            if (!startUsable) {
              var mustBreak = false
              this.pens[cellIndex].forEach(pen => {
                if (!mustBreak && unSelectedPens.indexOf(pen) >= 0) {
                  startUsable = true
                  this.strategyUsableCells.push(cellIndex)
                  var cellPens = Array()
                  cellPens.push(pen)
                  this.strategyPens[cellIndex] = cellPens
                  mustBreak = true
                }
              });
            } else {
              this.strategyCells.push(cellIndex)
            }
          });
          this.hiddenNakedIsHidden = true
          this.strategyCells = this.hiddenNakedSelectedCells
          return 3 + (this.hiddenNakedSelectedCells.length - 2) * 2 + Number(this.hiddenNakedIsHidden)

        }

      }

      //---- end check process

      //meklējam kurai no izveletajam cellem ir briva vieta
      var indexInSelected = this.hiddenNakedSelectedCells.length - 1;
      var currentSelectedCell = this.hiddenNakedSelectedCells[indexInSelected]
      var indexInAll = penCells.indexOf(currentSelectedCell)
      while (indexInSelected >= 0 && indexInAll >= penCells.length - (this.hiddenNakedSelectedCells.length - indexInSelected)) {
        indexInSelected--
        currentSelectedCell = this.hiddenNakedSelectedCells[indexInSelected]
        indexInAll = penCells.indexOf(currentSelectedCell)
      }

      if (indexInSelected >= 0) {
        indexInAll++
        while (this.hiddenNakedSelectedCells.length > indexInSelected)
          this.hiddenNakedSelectedCells.pop()
        while (this.hiddenNakedSelectedCells.length < selectedCount) {
          this.hiddenNakedSelectedCells.push(penCells[indexInAll])
          indexInAll++
        }
      } else {
        selectedCount++
        if (selectedCount < penCells.length && selectedCount < 5) {

          this.hiddenNakedSelectedCells = Array()
          indexInAll = 0
          while (this.hiddenNakedSelectedCells.length < selectedCount) {
            this.hiddenNakedSelectedCells.push(penCells[indexInAll])
            indexInAll++
          }
        }
      }




    }

    return -1

  }


  getXYWing(cellIndex) {
    var penfirst = this.pens[cellIndex][0]
    var penSecond = this.pens[cellIndex][1]
    var retVal = -1
    this.cellGroups[cellIndex].forEach(groupIndex => {
      
      this.groups[groupIndex].forEach(gFirstCellIndex => {



        if (gFirstCellIndex != cellIndex && this.pens[gFirstCellIndex].length == 2) {

          if ((this.pens[gFirstCellIndex].indexOf(penfirst) >= 0 && this.pens[gFirstCellIndex].indexOf(penSecond) < 0)
            || (this.pens[gFirstCellIndex].indexOf(penSecond) >= 0 && this.pens[gFirstCellIndex].indexOf(penfirst) < 0)) {
            for (var gSecondCellIndex = 0; gSecondCellIndex < 81; gSecondCellIndex++) {
              if (gSecondCellIndex != cellIndex && gSecondCellIndex != gFirstCellIndex
                && this.pens[gSecondCellIndex].length == 2
                && this.isCellsLinked(cellIndex,gSecondCellIndex)) {
                var penCommon = undefined
                var cellsPassed = false
                if (penfirst == this.pens[gFirstCellIndex][0]) {
                  penCommon = this.pens[gFirstCellIndex][1]
                  cellsPassed = (this.pens[gSecondCellIndex].indexOf(penCommon) >= 0
                    && this.pens[gSecondCellIndex].indexOf(penSecond) >= 0
                  )
                }
                if (penSecond == this.pens[gFirstCellIndex][0]) {
                  penCommon = this.pens[gFirstCellIndex][1]
                  cellsPassed = (this.pens[gSecondCellIndex].indexOf(penCommon) >= 0
                    && this.pens[gSecondCellIndex].indexOf(penfirst) >= 0
                  )
                }
                if (penfirst == this.pens[gFirstCellIndex][1]) {
                  penCommon = this.pens[gFirstCellIndex][0]
                  cellsPassed = (this.pens[gSecondCellIndex].indexOf(penCommon) >= 0
                    && this.pens[gSecondCellIndex].indexOf(penSecond) >= 0
                  )
                }
                if (penSecond == this.pens[gFirstCellIndex][1]) {
                  penCommon = this.pens[gFirstCellIndex][0]
                  cellsPassed = (this.pens[gSecondCellIndex].indexOf(penCommon) >= 0
                    && this.pens[gSecondCellIndex].indexOf(penfirst) >= 0
                  )
                }
                if (cellsPassed) {
                  var linkCells = [gFirstCellIndex, gSecondCellIndex]
                  var exceptionCells = [cellIndex]
                  var linkedCell = this.getLinkedCell(linkCells, penCommon, exceptionCells)
                  if (linkedCell >= 0) {
                    this.strategyCells = [cellIndex, gFirstCellIndex, gSecondCellIndex]
                    this.strategyUsableCells = [linkedCell]
                    this.strategyPens[linkedCell] = [penCommon]
                    retVal = 9
                    return retVal
                  }


                }


              }
            }

          }

        }
        if(retVal>=0)
          return retVal
      });

    });
return retVal
  }




  findSingle() {
    for (var groupIndex = 0; groupIndex < 27; groupIndex++) {
      var result = this.getSingle(groupIndex)
      if (result >= 0)
        return result
    }
    return -1
  }

  findClaimedPointing() {
    for (var pen = 1; pen <= 9; pen++) {
      var result = this.getClaimedPointing(pen)
      if (result >= 0)
        return result
    }
    return -1
  }


  findNakedHidden() {
    for (var groupIndex = 0; groupIndex < 27; groupIndex++) {
      var result = this.getHiddenNaked(groupIndex)
      if (result >= 0)
        return result
    }
    return -1

  }

  findXYWing() {
    for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
      if (this.pens[cellIndex].length == 2) {
        var result = this.getXYWing(cellIndex)
        if (result >= 0)
          return result
      }
    }
    return -1

  }


  findStrategies() {

    var result = this.findSingle()
    if (result >= 0)
      return result

    result = this.findClaimedPointing()
    if (result >= 0)
      return result

    result = this.findNakedHidden()
    if (result >= 0)
      return result

    

   result = this.findXYWing()
    if (result >= 0)
      return result


    return result
  }

  getLinkedCell(linkCells, pen, exceptionCells) {
    for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
      if (exceptionCells.indexOf(cellIndex) < 0
        && linkCells.indexOf(cellIndex) < 0
        && this.pens[cellIndex].indexOf(pen) >= 0
      ) {
       
        var currentCellGroups = this.cellGroups[cellIndex]
        var allLinksFound = true 
        linkCells.forEach(lcellIndex => {
           if(allLinksFound)
           {
            var lcellGroups = this.cellGroups[lcellIndex]
             var curentCellLinkFound = false
            lcellGroups.forEach(groupIndex => {
              if (!curentCellLinkFound &&  currentCellGroups.indexOf(groupIndex) >= 0) {
                curentCellLinkFound = true
                
              }
            })
            if(!curentCellLinkFound)
              allLinksFound=false
          }
        });
       if(allLinksFound)
          return cellIndex
       
      }
    }

    return -1

  }

isCellsLinked(firstCellIndex,secondCellIndex)
{
var firstGroups = this.cellGroups[firstCellIndex]
var secondGroups = this.cellGroups[secondCellIndex]
for(var groupIndex=0;groupIndex<firstGroups.length;groupIndex++)
  {
    if( secondGroups.indexOf( firstGroups[groupIndex]) >=0)
      return true
  }
return false
}

}


class GameField {
  constructor() {
    // this.height = height;
    // this.width = width;
    this.groups =
      [[0, 1, 2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 32, 33, 34, 35],
      [36, 37, 38, 39, 40, 41, 42, 43, 44],
      [45, 46, 47, 48, 49, 50, 51, 52, 53],
      [54, 55, 56, 57, 58, 59, 60, 61, 62],
      [63, 64, 65, 66, 67, 68, 69, 70, 71],
      [72, 73, 74, 75, 76, 77, 78, 79, 80],
      [0, 9, 18, 27, 36, 45, 54, 63, 72],
      [1, 10, 19, 28, 37, 46, 55, 64, 73],
      [2, 11, 20, 29, 38, 47, 56, 65, 74],
      [3, 12, 21, 30, 39, 48, 57, 66, 75],
      [4, 13, 22, 31, 40, 49, 58, 67, 76],
      [5, 14, 23, 32, 41, 50, 59, 68, 77],
      [6, 15, 24, 33, 42, 51, 60, 69, 78],
      [7, 16, 25, 34, 43, 52, 61, 70, 79],
      [8, 17, 26, 35, 44, 53, 62, 71, 80],
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80]];

    for (var cellIndex = 0; cellIndex < 81; cellIndex++) {
      this.pens[cellIndex] = Array()
      this.cells[cellIndex] = 0
      var icellGroups = Array()
      for (var groupIndex = 0; groupIndex < 27; groupIndex++) {
        if (this.groups[groupIndex].indexOf(cellIndex) >= 0)
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
  strategyCellColor = '#a0c0a0'
  strategyUsableCellColor = '#c0a0a0'
  strategyPenColor = '#f0f010'
  selColor = '#c0c0c0'
  selOpacity = 0.6
  timerOn = false
  cellGroups = Array()


  static loadFromJson(fieldJson) {
    var gameField = new GameField()
    gameField.loadGameJson(fieldJson)
    return gameField
  }

  loadGameJson(gameJson) {
    this.clearGame()
    gameJson = JSON.parse(gameJson)
    var time =  gameJson["time"]
    if(time !== undefined && time !== ""   )
      {
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
      this.groups[groupIndex].forEach(gCellIndex => {

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
            this.timerOn = false
          this.addValueSelections(value)
        }
      }
    }
  }

  setDraw(draw) {

    this.draw = draw
    this.strategyResults = draw.group()
    this.valueSelections = draw.group()
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

      this.groups[groupIndex].forEach(gCellIndex => {
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
  var time =  $("#gametime")[0].innerText
   
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
          this.groups[groupIndex].forEach(gCellIndex => {
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




function cellClick(event) {
  var fieldWidth = event.currentTarget.clientHeight;
  var cellWidth = fieldWidth / 9;
  var colleft = event.clientX % cellWidth
  var col = (event.clientX - colleft) / cellWidth;
  var rowleft = event.clientY % cellWidth
  var row = (event.clientY - rowleft) / cellWidth;
  var newSelectedCell = row * 9 + col;
  gameField.onCellClick(newSelectedCell)
  //  alert("fuck!" + col + " " + row + " " + selectedCell )  
}


function doClick() {
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

function doNumberClick(element) {
  var isChecked = $("#penCheck").is(":checked")
  //var isChecked = penCheck.value //penCheck
  gameField.doValueClick(element.value, isChecked)

}

function onNewGameClick() {
  var levelEl = $("#level")[0]
  var level = levelEl.value
  const sudoku = window.sudoku.getSudoku(level)
  gameField.loadNewGame(sudoku)
}

function onUploadClick() {
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
 

jQuery(document).ready(function($) {
  
  let cookie_consent = getCookie("user_cookie_consent");
if(cookie_consent != ""){
    document.getElementById("cookieNotice").style.display = "none";
}else{
    document.getElementById("cookieNotice").style.display = "block";
}

var gameJson = getCookie("game")
if(gameJson !== undefined && gameJson != "" )
  {
    gameField.loadGameJson(gameJson)
  }

});

$(window).on("beforeunload", function() { 
  
  if(gameField.timerOn)
    {
      var gameJson = gameField.getGameJson()
      //setCookie(cname, cvalue, exdays)
      setCookie("game",gameJson,10)
    
    }
  //return confirm("Do you really want to close?"); 
});