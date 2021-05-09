import * as use from './axiosFunc.js'

const gameStart = document.getElementById('start_game')

gameStart.addEventListener('click', (e) => {
  e.preventDefault()
  window.location.href='/game'
})