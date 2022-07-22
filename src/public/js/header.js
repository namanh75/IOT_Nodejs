fetch('http://localhost:4000/login/check')
  .then(response => response.json())
  .then(data =>{
    if(data.login=='true'){
        document.querySelector('.login').innerHTML=data.account.username
        // console.log(document.querySelector('.login'))
        document.querySelector('.alogin').href='/information'
    }
  })
// setInterval(function() {
//   fetch('http://localhost:4000/api/data')
//   .then( response => response.json())
//   .then( data =>{
//     var datas =data
//     console.log(datas[0])
//     if(datas[0].warn == 'fire'){
//       Object.assign(document.querySelector('.fire').style, {
//         display: 'block'
//       })
//     }
//     else if(datas[0].warn == 'gas'){
//       Object.assign(document.querySelector('.gas').style,{
//         display: 'block'
//       })
//     }
//     else if(datas[0].warn == 'hot'){
//       Object.assign(document.querySelector('.hot').style,{
//         display: 'block'
//       })
//     }
//     else{
//       Object.assign(document.querySelector('.fire').style,{
//         display: 'none'
//       })
//       Object.assign(document.querySelector('.gas').style,{
//         display: 'none'
//       })
//     }
//   })
// }, 5000)