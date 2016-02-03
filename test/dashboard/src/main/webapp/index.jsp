<%
    String redirectURL = "main.wilas";
    RequestDispatcher rd = request.getRequestDispatcher(redirectURL);
    rd.forward(request, response);
%>