//temperature
fetch('http://localhost:4000/api/data')
    .then(response => response.json())
    .then(data => {
        var dom = document.querySelector('.temperature #container');
        var myChart = echarts.init(dom, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        for (var i = 0; i < 7; i++) {
            if (data[i]) {

            }
            else {
                data[i] = '0'
            }

        }
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [data[6].temperature, data[5].temperature, data[4].temperature, data[3].temperature, data[2].temperature, data[1].temperature, data[0].temperature],
                    type: 'line'
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    });

//humidity
fetch('http://localhost:4000/api/data')
    .then(response => response.json())
    .then(data => {
        var dom = document.querySelector('.humidity #container');
        var myChart = echarts.init(dom, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        for (var i = 0; i < 7; i++) {
            if (data[i]) {

            }
            else {
                data[i] = '0'
            }

        }
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [data[6].humidity, data[5].humidity, data[4].humidity, data[3].humidity, data[2].humidity, data[1].humidity, data[0].humidity],
                    type: 'line'
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    });
//tds
fetch('http://localhost:4000/api/data')
    .then(response => response.json())
    .then(data => {
        var dom = document.querySelector('.tds #container');
        var myChart = echarts.init(dom, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        for (var i = 0; i < 7; i++) {
            if (data[i]) {

            }
            else {
                data[i] = '0'
            }

        }
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [data[6].fire, data[5].fire, data[4].fire, data[3].fire, data[2].fire, data[1].fire, data[0].fire],
                    type: 'line'
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    });
//pH
fetch('http://localhost:4000/api/data')
    .then(response => response.json())
    .then(data => {
        var dom = document.querySelector('.ph #container');
        var myChart = echarts.init(dom, 'dark', {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        for (var i = 0; i < 7; i++) {
            if (data[i]) {

            }
            else {
                data[i] = '0'
            }

        }
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [data[6].gas, data[5].gas, data[4].gas, data[6].gas, data[2].gas, data[1].gas, data[0].gas],
                    type: 'line'
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    });

