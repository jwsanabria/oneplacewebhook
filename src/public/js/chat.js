function getchat(userId, SocialNetwork, Client){

    let snlogo='chatwhatsapp.png';
    if(SocialNetwork == '1') 
        snlogo='chatfacebook.png';
    
    $(".msg_history").empty();
    
    $.get("https://oneplacewebhook.herokuapp.com/"+SocialNetwork+"/"+userId+"/"+Client+"", function(data, status){
        console.clear();
        if(status != 'success'){
            alert("Pasó esto cuando me quería conectar "+status)
        }
        //console.log(status);
        data.forEach(chat => {
            if(chat.MessageType == 1){
                $('#messages').append('<div class=\"incoming_msg\"><div class=\"incoming_msg_img\"><img src=\"/imgs/' + snlogo + '\" alt=\"sunil\" /></div><div class=\"received_msg\"><div class=\"received_withd_msg\"><p>' + chat.Message + '</p><span class=\"time_date\">' + dateFormat(chat.Time, " h:MM:ss TT    |    mmmm dS") + '</span></div></div></div>');
            }else{
                $('#messages').append('<div class=\"outgoing_msg\"><div class=\"sent_msg\"><p>' + chat.Message + '</p><span class=\"time_date\">' + dateFormat(chat.Time, " h:MM TT    |    mmmm dS") + '</span></div></div>');
            }
        });
    });

    $("#messages").scrollTop(9999); 
}

