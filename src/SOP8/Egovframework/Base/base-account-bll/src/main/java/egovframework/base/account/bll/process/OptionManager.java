package egovframework.base.account.bll.process;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

import egovframework.base.dal.account.OptionDAO;
import egovframework.base.generic.Holder;
import egovframework.base.model.account.Option;
import egovframework.base.account.ibll.models.UserOption;
import egovframework.base.account.ibll.request.RequestOption;
import egovframework.base.account.ibll.response.ResponseOption;
import egovframework.base.response.MessageResult;
import egovframework.base.account.bll.resource.ErrorMessage;
import egovframework.base.response.resource.ID;
import egovframework.base.dal.IDatabase;

public class OptionManager {
    public static ResponseOption getOption(RequestOption data, OptionDAO optionDao) {
        ResponseOption result = new ResponseOption();
        Holder<String> errorMessage = new Holder<>();

        String strCondition = String.format("%s = %d", Option.Fields.user_sn, data.getUserNo());

        if (data.getCategory() != null && !data.getCategory().isEmpty()) {
            if (data.getSubCategory() != null && !data.getSubCategory().isEmpty()) {
                strCondition += String.format(" and %s = '%s' and %s = '%s'",
                        Option.Fields.optn_cl, data.getCategory(),
                        Option.Fields.optn_sclas, data.getSubCategory());
            } else {
                strCondition += String.format(" and %s = '%s'",
                        Option.Fields.optn_cl, data.getCategory());
            }
        }

        strCondition += String.format(" order by %s, %s, %s",
                Option.Fields.optn_cl,
                Option.Fields.optn_sclas,
                Option.Fields.optn_indx);

        List<Option> options = optionDao.selectOptions(null, strCondition, null, errorMessage);

        if (options == null) {
            result.setSuccess(false);
            result.setMessage(ID.get(ErrorMessage.class, "failToReadOption").value());
            return result;
        }

        result.setSuccess(true);
        result.setUserNo(data.getUserNo());
        result.setOptions(new ArrayList<>());
        result.getOptions().addAll(toUserOptions(options));
        return result;
    }

    private static List<UserOption> toUserOptions(List<Option> options) {
        Map<String, UserOption> dicUserOptions = new HashMap<>();

        for (Option option : options) {
            String strKey = option.getOptn_cl();
            if (option.getOptn_sclas() != null)
                strKey += "_" + option.getOptn_sclas();

            UserOption userOption = dicUserOptions.get(strKey);
            if (userOption == null) {
                userOption = new UserOption();
                userOption.setCategory(option.getOptn_cl());
                userOption.setSubCategory(option.getOptn_sclas());
                userOption.setValues(new ArrayList<>());
                dicUserOptions.put(strKey, userOption);
            }

            userOption.getValues().add(option.getOptn_value());
        }

        return new ArrayList<>(dicUserOptions.values());
    }

    public static MessageResult saveOption(int userNo, List<UserOption> options, OptionDAO optionDao, IDatabase database) {
        Holder<String> errorMessage = new Holder<>();

        Connection connection = null;

        try {
            connection = database.getConnection();

            // Begin Transaction
            // 트랜잭션 수동제어
            connection.setAutoCommit(false);

            for (UserOption option : options) {
                String strCondition = String.format("%s = %d", Option.Fields.user_sn, userNo);

                if (option.getCategory() != null) {
                    if (option.getSubCategory() != null) {
                        strCondition += String.format(" and %s = '%s' and %s = '%s'",
                                Option.Fields.optn_cl, option.getCategory(),
                                Option.Fields.optn_sclas, option.getSubCategory());
                    } else {
                        strCondition += String.format(" and %s = '%s'",
                                Option.Fields.optn_cl, option.getCategory());
                    }
                }

                if (!optionDao.deleteOption(strCondition, errorMessage)) {
                    connection.rollback();
                    return new MessageResult(false, errorMessage.value);
                }
            }

            List<Option> userOptions = new ArrayList<>();

            for (UserOption option : options) {
                if (option.getValues() == null) continue;

                for (int i = 0; i < option.getValues().size(); i++) {
                    Option userOption = new Option();
                    userOption.setUser_sn(userNo);
                    userOption.setOptn_cl(option.getCategory());
                    userOption.setOptn_sclas(option.getSubCategory());
                    userOption.setOptn_indx(i + 1);
                    userOption.setOptn_value(option.getValues().get(i));
                    userOptions.add(userOption);
                }
            }

            if (!userOptions.isEmpty()) {
                if (!optionDao.insertOptions(userOptions, errorMessage)) {
                    connection.rollback();
                    return new MessageResult(false, errorMessage.value);
                }
            }
        }
        catch (Exception e) {
            if (connection != null) {
                try {
                    connection.rollback();
                }
                catch (SQLException ex) {}
            }

            e.printStackTrace();
            return new MessageResult(false, e.getMessage());
        }
        finally {
            if (connection != null) {
                try {
                    // commit
                    // 트랜잭션 자동제어(rollback을 호출했더라도 반드시 호출되어야 한다.)
                    connection.setAutoCommit(true);
                    connection.close();
                }
                catch (SQLException ex) {
                    return new MessageResult(false, "데이터베이스의 트랜잭션을 정상적으로 종료할 수 없습니다.");
                }
            }
        }

        return new MessageResult(true, "");
    }
}