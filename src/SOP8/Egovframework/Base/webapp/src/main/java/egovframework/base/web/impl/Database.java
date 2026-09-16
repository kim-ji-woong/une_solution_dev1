package egovframework.base.web.impl;

import egovframework.base.dal.IDatabase;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import javax.annotation.PostConstruct;

@Component
public class Database implements IDatabase {
    private static DataSource dataSource = null;

    @Value("${spring.datasource.url}")
    private String url = "";

    @Value("${spring.datasource.username}")
    private String username = "";

    @Value("${spring.datasource.password}")
    private String password = "";

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName = "";

    /**
     * Spring 초기화 완료 후 실행됨. 안전하게 static dataSource를 초기화.
     */
    @PostConstruct
    public void init() {
        if (Database.dataSource == null) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(this.url);
            config.setUsername(this.username);
            config.setPassword(this.password);
            config.setDriverClassName(this.driverClassName);

            // Connection Pool 생성
            Database.dataSource = new HikariDataSource(config);
        }
    }

    public Connection getConnection() throws SQLException {
        return Database.dataSource.getConnection();
    }

    // "mysql", "sql-server", "oracle", "postgresql"
    public String getDbType() {
        try {
            Connection connection = getConnection();

            if (connection != null) {
                String strDbType = connection.getMetaData().getDatabaseProductName().toLowerCase();

                if (strDbType.contains("mysql")) {
                    return "mysql";
                } else if (strDbType.contains("sql server")) {
                    return "sql-server";
                } else if (strDbType.contains("oracle")) {
                    return "oracle";
                } else if (strDbType.contains("postgresql")) {
                    return "postgresql";
                }
            }
        }
        catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }
}
