const port = 5502
const scoreRankTableBody = document.getElementById('scoreRankBody');
const postScore = async (name, score) => {
  let data;
  try {
    data = await axios.post(`http://localhost:${port}/post_score`, {
      name: name,
      score: score
    })
    window.location.href='/';
  } catch (e) {
    console.error(e)
  } finally {
    console.log('finally', data)
  }
}

const getScore = async () => {
  let result;
  try {
    result = await axios.get(`http://localhost:${port}/get_score`)
    if(result){
      result.data.rows.forEach(row =>{
        let tr = document.createElement('tr');
        scoreRankTableBody.appendChild(tr)
        let td_name = document.createElement("td");
        let td_score = document.createElement("td");
        td_name.innerText = row.username
        td_score.innerText = row.score
        tr.appendChild(td_name)
        tr.appendChild(td_score)
      })
    }
  } catch (e) {
    console.error(e)
  }
}

export {port, scoreRankTableBody, postScore, getScore}
