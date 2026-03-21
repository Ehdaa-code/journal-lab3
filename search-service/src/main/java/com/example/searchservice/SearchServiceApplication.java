// SearchServiceApplication.java
package com.example.searchservice;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class SearchServiceApplication {

    public static void main(String... args) {
        Quarkus.run(args);
    }
}