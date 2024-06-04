

jQuery(document).ready(function($) {
    
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

});




