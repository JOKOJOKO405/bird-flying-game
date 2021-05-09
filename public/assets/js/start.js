import * as use from './axiosFunc.js'

document.activeElement.blur()

const gameStart = document.getElementById('start_game')

gameStart.addEventListener('click', (e) => {
  e.preventDefault()
  window.location.href='/game'
})

window.onload = () => {
  use.getScore();
}