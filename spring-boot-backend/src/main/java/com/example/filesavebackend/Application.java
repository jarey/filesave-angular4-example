package com.example.filesavebackend;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/api/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("*");
            }
        };
    }
}

@RestController
class FileResource {

	/**
	 * Metodo del POC para descargar chunks del fichero.
	 * @return
	 */
    @GetMapping(path = "/api/files", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<byte[]> getFile(HttpServletRequest request) {
    	String range = request.getHeader("Range");
    	//String[] rangeElements = range.split("-");
    	//Integer rangeFrom = Integer.valueOf(rangeElements[0]);
    	//Integer rangeTo = Integer.valueOf(rangeElements[1]);
    	Integer rangeFrom = 0;
    	Integer rangeTo = 20224833;
    	
    	
        String exportedContent = "Hello, World!";
        HttpHeaders responseHeaders = new HttpHeaders();
        InputStream inputStream = null;
        byte[] bytes = new byte[rangeTo-rangeFrom];
        try {
        	RandomAccessFile raf = new RandomAccessFile(new ClassPathResource("files/Joseph Ray - Room 1.5 (Extended Mix).mp3").getFile(),"r");
        	raf.read(bytes, rangeFrom, rangeTo-rangeFrom);
			 inputStream = new ClassPathResource("files/Joseph Ray - Room 1.5 (Extended Mix).mp3").getInputStream();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        responseHeaders.setAccessControlExposeHeaders(Collections.singletonList("Content-Disposition"));
        responseHeaders.set("Content-Disposition", "attachment; filename=" + "Joseph Ray - Room 1.5 (Extended Mix).mp3");
        return new ResponseEntity<>(bytes, responseHeaders, HttpStatus.OK);
    }
    
    @RequestMapping(path = "/api/files", method = {RequestMethod.HEAD}, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getWeight(){
    	HttpHeaders headers = new HttpHeaders();
    	File file = null;
		try {
			file = new ClassPathResource("files/Joseph Ray - Room 1.5 (Extended Mix).mp3").getFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	Long weight = file.length();
    	headers.setAccessControlExposeHeaders(Arrays.asList("Content-Disposition","Content-Length"));
        
        headers.add("Content-Length", weight.toString());
        headers.add("Content-Disposition", "attachment; filename=" + file.getName());
    	return new ResponseEntity<>(weight.toString(), headers, HttpStatus.OK);
    }

}
