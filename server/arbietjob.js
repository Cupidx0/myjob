var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("https://www.arbeitnow.com/api/job-board-api", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));