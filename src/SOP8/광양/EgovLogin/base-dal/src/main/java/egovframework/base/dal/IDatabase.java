package egovframework.base.dal;

import org.apache.ibatis.jdbc.SQL;

import java.sql.Connection;
import java.sql.SQLException;

public interface IDatabase {
    public Connection getConnection() throws SQLException;
    // "mysql", "sql-server", "oracle", "postgresql"
    public String getDbType();
}
