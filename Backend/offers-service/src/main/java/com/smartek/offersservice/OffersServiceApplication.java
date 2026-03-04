package com.smartek.offersservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OffersServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(OffersServiceApplication.class, args);
        System.out.println("╔═══════════════════════════════════════════════════════╗");
        System.out.println("║                                                       ║");
        System.out.println("║       SMARTEK Offers Service Started Successfully    ║");
        System.out.println("║                                                       ║");
        System.out.println("║        Port: 8085                                     ║");
        System.out.println("║        Database: offers_db                            ║");
        System.out.println("║                                                       ║");
        System.out.println("╚═══════════════════════════════════════════════════════╝");
    }
}
