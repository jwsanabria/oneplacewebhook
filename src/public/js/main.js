//const socket = io()

//const { query } = require("express");

const {token} = sessionStorage;
const socket = io.connect('http://localhost:8080', {
  query: {token: 'eyJraWQiOiJnZUNDZDZ1akRjank0U0UxSlRJRlVLQlVOVUp3aVp0XC9IT3RyY200S2dvST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzYzNjMGQxNy1kZDYwLTQ0MDAtYjNjMC1iOTZhODdiYWViODMiLCJldmVudF9pZCI6IjQ1MzkyYmJhLTMxNWItNDA0Zi1hMzg1LTgyNTdlOGEwYzJhNSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MDU2NzM5NjEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2lBUFNyZ0U2YyIsImV4cCI6MTYwNTY3NzU2MSwiaWF0IjoxNjA1NjczOTYxLCJqdGkiOiJkNGY2MzU3Mi1kY2UxLTRkZTEtODg3YS0zYzhjZDVjNWY2MGYiLCJjbGllbnRfaWQiOiIzNTcxa2drNGljbnMzaGt1aDI2ajM5OGV1ZiIsInVzZXJuYW1lIjoiM2MzYzBkMTctZGQ2MC00NDAwLWIzYzAtYjk2YTg3YmFlYjgzIn0.OhAq256yxPcneo_xdd4s9_E26euwADLpSXlXzkqIfTJR_lxJOK_12zGc--nmkRaeppcd9-gHOlaXUe5WyVy9JZ4AfCnQEMBb1EidYPnwQzt0i8HIL4tr-tI7bJDK_w7Mjdxb6ph_q1LoLadZIuwM7umN_Manj_Yhj9TC6DGUhFAt8sNPKznYmbxPb6py_cJwLjJG0QWzr9d6A2jP_sGVGJElubQUi82Aq2i4aboHF12xfQ6BzG8P88MJB8kXLx6VEZ6SstFNtf5IDWAy_raNMxsQle7JDrZfkQ1Nzqh1N2dgcD4aB89YOZa3cWLPapUqGgBU3cgS86Eu7dUiExqibw'}  
});
console.log("def socket en cliente: " + token)

socket.on('message', function (msg) {
    //Recibe json. Se espera todo el mensaje que proviene de la red social. Esto por si se requiere tomar los otros atributos (id, fecha, etc).
    if (msg) {
        console.log('Valor recibido del Socket: ');
        console.log(msg);              
        var fecha = Date.now();

        let id ="";
        let User ="";
        let Client ="";
        let Message ="";
        let SocialNetwork ="";
        let Time ="";

        let snlogo='chatwhatsapp.png';
        if(SocialNetwork == '1') 
            snlogo='chatfacebook.png';    

        //TODO: Validar si el mensaje recibido es del mismo con el de la ventana actual. Sino, deberá enviarlo a la ventana de la izquiera.
        if (true) {
            //Asignar el mensaje a cada componente del chat
            $('#messages').append('<div class=\"incoming_msg\"><div class=\"incoming_msg_img\"><img src=\"/imgs/' + snlogo + '\" alt=\"sunil\" /></div><div class=\"received_msg\"><div class=\"received_withd_msg\"><p>' + msg.Body + '</p><span class=\"time_date\">' + dateFormat(fecha, " h:MM:ss TT    |    mmmm dS") + '</span></div></div></div>');
        }
        else { }
    }
});

$('#send').on('click', function () {
    
    var mensaje = $('#myMessage').val();

    if (mensaje != '') {
        console.log('Send to Social network: ' + mensaje);
        var fecha = Date.now();        
        $('#messages').append('<div class=\"outgoing_msg\"><div class=\"sent_msg\"><p>' + mensaje + '</p><span class=\"time_date\">' + dateFormat(fecha, " h:MM:ss TT    |    mmmm dS") + '</span></div></div>');
        $('#myMessage').val('');
               
        //TODO: Capturar valores
        /*
        var mensajejson = '{'
            +'"User" : "whatsapp:+14155238886",'
            +'"Client"  : "whatsapp:+573005559718",'
            +'"Message" : "' + mensaje + '",'
            +'"SocialNetwork" : "2",'
            +'"Time" : "' + fecha + '"'
            +'}';
        */
        
        // Mensaje Whatsapp
        var objMessage = new Object();
        objMessage.User = "whatsapp:+14155238886";
        objMessage.Client = "whatsapp:+573005559718";
        objMessage.Message = mensaje;
        objMessage.SocialNetwork = "2";
        objMessage.Time = fecha;
        
       // Mensaje Facebook
       /*var objMessage = new Object();
        objMessage.User = "103063468213065";
        objMessage.Client = "4967684069923820";
        objMessage.Message = mensaje;
        objMessage.SocialNetwork = "1";
        objMessage.Time = fecha;
         */   

        console.log('Send to Social network json: ' + JSON.stringify(objMessage));
        //Enviar mensaje al back        
        console.log(socket.emit('message', objMessage));
               io.to(socketId).emit('message', message);
    }
});

//Dibuja el frame de recientes en la parte izquierda la primera vez que carga la página
function PaintRecent(id, User, Client, Message, SocialNetwork, Time) {
    console.log('pintando a ' +  Client + ", " + Time + ", " + Message);

    const d = Date.parse(Time);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);   
    let snlogo='chatwhatsapp.png';
    if(SocialNetwork == '1') 
        snlogo='chatfacebook.png';    
    
    let a = "<div class=\"chat_list\" id=\"" + id + "\"><div class=\"chat_people\"><input id=\"msg_" + id + "\" type=\"hidden\" value=\"" + id + "\" /><input id=\"" + id + "_" + SocialNetwork + "\" type=\"hidden\" value=\"" + SocialNetwork + "\" /><input id=\"" + id + "_" + User + "\" type=\"hidden\" value=\"" + User + "\" /><div class=\"chat_img\"><img src=\"/imgs/" + snlogo + "\" alt=\"sunil\" /></div><div class=\"chat_ib\"><h5>" + Client + " <span class=\"chat_date\">" + mo + " " + da + "</span></h5><p>" + Message.substring(0, 100) + "</p></div></div></div>";

    $('#InboxLeft').prepend(a);
    console.log('agreg: ' + a);
}

function LoadLeftPanel() {
    console.log('LoadLeftPanel');

    let userId = 'Oneplace1'; //TODO: Obtener el parametro
    const url = 'http://localhost:8080/contactmessages/';
    console.log('url: ', url);

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
                        PaintRecent(data[i]._id, data[i].User, data[i].Client, data[i].Message, data[i].SocialNetwork, data[i].Time);                        
                    }                    
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error -', err);
        });

}

window.onload = function() {    
    LoadLeftPanel();
  };