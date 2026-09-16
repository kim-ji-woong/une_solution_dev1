package egovframework.base.web;

import egovframework.base.api.options.ILoginOption;
import egovframework.base.dal.IDatabase;
import egovframework.base.web.impl.Database;
import egovframework.base.web.impl.LoginOption;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "egovframework.base")
@MapperScan(basePackages = "egovframework.base")
public class Application extends SpringBootServletInitializer {
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application.class);
    }

    /*@Bean
    public ILoginOption loginOption() {
        return new LoginOption();
    }

    @Bean
    public IDatabase database() {
        return new Database();
    }*/
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}