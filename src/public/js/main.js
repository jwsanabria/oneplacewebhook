
const socket = io()

socket.on('message', function (msg) {
    //Recibe json. Se espera todo el mensaje que proviene de la red social. Esto por si se requiere tomar los otros atributos (id, fecha, etc).
    if (msg) {
        console.log('Valor recibido del Socket: ');
        console.log(msg);              
        var fecha = Date.now();

        //TODO: Validar si el mensaje recibido es del mismo con el de la ventana actual. Sino, deberá enviarlo a la ventana de la izquiera.
        if (true) {
            //Asignar el mensaje a cada componente del chat
            $('#messages').append('<div class=\"incoming_msg\"><div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\" alt=\"sunil\" /></div><div class=\"received_msg\"><div class=\"received_withd_msg\"><p>' + msg.Body + '</p><span class=\"time_date\">' + dateFormat(fecha, " h:MM:ss TT    |    mmmm dS") + '</span></div></div></div>');
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

        //Enviar mensaje al back        
        console.log(socket.emit('message', mensaje));
    }
})