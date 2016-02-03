package com.techstudio.form.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
 
/**
 * Handles requests for the application file upload requests
 */
@Controller
public class FileUploadController {
 
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
 
    /**
     * Upload single file using Spring Controller
     */
    @ResponseBody
    @RequestMapping(value = "/uploadFile.wilas", method = RequestMethod.POST)
    public String uploadFileHandler(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file) {
 
        if (!file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
 
                // Creating the directory to store file
                String rootPath = System.getProperty("catalina.home");
                File dir = new File(rootPath + File.separator + "tmpFiles");
                if (!dir.exists())
                    dir.mkdirs();
 
                // Create the file on server
                File serverFile = new File(dir.getAbsolutePath()
                        + File.separator + name);
                BufferedOutputStream stream = new BufferedOutputStream(
                        new FileOutputStream(serverFile));
                stream.write(bytes);
                stream.close();
 
                logger.info("Server File Location="
                        + serverFile.getAbsolutePath());
 
                return "You successfully uploaded file=" + name;
            } catch (Exception e) {
                return "You failed to upload " + name + " => " + e.getMessage();
            }
        } else {
            return "You failed to upload " + name
                    + " because the file was empty.";
        }
    }
 
    /**
     * Upload multiple file using Spring Controller
     */
    @ResponseBody
    @RequestMapping(value = "/uploadMultipleFile.wilas", method = RequestMethod.POST)
    public String uploadMultipleFileHandler(@RequestParam("file") MultipartFile[] files, HttpServletRequest request) {
 
        if (files.length != files.length)
            return "Mandatory information missing";
 
        String message = "";
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            
            
            String name = file.getOriginalFilename();
            try {
                byte[] bytes = file.getBytes();
 
                // Creating the directory to store file
                //String rootPath = System.getProperty("catalina.home");
                String rootPath = request.getSession().getServletContext().getRealPath("/");
                
                
                File dir = new File(rootPath + File.separator + "uploads");
                if (!dir.exists())
                    dir.mkdirs();
 
                // Create the file on server
                File serverFile = new File(dir.getAbsolutePath()
                        + File.separator + name);
                BufferedOutputStream stream = new BufferedOutputStream(
                        new FileOutputStream(serverFile));
                stream.write(bytes);
                stream.close();
 
                logger.info("Server File Location="
                        + serverFile.getAbsolutePath());
 
                message = message + "You successfully uploaded file=" + name
                        + "<br />";
            } catch (Exception e) {
                return "You failed to upload " + name + " => " + e.getMessage();
            }
        }
        return message;
    }
    
    @RequestMapping(value = "changePicName.tss", method = RequestMethod.POST)
    public @ResponseBody
    String changePicNameHandler(@RequestParam("name") String[] name,
            @RequestParam("url") String fileURL, HttpServletRequest request) {
 
        return null;
    }
}