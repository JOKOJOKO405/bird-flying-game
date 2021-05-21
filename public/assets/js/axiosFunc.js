const port = 5502
const scoreRankTableBody = document.getElementById('scoreRankBody');

const sanitize = (str) => {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const decode = (str) => {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
}

const postScore = async (name, score) => {
  let data;
  const sanitizedName = sanitize(name)
  try {
    data = await axios.post('/post_score', {
      name: sanitizedName,
      score: score
    })
    window.location.href='/score';
  } catch (e) {
    console.error(e)
  } finally {
    console.log('finally', data)
  }
}

const getScore = async () => {
  let result;
  try {
    result = await axios.get('/get_score')
    if(result){
      result.data.rows.forEach(row =>{
        let tr = document.createElement('tr');
        scoreRankTableBody.appendChild(tr)
        let td_name = document.createElement("td");
        let td_score = document.createElement("td");
        td_name.innerText = decode(row.username)
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
