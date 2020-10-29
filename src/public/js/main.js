/*
const socket = io()

document.cookie = "UserId=5";

socket.on('message', function (msg) {
    //Recibe json
    var objjson = JSON.parse(msg);
    var fecha = Date.now();

    //Dividir el json para cada parte del mensaje

    //Asignar el mensaje a cada componente del chat
    $('#messages').append('<div class=\"incoming_msg\"><div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\" alt=\"sunil\" /></div><div class=\"received_msg\"><div class=\"received_withd_msg\"><p>' + objjson.Body + '</p><span class=\"time_date\">' + dateFormat(fecha, " h:MM:ss TT    |    mmmm dS") + '</span></div></div></div>')
})
*/

//Dibuja el frame de recientes en la parte izquierda
function PaintRecent(From, Date1, Body) {
    console.log('pintando a ' +  From + ", " + Date1 + ", " + Body);

    const d = Date.parse(Date1);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    //console.log(`${da}-${mo}-${ye}`);
    let a = "<div class=\"chat_list\"><div class=\"chat_people\"><div class=\"chat_img\"> <img src=\"https://ptetutorials.com/images/user-profile.png\" alt=\"sunil\"> </div><div class=\"chat_ib\"><h5>" + From + " <span class=\"chat_date\">" + mo + " " + da + "</span></h5><p>" + Body.substring(0, 100) + "</p></div></div></div>";

    $('#InboxLeft').prepend(a);
    console.log('agreg: ' + a);
}

function cargar() {

    const url = 'http://localhost:8080/leftmessages/1';
    console.log('url: ', url);

    /*
    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    console.log('status: ', request.status);


    if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        let option;
        for (let i = 0; i < data.length; i++) {
            PaintRecent(data[i].From, data[i].To, data[i].Body);
        }
    } else {
        // Reached the server, but it returned an error
        console.log('3');
    }

*/

    fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.warn('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response  
                response.json().then(function (data) {
                    let option;

                    console.log('data.: ', data);
                    console.log('data.: ', data.length);

                    $('#InboxLeft').empty();

                    for (let i = 0; i < data.length; i++) {
                        PaintRecent(data[i].To, data[i].Hour, data[i].Body);                        
                    }
                    
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error -', err);
        });

}

