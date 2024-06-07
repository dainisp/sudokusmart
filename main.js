import './style.css'

import jQuery from 'jquery'
window.$ = jQuery

import { onNewGameClick, cellClick,doNumberClick,onStrategyClick,onUploadClick } from './field.js'
import {acceptCookieConsent} from "./cookies.js"

document.getElementById("newgame").addEventListener('click', onNewGameClick)
document.getElementById("svgtag").addEventListener('click', cellClick)
//$["input.numberbutton"][0].addEventListener('click',doNumberClick)
document.querySelectorAll("input.numberbutton").forEach(element => {
    element.addEventListener('click',doNumberClick)
});
document.getElementById("strategybutton").addEventListener('click', onStrategyClick)
document.getElementById("savegame").addEventListener('click', onUploadClick)
document.getElementById("cookieaccept").addEventListener('click', acceptCookieConsent)
//cookieaccept
//savegame