
  $(function () {
    $("#register-link").click(function () {
      $("#login-box").hide();
      $("#register-box").show();
    });
    $("#login-link").click(function () {
      $("#login-box").show();
      $("#register-box").hide();
    });
    $("#forgot-link").click(function () {
      $("#login-box").hide();
      $("#forgot-box").show();
    });
    $("#back-link").click(function () {
      $("#login-box").show();
      $("#forgot-box").hide();
    });
    $("#login-btn").click(function() {
        alert("Iniciar sesion")
        var url = 'http://localhost:8080/auth/login';
        var returnData = "";
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                name: $("#email").val(),
                password: $("#password").val()
            },
            async: false,
            url: url,
            error: function(request, status, error) { alert("Error en la autenticación"); },
            success: function(data) {
                //alert(JSON.stringify(data));
                //var responseAccess = JSON.stringify(data);
                alert(data.accessToken); 
                localStorage.setItem("accessToken", data.accessToken);
                window.location.href="http://localhost:8080/chatnew";
            }
        });
        return (false);
    });
  });