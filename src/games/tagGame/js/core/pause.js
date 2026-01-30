import {globalGameSettings} from '../config'

let pauseBtn = document.querySelector('.pause-btn')
let buttonsReset = document.querySelectorAll('.reset')                               

pauseBtn.addEventListener('click', function(event){
   event.stopPropagation()
   globalGameSettings.pause = !globalGameSettings.pause
   if(globalGameSettings.pause){
      pauseBtn.classList.add('pause-btn-colorRed')
      pauseBtn.innerHTML = '&#9654' 
      globalGameSettings.pause = true
      buttonsReset.forEach(button  => {
      button.disabled = true;
   })
   } else {
      pauseBtn.classList.remove('pause-btn-colorRed')
      pauseBtn.innerHTML = '&#10074;&#10074;' 
      globalGameSettings.pause = false
      buttonsReset.forEach(button  => {
      button.disabled = false;
   })
   }
})

