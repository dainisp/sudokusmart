
export class StrategyFinder {
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
      this.strategyNames[10] = "XYZWing"
      this.strategyNames[11] = "XWing"
      this.strategyNames[12] = "WWing"
      this.strategyNames[13] = "FinXWing"

      
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
  
        for (var  tripleIndex = 0; tripleIndex < 3; tripleIndex++) {
          var trippleRows = Array()
          for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {
  
            if (boxData[boxDataIndex].indexOf(tripleIndex) >= 0) {
              trippleRows.push(boxDataIndex)
            }
  
          }
  
          if (trippleRows.length == 1) {
            var trippleRow = trippleRows[0]
            if(boxData[trippleRow].length > 1)
              {
                
                var groupCells = this.groups[boxOffset*3+trippleRow]
               for(var searchCellIndex=tripleIndex*3;searchCellIndex<(tripleIndex+1)*3;searchCellIndex++)
                {
                  var searchCell = groupCells[searchCellIndex]
                  if(this.pens[searchCell].indexOf(pen) >=0 )
                     this.strategyCells.push(searchCell)    
                }
              for(var searchBoxIndex=0;searchBoxIndex<boxData[trippleRow].length;searchBoxIndex++)
                {
                  var searchTriple = boxData[trippleRow][searchBoxIndex]
                   if(searchTriple != tripleIndex )
                    {
                      
                      for(var searchCellIndex=searchTriple*3;searchCellIndex<(searchTriple+1)*3;searchCellIndex++)
                        {
                          var searchCell = groupCells[searchCellIndex]
                          if(this.pens[searchCell].indexOf(pen)>=0)
                            {
                             this.strategyUsableCells.push(searchCell)
                             this.strategyPens[searchCell] = [pen]
                             return 2    
                            }
                          }
                    }
  
                }
  
            }
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
  
       
        for (var  tripleIndex = 0; tripleIndex < 3; tripleIndex++) {
          var trippleRows = Array()
          for (var boxDataIndex = 0; boxDataIndex < 3; boxDataIndex++) {
  
            if (boxData[boxDataIndex].indexOf(tripleIndex) >= 0) {
              trippleRows.push(boxDataIndex)
            }
  
          }
  
          if (trippleRows.length == 1) {
            var trippleRow = trippleRows[0]
            if(boxData[trippleRow].length > 1)
              {
                
                var groupCells = this.groups[9+boxOffset*3+trippleRow]
               for(var searchCellIndex=tripleIndex*3;searchCellIndex<(tripleIndex+1)*3;searchCellIndex++)
                {
                  var searchCell = groupCells[searchCellIndex]
                  if(this.pens[searchCell].indexOf(pen) >=0 )
                     this.strategyCells.push(searchCell)    
                }
              for(var searchBoxIndex=0;searchBoxIndex<boxData[trippleRow].length;searchBoxIndex++)
                {
                  var searchTriple = boxData[trippleRow][searchBoxIndex]
                   if(searchTriple != tripleIndex )
                    {
                      
                      for(var searchCellIndex=searchTriple*3;searchCellIndex<(searchTriple+1)*3;searchCellIndex++)
                        {
                          var searchCell = groupCells[searchCellIndex]
                          if(this.pens[searchCell].indexOf(pen)>=0)
                            {
                             this.strategyUsableCells.push(searchCell)
                             this.strategyPens[searchCell] = [pen]
                             return 2    
                            }
                          }
                    }
  
                }
  
            }
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
          var mustReturn = false
          penCells.forEach(cellIndex => {
            if (!mustReturn &&  this.hiddenNakedSelectedCells.indexOf(cellIndex) < 0) {
              this.pens[cellIndex].forEach(pen => {
                if ( !mustReturn &&  selectedPens.indexOf(pen) >= 0   ) {
                  this.hiddenNakedSelectedCells.forEach(strategyCell => {
                    this.strategyCells.push(strategyCell)
                  });
                  this.strategyUsableCells.push(cellIndex)
                  var cellPens = Array()
                  cellPens.push(pen)
                  this.strategyPens[cellIndex] = cellPens
                  mustReturn = true
                  return 3 + (this.hiddenNakedSelectedCells.length - 2) * 2 + Number(this.hiddenNakedIsHidden)
                }
              });
            }
          });
          if(mustReturn)
            return 3 + (this.hiddenNakedSelectedCells.length - 2) * 2 + Number(this.hiddenNakedIsHidden)
            
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
  
          
          var onlySelectedPens = Array()
          selectedPens.forEach(pen => {
            if (unSelectedPens.indexOf(pen) < 0) {
              onlySelectedPens.push(pen)
            }
          });
  
          if (onlySelectedPens.length == this.hiddenNakedSelectedCells.length) {
            /*
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
  */       
           var usedPen = undefined
            this.hiddenNakedIsHidden = true
            this.strategyCells = this.hiddenNakedSelectedCells
          var usedCell =  this.hiddenNakedSelectedCells.find(cellIndex => {
            usedPen = this.pens[cellIndex].find((value)=>{
                return onlySelectedPens.indexOf(value) < 0
              })
             return usedPen !== undefined 
            });
          if(usedCell !== undefined && usedPen !== undefined )
            {
              this.strategyPens[usedCell] = [usedPen]
            }  
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
                  && this.isCellsLinked(cellIndex, gSecondCellIndex) >=0 ) {
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
          if (retVal >= 0)
            return retVal
        });
  
      });
      return retVal
    }
  
  
  
  
    getXYZWing(cellIndex)
    {
      var cellPens=this.pens[cellIndex]
      for(var firstCellIndex=0;firstCellIndex<80;firstCellIndex++)
        {
         if(firstCellIndex != cellIndex && this.pens[firstCellIndex].length == 2 
          &&  cellPens.indexOf( this.pens[firstCellIndex][0]) >=0
          &&  cellPens.indexOf( this.pens[firstCellIndex][1]) >=0
          )
          {
    for (var secondCellIndex=firstCellIndex+1;secondCellIndex<81;secondCellIndex++)
      {
        if(secondCellIndex != cellIndex && secondCellIndex != firstCellIndex 
          && this.pens[secondCellIndex].length == 2 
          &&  cellPens.indexOf( this.pens[secondCellIndex][0]) >=0
          &&  cellPens.indexOf( this.pens[secondCellIndex][1]) >=0
          && (this.pens[firstCellIndex].indexOf(this.pens[firstCellIndex][0])<0 
          ||   this.pens[firstCellIndex].indexOf(this.pens[firstCellIndex][1])<0  ) 
        )
        {
          var penCommon = undefined
          var penFirst = undefined
          var penSecond = undefined
         if(this.pens[firstCellIndex][0] == this.pens[secondCellIndex][0]
           && this.pens[firstCellIndex][0] != this.pens[secondCellIndex][1]   )
    {
       penCommon =  this.pens[firstCellIndex][0]
       penFirst = this.pens[firstCellIndex][1]
       penSecond = this.pens[secondCellIndex][1] 
    }
    
    else if(this.pens[firstCellIndex][1] == this.pens[secondCellIndex][0]
      && this.pens[firstCellIndex][1] != this.pens[secondCellIndex][1]   )
    {
    penCommon =  this.pens[firstCellIndex][1]
    penFirst = this.pens[firstCellIndex][0]
    penSecond = this.pens[secondCellIndex][1] 
    }
    
    else if(this.pens[secondCellIndex][0] == this.pens[firstCellIndex][0]
      && this.pens[secondCellIndex][0] != this.pens[firstCellIndex][1]
      )
      {
          penCommon = this.pens[firstCellIndex][0]
          penFirst = this.pens[secondCellIndex][0]
          penSecond = this.pens[firstCellIndex][1]
    
      }
    
     else if(this.pens[secondCellIndex][1] == this.pens[firstCellIndex][0]
        && this.pens[secondCellIndex][1] != this.pens[firstCellIndex][1]
        )
        {
            penCommon = this.pens[firstCellIndex][0]
            penFirst = this.pens[secondCellIndex][1]
            penSecond = this.pens[firstCellIndex][1]
      
        }
      
      if(penCommon != undefined)
        {
          var linkedCells = [cellIndex,firstCellIndex,secondCellIndex]
          var linkedCell = this.getLinkedCell(linkedCells,penCommon,linkedCells)
          if(linkedCell>=0)
            {
              this.strategyCells = linkedCells
              this.strategyUsableCells = [linkedCell]
              this.strategyPens[linkedCell] = [penCommon]
              return 10 
            }
    
        }
    
    
    
        }
      }
    
          }
        
    
    
        }
      return -1
    
    }
  
    findCellLinkByPen(cellIndex,pen,exceptionCells)
    {
      var retVal = Array()
      for(var cellGroupsIndex in this.cellGroups[cellIndex])
        {
            var groupIndex = this.cellGroups[cellIndex][cellGroupsIndex]
            var groupCells = this.groups[groupIndex]
            for(var gCellIndex=0;gCellIndex<9;gCellIndex++)
            {
             var firstCellIndex = groupCells[gCellIndex] 
               if( (exceptionCells === undefined || exceptionCells.indexOf(firstCellIndex) < 0  )
               && this.pens[firstCellIndex].indexOf(pen) >=0 
              && firstCellIndex != cellIndex 
              && retVal.indexOf(firstCellIndex) < 0  )
                  {
                    retVal.push(firstCellIndex)
                       
                  }
  
            }
           
        }
        return retVal
    }
  
    getWWing(cellIndex)
    {
     var firstPens = this.pens[cellIndex]
    for(var otherCellIndex=cellIndex+1;otherCellIndex<81;otherCellIndex++)
      {
        if(this.pens[otherCellIndex].length == 2 && firstPens.indexOf( this.pens[otherCellIndex][0])>=0
        && firstPens.indexOf( this.pens[otherCellIndex][1])>=0  )
        {
          var pen = firstPens[0]
          var firstCells = this.findCellLinkByPen(cellIndex,pen)
          var secondCells = this.findCellLinkByPen(otherCellIndex,pen,firstCells)
          for(var firstCellIndex=0;firstCellIndex<firstCells.length;firstCellIndex++)
            {
              var firstCell = firstCells[firstCellIndex]
              for(var secondCellIndex=0;secondCellIndex<secondCells.length;secondCellIndex++)
                {
                  var secondCell = secondCells[secondCellIndex]
                  if(firstCell != secondCell){
                  var linkGroup = this.isCellsLinked(firstCell,secondCell) 
                    if(linkGroup >=0 )
                      {
                      var searchHard =  this.groups[linkGroup].find((linkcellIndex)=>{
                          if(linkcellIndex != firstCell  
                            && linkcellIndex != secondCell 
                          && this.pens[linkcellIndex].indexOf(pen)>=0)
                           return true  
                        })
                      if(searchHard === undefined )
                        {
                         var searchLinked = [cellIndex,otherCellIndex]
                         var exceptionCells = [firstCell,secondCell]
                       var linkedCell =  this.getLinkedCell(searchLinked,firstPens[1],exceptionCells)   
                         if(linkedCell >=0 )
                          {
                             this.strategyCells = [cellIndex,otherCellIndex,firstCell,secondCell]
                             this.strategyUsableCells = [linkedCell]
                             this.strategyPens[linkedCell] = [firstPens[1]]
                             this.strategyPens[firstCell] = [pen]
                             this.strategyPens[cellIndex] = [pen]
                             this.strategyPens[otherCellIndex] = [pen]
                             this.strategyPens[secondCell] = [pen]
  
                              return 12
                          }
                        }
  
                      }
                    }
                    
                }
            }
            
            var pen = firstPens[1]
            var firstCells = this.findCellLinkByPen(cellIndex,pen)
          var secondCells = this.findCellLinkByPen(otherCellIndex,pen,firstCells)
          for(var firstCellIndex=0;firstCellIndex<firstCells.length;firstCellIndex++)
            {
              var firstCell = firstCells[firstCellIndex]
              for(var secondCellIndex=0;secondCellIndex<secondCells.length;secondCellIndex++)
                {
                  var secondCell = secondCells[secondCellIndex]
                  if(firstCell != secondCell){
                  var linkGroup = this.isCellsLinked(firstCell,secondCell) 
                    if(linkGroup >=0 )
                      {
                      var searchHard =  this.groups[linkGroup].find((linkcellIndex)=>{
                          if(linkcellIndex != firstCell  
                            && linkcellIndex != secondCell 
                          && this.pens[linkcellIndex].indexOf(pen)>=0)
                           return true  
                        })
                      if(searchHard === undefined )
                        {
                         var searchLinked = [cellIndex,otherCellIndex]
                         var exceptionCells = [firstCell,secondCell]
                       var linkedCell =  this.getLinkedCell(searchLinked,firstPens[0],exceptionCells)   
                         if(linkedCell >=0 )
                          {
                             this.strategyCells = [cellIndex,otherCellIndex,firstCell,secondCell]
                             this.strategyUsableCells = [linkedCell]
                             this.strategyPens[linkedCell] = [firstPens[0]]
                             this.strategyPens[firstCell] = [pen]
                             this.strategyPens[cellIndex] = [pen]
                             this.strategyPens[otherCellIndex] = [pen]
                             this.strategyPens[secondCell] = [pen]
  
                              return 12
                          }
                        }
  
                      }
                    }
                    
                }
            }
            
  
  
  
  
  
            
        }
      }
    }
  

getFinXWing(groupIndex)
{
  var penCounts = this.penCounts(groupIndex);
  if(groupIndex<9) {
    var pensFound = penCounts.find((penCells,pen)=>{
        if(penCells !== undefined && penCells.length ==2 )
            {
                var firstCol = penCells[0]%9
                var secondCol = penCells[1]%9
                for (var secondGroupIndex = 0; secondGroupIndex < 9; secondGroupIndex++)
                     {
                       var secondPenCounts = this.penCounts(secondGroupIndex) 
                       if (secondPenCounts[pen] != undefined
                         && secondPenCounts[pen].length == 3) 
                        {
                            // var otherFound = secondPenCounts.find(())

                            for (var firstColIndex = 0; firstColIndex < 2; firstColIndex++) {
                                for (var secondColIndex = 1; secondColIndex < 3; secondColIndex++) {
                                    if (secondPenCounts[pen][firstColIndex] % 9 == firstCol && secondPenCounts[pen][secondColIndex] % 9 == secondCol) {
                                        var fiftCellIndex = -1;
                                        for (var i = 0; i < 3; i++) {
                                            if (i != firstColIndex && i != secondColIndex) {
                                                fiftCellIndex = secondPenCounts[pen][i];
                                                break;
                                            }
                                        }
                                        var exceptList = Array()
                                        exceptList.push(penCounts[pen][0]);
                                        exceptList.push(penCounts[pen][1]);
                                        exceptList.push(secondPenCounts[pen][0]);
                                        exceptList.push(secondPenCounts[pen][1]);
                                        exceptList.push(secondPenCounts[pen][2]);
                                        var squareGroupIndex = this.findSquareGroup(fiftCellIndex)
                                        var searchFift = this.groups[squareGroupIndex].find ( (searchCellIndex) =>  {
                                            if (exceptList.indexOf(searchCellIndex) <0  && this.pens[searchCellIndex].indexOf(pen)>=0) {
                                                if (this.groups[firstCol + 9].indexOf(searchCellIndex) >=0 || this.groups[secondCol + 9].indexOf(searchCellIndex)>=0) {
                                                    this.strategyCells = exceptList
                                                    this.strategyUsableCells = [searchCellIndex]
                                                    this.strategyPens[searchCellIndex] = [pen]
                                                    return true;
                                                }
                                            }
      
                                        })
                                        
                                            return searchFift !== undefined
      


                                    }
                                }
                            }

                        }
                       
                }
            }
         
    })  
   if(pensFound !== undefined )
      return 13
  }
  return -1
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
  
    findXYZWing()
    {
      for (var cellIndex = 0; cellIndex < 81; cellIndex++)
        {
          if(this.pens[cellIndex].length == 3)
           { 
         var retVal = this.getXYZWing(cellIndex)
          if(retVal>=0)
            return retVal 
           } 
        }
   
        return -1
    }
     
  
  
    findXWing()
    {
     for(var groupIndex=0;groupIndex<7;groupIndex++)
      {
        var penCounts = this.penCounts(groupIndex)
       for( var pen = 1;pen<=9;pen++ )
        {
       var    penCells = penCounts[pen]
           if(penCells !== undefined && penCells.length==2)
            {
              for(var otherGroupIndex=groupIndex+1;otherGroupIndex<8;otherGroupIndex++)
                {
                 var otherCells = this.groups[otherGroupIndex]
                 var firstCol =  penCells[0]%9
                 var secondCol =  penCells[1]%9 
             var otherCell =  otherCells.find((otherCell)=>{
              if(otherCell%9 == firstCol || otherCell%9 == secondCol)
                {
                   
                      return this.pens[otherCell].indexOf(pen) < 0
                       
                }else
                {
                  
                    return this.pens[otherCell].indexOf(pen) >= 0
                }    
               })
              if(otherCell == undefined )
                {
                  var checkGroup = 9 + firstCol
                  var usableCell = this.groups[checkGroup].find((usableCell)=>{
                    return (usableCell - usableCell%9)/9 != groupIndex && (usableCell - usableCell%9)/9 != otherGroupIndex
                      && this.pens[usableCell].indexOf(pen) >=0
                  })  
                  if(usableCell >=0 )
                    {
                      
                      this.strategyCells = [penCells[0],penCells[1]
                      ,otherGroupIndex*9 + firstCol
                      ,otherGroupIndex*9 + secondCol
                    ]
                    this.strategyUsableCells = [usableCell]
                    this.strategyPens[usableCell] = [pen]
                    return 11
                    }
  
                     checkGroup = 9 + secondCol
                   usableCell = this.groups[checkGroup].find((usableCell)=>{
                    return (usableCell - usableCell%9)/9 != groupIndex && (usableCell - usableCell%9)/9 != otherGroupIndex
                      && this.pens[usableCell].indexOf(pen) >=0
                  })  
                  if(usableCell >=0 )
                    {
                      
                      this.strategyCells = [penCells[0],penCells[1]
                      ,otherGroupIndex*9 + firstCol
                      ,otherGroupIndex*9 + secondCol
                    ]
                    this.strategyUsableCells = [usableCell]
                    this.strategyPens[usableCell] = [pen]
                    return 11
                    }
  
                } 
              
  
                 
  
                }
  
            }  
  
        }
  
      }
  
  
  
  //-------------------------------
      for( var groupIndex=9;groupIndex<17;groupIndex++)
        {
          var penCounts = this.penCounts(groupIndex)
         for( var pen = 1;pen<=9;pen++ )
          {
          var  penCells = penCounts[pen]
             if(penCells !== undefined && penCells.length==2)
              {
                for(var otherGroupIndex=groupIndex+1;otherGroupIndex<18;otherGroupIndex++)
                  {
                   var otherCells = this.groups[otherGroupIndex]
                   var firstCol =  (penCells[0] - penCells[0]%9)/9
                   var secondCol = ( penCells[1] - penCells[1]%9)/9 
               var otherCell =  otherCells.find((otherCell)=>{
                if((otherCell - otherCell%9)/9 == firstCol || (otherCell - otherCell%9)/9 == secondCol)
                  {
                     
                        return this.pens[otherCell].indexOf(pen) < 0
                         
                  }else
                  {
                    
                      return this.pens[otherCell].indexOf(pen) >= 0
                  }    
                 })
                if(otherCell == undefined )
                  {
                    var checkGroup =  firstCol
                    var usableCell = this.groups[checkGroup].find((usableCell)=>{
                      return usableCell%9 != groupIndex-9 && usableCell%9 != otherGroupIndex-9
                        && this.pens[usableCell].indexOf(pen) >=0
                    })  
                    if(usableCell >=0 )
                      {
                        
                        this.strategyCells = [penCells[0],penCells[1]
                        ,otherGroupIndex-9 + firstCol*9
                        ,otherGroupIndex-9 + secondCol*9
                      ]
                      this.strategyUsableCells = [usableCell]
                      this.strategyPens[usableCell] = [pen]
                      return 11
                      }
  
                       checkGroup = secondCol
                       usableCell = this.groups[checkGroup].find((usableCell)=>{
                        return usableCell%9 != groupIndex-9 && usableCell%9 != otherGroupIndex-9
                          && this.pens[usableCell].indexOf(pen) >=0
                      })  
                      if(usableCell >=0 )
                        {
                          
                          this.strategyCells = [penCells[0],penCells[1]
                          ,otherGroupIndex-9 + firstCol*9
                          ,otherGroupIndex-9 + secondCol*9
                        ]
                        this.strategyUsableCells = [usableCell]
                        this.strategyPens[usableCell] = [pen]
                        return 11
                        }
    
                  } 
                
    
                   
    
                  }
    
              }  
    
          }
    
        }
  
  
    }
  
    findWWing()
  {
    for(var cellIndex=0;cellIndex<80;cellIndex++)
      {
        if(this.pens[cellIndex].length == 2)
          {
            var result = this.getWWing(cellIndex)
            if(result>=0)
              return result
  
          }
      }
  }
  findFinXWing()
  {
    for(var groupIndex=0;groupIndex<9;groupIndex++)
        {
          var  result = this.getFinXWing(groupIndex)
            if(result>=0)
                return result 
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
  
      result = this.findXYZWing()
      if (result >= 0)
        return result
  
       result = this.findXWing()
      if (result >= 0)
        return result
  
     result = this.findWWing()
  if (result >= 0)
    return result
    
  result = this.findFinXWing()
  if (result >= 0)
    return result

      return result
    }

    findSquareGroup(cellIndex)
  {
   return  this.cellGroups[cellIndex].find((groupIndex)=>{
         return groupIndex>17
     })
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
            if (allLinksFound) {
              var lcellGroups = this.cellGroups[lcellIndex]
              var curentCellLinkFound = false
              lcellGroups.forEach(groupIndex => {
                if (!curentCellLinkFound && currentCellGroups.indexOf(groupIndex) >= 0) {
                  curentCellLinkFound = true
  
                }
              })
              if (!curentCellLinkFound)
                allLinksFound = false
            }
          });
          if (allLinksFound)
            return cellIndex
  
        }
      }
  
      return -1
  
    }
  
    isCellsLinked(firstCellIndex, secondCellIndex) {
      var firstGroups = this.cellGroups[firstCellIndex]
      var secondGroups = this.cellGroups[secondCellIndex]
      for (var groupIndex = 0; groupIndex < firstGroups.length; groupIndex++) {
        if (secondGroups.indexOf(firstGroups[groupIndex]) >= 0)
          return firstGroups[groupIndex]
      }
      return -1
    }
  
  }
  