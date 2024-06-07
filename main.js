import './style.css'

import jQuery from 'jquery'
window.$ = jQuery

import { onNewGameClick, cellClick } from './field.js'

document.getElementById("newgame").addEventListener('click', onNewGameClick)
document.getElementById("svgtag").addEventListener('click', cellClick)
