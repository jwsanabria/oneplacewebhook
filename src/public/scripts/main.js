const socket = io()

//Get time
var currentdate = new Date(); 
    var datetime = "Now: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

// socket.emit('message', 'hello')

// Current User Chat left 

// Curretn user messagess right
socket.on('message', function (msg) {
    $('#messages').append('<div class=\"incoming_msg\"><div class=\"incoming_msg_img\"><img src=\"https://ptetutorials.com/images/user-profile.png\" alt=\"sunil\" /></div><div class=\"received_msg\"><div class=\"received_withd_msg\"><p>' + msg + '</p><span class=\"time_date\"> 11:01 AM    |    June 9</span></div></div></div>')
})

$('#send').on('click', function () {
    console.log('Send')
    socket.send($('#myMessage').val());
    $('#messages').append('<div class=\"outgoing_msg\"><div class=\"sent_msg\"><p>' + $('#myMessage').val() + '</p><span class=\"time_date\"> 11:01 AM    |    Today</span></div></div>')
    $('#myMessage').val('');
})