package com.techstudio.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtil {
    public static String encrypt(String text) {
        return encrypt(text, true);
    }
    
    /**
     * hash 2 times!
     * @param text
     * @param repeat
     * @return
     */
    private static String encrypt(String text, boolean repeat) {
        String result = "";
        MessageDigest md;


        try {
            md = MessageDigest.getInstance("MD5");
            byte bytes [] = text.getBytes();
            
            md.reset();
            md.update(bytes);
            
            byte output [] = md.digest();

            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < bytes.length; i++) {
                String hex = Integer.toHexString(0xff & output[i]);
                if (hex.length() == 1)
                    sb.append('0');
                sb.append(hex);
            }
            if(sb.length()<8) {
                sb.append("z3nc0wqlan");
            }
            sb.setLength(8);
            result = sb.toString();

        } catch (NoSuchAlgorithmException e) {
        }
        
        if(repeat)
        result = encrypt(result, false);
        return result;
    }
}
