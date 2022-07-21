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
            var h4Element=document.querySelector('form h4')
                h4Element.innerHTML=data.message;
                Object.assign(h4Element.style, {
                    display: 'block'
                })
            setTimeout(() =>{ 
                Object.assign(h4Element.style, {
                    display: 'none'
                })
            }, 5000)
           
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
