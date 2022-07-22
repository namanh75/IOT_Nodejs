document.querySelector('form').addEventListener('submit', Submit)
function Submit(e) {
    e.preventDefault()
    var data = {
        account: document.querySelector('form .account input').value,
        password: document.querySelector('form .password input').value,
        username: document.querySelector('form .name input').value
    }
    fetch(e.target.action, {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data.message);
            var h4Element = document.querySelector('form h4')
            h4Element.innerHTML = data.message;
            Object.assign(h4Element.style, {
                display: 'block'
            })
            setTimeout(() => {
                Object.assign(h4Element.style, {
                    display: 'none'
                })
            }, 5000)

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
fetch('http://localhost:4000/api/data')
    .then(response => response.json())
    .then(data => {
        var datas = data
        var pFire = ''; var iFire = 0
        var pGas = ''; var iGas = 0
        var pHot = ''; var iHot = 0
        for (var i = 0; i < datas.length; i++) {
            if (datas[i].warn == 'fire') {
                pFire += `<p> Lần ${++iFire} : ${data[i].createdAt.substr(0, 10)} lúc ${data[i].createdAt.substr(11, 8)}</p>`
            }
            if (datas[i].warn == 'gas') {
                pGas += `<p> Lần ${++iGas} : ${data[i].createdAt.substr(0, 10)} lúc ${data[i].createdAt.substr(11, 8)}</p>`
            }
            if (datas[i].warn == 'hot') {
                pHot += `<p> Lần ${++iHot} : ${data[i].createdAt.substr(0, 10)} lúc ${data[i].createdAt.substr(11, 8)}</p>`
            }
        }
        if (pFire == '') document.querySelector('.warning-fire').innerHTML = `<p>Không có cảnh báo</p>`
        else document.querySelector('.warning-fire').innerHTML = pFire
        if (pGas == '') document.querySelector('.warning-gas').innerHTML = `<p>Không có cảnh báo</p>`
        else document.querySelector('.warning-gas').innerHTML = pGas
        if (pHot == '') document.querySelector('.warning-hot').innerHTML = `<p>Không có cảnh báo</p>`
        else document.querySelector('.warning-hot').innerHTML = pHot
    })
