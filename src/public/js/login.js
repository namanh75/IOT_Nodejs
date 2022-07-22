$("form").submit(function (e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    var account = document.querySelectorAll('form input')[0].value
    var password = document.querySelectorAll('form input')[1].value
    fetch('http://localhost:4000/login',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ account: account, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message=='success') {
                window.location='/'
            }
            else{
                console.log('status:', data.message);
                document.querySelector('h5').innerHTML = data.message;
                setTimeout(function() {
                    document.querySelector('h5').innerHTML = '';
                },5000)
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });

});