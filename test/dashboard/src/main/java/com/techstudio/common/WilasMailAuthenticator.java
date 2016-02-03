package com.techstudio.common;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;


class WilasMailAuthenticator extends Authenticator {
     String user;
     String pw;
     public WilasMailAuthenticator (String username, String password)
     {
        super();
        this.user = username;
        this.pw = password;
     }
    public PasswordAuthentication getPasswordAuthentication()
    {
       return new PasswordAuthentication(user, pw);
    }
}