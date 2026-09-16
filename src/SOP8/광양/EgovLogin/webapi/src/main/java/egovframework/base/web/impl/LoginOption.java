package egovframework.base.web.impl;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import egovframework.base.api.options.ILoginOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@Component
public class LoginOption implements ILoginOption {
    @Value("${login.external-login}")
    private String externalLoginUrl = "aaa";

    @Value("${login.auto-login}")
    private boolean autoLogin = true;

    @Override
    public String getExternalLoginUrl()
    {
        return externalLoginUrl;
    }

    @Override
    public boolean getAutoLogin()
    {
        return autoLogin;
    }
}
