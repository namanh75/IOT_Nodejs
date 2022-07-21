fetch('http://localhost:4000/login/check')
  .then(response => response.json())
  .then(data =>{
    if(data.login=='true'){
        document.querySelector('.login').innerHTML=data.account.username
        // console.log(document.querySelector('.login'))
        document.querySelector('.alogin').href='/information'
    }
  })