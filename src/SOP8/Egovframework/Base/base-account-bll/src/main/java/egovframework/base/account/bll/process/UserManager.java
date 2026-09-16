package egovframework.base.account.bll.process;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

import egovframework.base.account.bll.ProcessManager;
import egovframework.base.account.ibll.models.*;
import egovframework.base.account.ibll.response.*;
import egovframework.base.account.ibll.request.*;
import egovframework.base.account.ibll.interface_.*;
import egovframework.base.crypto.AES256Cipher;
import egovframework.base.dal.account.GradeDAO;
import egovframework.base.dal.account.OptionDAO;
import egovframework.base.dal.account.SessionDAO;
import egovframework.base.dal.account.UserDAO;
import egovframework.base.dal.common.team.CommonTeamOptionDAO;
import egovframework.base.dal.join.JoinDAO;
import egovframework.base.generic.Holder;
import egovframework.base.model.account.*;
import egovframework.base.model.common.team.*;
import egovframework.base.dal.*;
import egovframework.base.model.page.Pagination;
import egovframework.base.response.*;
import egovframework.base.data.common.code.*;
import org.w3c.dom.Text;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.sound.sampled.AudioFormat;

public class UserManager {
    // AES Helper class as inner static class
    private static class AesHelper {
        public static String makeRandomKey(Long seed) {
            String base = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            Random rand = (seed != null) ? new Random(seed) : new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 32; i++) {
                sb.append(base.charAt(rand.nextInt(base.length())));
            }
            return sb.toString();
        }

        public static String encrypt(String plainText, String key) throws Exception {
            SecretKeySpec secretKey = new SecretKeySpec(key.substring(0, 32).getBytes(), "AES");
            IvParameterSpec iv = new IvParameterSpec(key.substring(0, 16).getBytes());
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encrypted);
        }

        public static String decrypt(String cipherTextHex, String key) throws Exception {
            byte[] cipherBytes = hexToBytes(cipherTextHex);
            SecretKeySpec secretKey = new SecretKeySpec(key.substring(0, 32).getBytes(), "AES");
            IvParameterSpec iv = new IvParameterSpec(key.substring(0, 16).getBytes());
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
            byte[] decrypted = cipher.doFinal(cipherBytes);
            return new String(decrypted, StandardCharsets.UTF_8);
        }

        public static String sha256(String input) throws Exception {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        }

        private static String bytesToHex(byte[] bytes) {
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString().toUpperCase();
        }

        private static byte[] hexToBytes(String hex) {
            int len = hex.length();
            byte[] data = new byte[len / 2];
            for (int i = 0; i < len; i += 2) {
                data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                        + Character.digit(hex.charAt(i + 1), 16));
            }
            return data;
        }
    }

    private IDatabase database;
    private JoinDAO joinDao;
    private GradeDAO gradeDao;
    private CommonTeamOptionDAO teamOptionDao;
    private UserDAO userDao;
    private SessionDAO sessionDao;
    private OptionDAO optionDao;

    public UserManager(IDatabase database, JoinDAO joinDao, GradeDAO gradeDao, CommonTeamOptionDAO teamOptionDao, UserDAO userDao, SessionDAO sessionDao, OptionDAO optionDao) {
        this.database = database;
        this.joinDao = joinDao;
        this.gradeDao = gradeDao;
        this.teamOptionDao = teamOptionDao;
        this.userDao = userDao;
        this.sessionDao = sessionDao;
        this.optionDao = optionDao;
    }

    public ResponseUserList getUserList(RequestUserList data) {
        Holder<String> errorMessage = new Holder<>();
        Map<Integer, Grade> gradeMap = readGrades(errorMessage);
        if (gradeMap == null) return new ResponseUserList(false, "Failed to read grades");

        if (!data.isUseTeamName()) {
            if (!data.isUseMemberName() && !data.isUseJobLevel() && !data.isUseJobPosition()
                    && !data.isUsePhoneNumber() && !data.isUseEmail()) {
                return getUserListNoTeamNoMember(data, gradeMap);
            } else {
                return getUserListNoTeam(data, gradeMap);
            }
        }

        int beginIndex = data.getBeginIndex() != null ? data.getBeginIndex() : 1;
        Integer pageRowCount = data.getPageRowCount();

        String condition = null;
        if (data.getSiteNo() != null) {
            condition = String.format("a.%s = %d", User.Fields.site_sn, data.getSiteNo());
            if (data.isLinkRegularMember())
                condition += String.format(" and a.%s is not null", User.Fields.rgl_memb_sn);
        } else if (data.isLinkRegularMember()) {
            condition = String.format("a.%s is not null", User.Fields.rgl_memb_sn);
        }

        List<Map<String, Object>> arrDatas = this.joinDao.joinUserRegularMemberRegular(condition, null, beginIndex, pageRowCount, this.database, errorMessage);
        ResponseUserList response = makeUserList(arrDatas, data, gradeMap, errorMessage);

        if (arrDatas != null && arrDatas.isEmpty() && beginIndex > 1) {
            arrDatas = this.joinDao.joinUserRegularMemberRegular(condition, null, 1, pageRowCount, this.database, errorMessage);

            if (!arrDatas.isEmpty()) {
                Pagination pagination = (Pagination)arrDatas.get(0).get(Pagination.tableName);
                response.setTotalCount(pagination.getTotalCount());
            }
        }

        return response;
    }

    private Map<Integer, Grade> readGrades(Holder<String> errorMessage) {
        List<Grade> grades = this.gradeDao.selectGrades(null, null, null, errorMessage);
        if (grades == null) return null;

        Map<Integer, Grade> map = new HashMap<>();
        for (Grade grade : grades) {
            map.put(grade.getGrad_sn(), grade);
        }
        return map;
    }

    private ResponseUserList getUserListNoTeam(RequestUserList data, Map<Integer, Grade> gradeMap) {
        int beginIndex = data.getBeginIndex() != null ? data.getBeginIndex() : 1;
        Integer pageRowCount = data.getPageRowCount();

        Holder<String> errorMessage = new Holder<>();
        String condition = data.getSiteNo() != null ? String.format("a.%s = %d", User.Fields.site_sn, data.getSiteNo()) : null;
        List<Map<String, Object>> arrDatas = this.joinDao.joinUserRegularMember(condition, null, beginIndex, pageRowCount, this.database, errorMessage);

        ResponseUserList response = makeUserList2(arrDatas, data, gradeMap, errorMessage);

        if (arrDatas != null && arrDatas.isEmpty() && beginIndex > 1) {
            arrDatas = this.joinDao.joinUserRegularMember(condition, null, 1, pageRowCount, this.database, errorMessage);

            for (Map<String, Object> _data : arrDatas) {
                Pagination pagination = (Pagination) _data.get(Pagination.tableName);
                response.setTotalCount(pagination.getTotalCount());
                break;
            }
        }

        return response;
    }

    private ResponseUserList getUserListNoTeamNoMember(RequestUserList data, Map<Integer, Grade> gradeMap) {
        Holder<String> errorMessage = new Holder<>();
        String condition = data.getSiteNo() != null ? String.format("%s = %d", User.Fields.site_sn, data.getSiteNo()) : null;
        List<User> users = this.userDao.selectUsers(null, condition, null, errorMessage);

        if (users == null) return new ResponseUserList(false, "Failed to read users");

        Holder<Map<Integer, String>> jobLevels = new Holder<>();
        Holder<Map<Integer, String>> jobPositions = new Holder<>();

        ResponseUserList response = new ResponseUserList(true, "");
        String searchText = data.getSearchText() != null && !data.getSearchText().trim().isEmpty()
                ? data.getSearchText().trim().toLowerCase() : null;

        for (User user : users) {
            AccountUser accUser = makeAccountUser(user, null, null, data, gradeMap, jobLevels, jobPositions, errorMessage);
            if (accUser != null && checkSearchText(accUser, data, searchText)) {
                response.getUsers().add(accUser);
            }
        }

        checkPagination(response, data);
        return getFilterUserList(response, data, searchText);
    }

    private ResponseUserList makeUserList(
            List<Map<String, Object>> arrDatas,
            RequestUserList data,
            Map<Integer, Grade> gradeMap,
            Holder<String> errorMessage
    ) {
        if (arrDatas == null) {
            return new ResponseUserList(false, errorMessage.value);
        }

        Holder<Map<Integer, String>> jobLevels = new Holder<>();
        Holder<Map<Integer, String>> jobPositions = new Holder<>();

        ResponseUserList response = new ResponseUserList(true, "");
        int nDataCount = arrDatas.size();

        String strSearchText = (data.getSearchText() != null && !data.getSearchText().trim().isEmpty())
                ? data.getSearchText().toLowerCase().trim()
                : null;

        for (Map<String, Object> _data : arrDatas) {
            Pagination pagination = (Pagination) _data.get(Pagination.tableName);
            User user = (User) _data.get(User.tableName);
            RegularMember member = (RegularMember) _data.get(RegularMember.tableName);
            Regular regular = (Regular) _data.get(Regular.tableName);

            AccountUser accountUser = makeAccountUser(user, member, regular, data, gradeMap, jobLevels, jobPositions, errorMessage);

            if (accountUser == null) {
                return new ResponseUserList(false, errorMessage.value);
            }

            if (checkSearchText(accountUser, data, strSearchText)) {
                response.getUsers().add(accountUser);
                response.setTotalCount(pagination.getTotalCount());
            }
        }

        return getFilterUserList(response, data, strSearchText);
    }

    private ResponseUserList makeUserList2(List<Map<String, Object>> arrDatas, RequestUserList data, Map<Integer, Grade> gradeMap, Holder<String> errorMessage) {
        if (arrDatas == null)
            return new ResponseUserList(false, errorMessage.value);

        Holder<Map<Integer, String>> jobLevels = new Holder<>();
        Holder<Map<Integer, String>> jobPositions = new Holder<>();

        ResponseUserList response = new ResponseUserList(true, "");
        int dataCount = arrDatas.size();

        String searchText = (data.getSearchText() != null && !data.getSearchText().trim().isEmpty())
                ? data.getSearchText().trim().toLowerCase() : null;

        for (Map<String, Object> row : arrDatas) {
            Pagination pagination = (Pagination)row.get("pagination");
            User user = (User)row.get(User.tableName);
            RegularMember member = (RegularMember)row.get(RegularMember.tableName);

            AccountUser accountUser = makeAccountUser(user, member, null, data, gradeMap, jobLevels, jobPositions, errorMessage);

            if (accountUser == null)
                return new ResponseUserList(false, errorMessage.value);

            if (checkSearchText(accountUser, data, searchText)) {
                response.getUsers().add(accountUser);
                response.setTotalCount(pagination.getTotalCount());
            }
        }

        return getFilterUserList(response, data, searchText);
    }

    private AccountUser makeAccountUser(User user, RegularMember member, Regular regular, RequestUserList data,
                                        Map<Integer, Grade> gradeMap,
                                        Holder<Map<Integer, String>> jobLevels,
                                        Holder<Map<Integer, String>> jobPositions,
                                        Holder<String> errorMessage) {

        AccountUser accountUser = new AccountUser();

        accountUser.setUserNo(user.getUser_sn());
        accountUser.setUserID(user.getUser_id());
        accountUser.setSiteNo(user.getSite_sn());
        accountUser.setMemo(user.getMemo());

        if (data.isUseTeamName() && regular != null) {
            accountUser.setTeamNo(regular.getRgl_sn());
            accountUser.setTeamName(regular.getTeam_name());
        }

        if (data.isUseMemberName() && member != null) {
            accountUser.setMemberNo(member.getRgl_memb_sn());
            accountUser.setMemberName(member.getMemb_name());
        }

        if (data.isUseNickName()) {
            accountUser.setNickName(user.getUser_name());
        }

        if (data.isUseJobLevel() && member != null && member.getClsf_no() != null) {
            if (jobLevels.value == null || jobPositions.value == null) {
                if (!readTeamOptions(jobLevels, jobPositions, errorMessage)) {
                    return null;
                }
            }

            String jobLevel = jobLevels.value.get(member.getClsf_no());
            if (jobLevel != null) {
                accountUser.setJobLevelNo(member.getClsf_no());
                accountUser.setJobLevel(jobLevel);
            }
        }

        if (data.isUseJobPosition() && member != null && member.getOfcps_no() != null) {
            if (jobLevels.value == null || jobPositions.value == null) {
                if (!readTeamOptions(jobLevels, jobPositions, errorMessage)) {
                    return null;
                }
            }

            String jobPosition = jobPositions.value.get(member.getOfcps_no());
            if (jobPosition != null) {
                accountUser.setJobPositionNo(member.getOfcps_no());
                accountUser.setJobPosition(jobPosition);
            }
        }

        if (data.isUseGrade()) {
            Grade grade = gradeMap.get(user.getGrad_sn());
            if (grade != null) {
                accountUser.setGradeNo(grade.getGrad_sn());
                accountUser.setGrade(grade.getGrad_name());
            }
        }

        if (data.isUsePhoneNumber() && member != null && member.getTelno() != null && !member.getTelno().isEmpty()) {
            try {
                accountUser.setPhoneNumber(AES256Cipher.decrypt(member.getTelno()));
            }
            catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }

        if (data.isUseEmail() && member != null && member.getEmail() != null && !member.getEmail().isEmpty()) {
            accountUser.setEmail(member.getEmail());
        }

        errorMessage.value = null;
        return accountUser;
    }

    private boolean readTeamOptions(Holder<Map<Integer, String>> jobLevels,
                                   Holder<Map<Integer, String>> jobPositions,
                                   Holder<String> errorMessage) {
        List<CommonTeamOption> options = this.teamOptionDao.selectCommonTeamOptions(null, null, null, errorMessage);

        if (options == null) {
            return false;
        }

        for (CommonTeamOption option : options) {
            if (option.getTeam_optn_ty_no() == CodeType.JobLevel.getValue()) {
                if (jobLevels.value == null) {
                    jobLevels.value = new HashMap<>();
                }

                jobLevels.value.put(option.getTeam_optn_no(), option.getTeam_optn_name());
            } else if (option.getTeam_optn_ty_no() == CodeType.JobPosition.getValue()) {
                if (jobPositions.value == null) {
                    jobPositions.value = new HashMap<>();
                }

                jobPositions.value.put(option.getTeam_optn_no(), option.getTeam_optn_name());
            }
        }

        errorMessage.value = null;
        return true;
    }

    private boolean checkSearchText(AccountUser user, RequestUserList data, String searchText) {
        if (searchText == null) {
            return true;
        }

        searchText = searchText.toLowerCase();

        if (user.getUserID() != null && user.getUserID().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseTeamName() && user.getTeamName() != null &&
                user.getTeamName().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseMemberName() && user.getMemberName() != null &&
                user.getMemberName().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseNickName() && user.getNickName() != null &&
                user.getNickName().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseJobLevel() && user.getJobLevel() != null &&
                user.getJobLevel().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseJobPosition() && user.getJobPosition() != null &&
                user.getJobPosition().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUseGrade() && user.getGrade() != null &&
                user.getGrade().toLowerCase().contains(searchText)) {
            return true;
        }

        if (data.isUsePhoneNumber() && user.getPhoneNumber() != null &&
                user.getPhoneNumber().contains(searchText)) {
            return true;
        }

        if (data.isUseEmail() && user.getEmail() != null &&
                user.getEmail().contains(searchText)) {
            return true;
        }

        return false;
    }

    private ResponseUserList getFilterUserList(ResponseUserList response, RequestUserList data, String searchText) {
        if (searchText == null) {
            return response;
        }

        int userCount = response.getUsers().size();

        if (data.getPageRowCount() != null && data.getPageRowCount() > 0) {
            int beginIndex = (data.getPageNo() - 1) * data.getPageRowCount();
            int endIndex = beginIndex + data.getPageRowCount();

            if (endIndex > userCount) {
                endIndex = userCount;
            }

            List<AccountUser> users = new ArrayList<>();
            for (int i = beginIndex; i < endIndex; i++) {
                users.add(response.getUsers().get(i));
            }

            response.getUsers().clear();
            response.getUsers().addAll(users);
            response.setTotalCount(userCount);
        } else {
            response.setTotalCount(userCount);
        }

        return response;
    }

    private void checkPagination(ResponseUserList response, RequestUserList data) {
        if (data.getPageRowCount() != null && data.getPageRowCount() > 0) {
            int userCount = response.getUsers().size();
            response.setTotalCount(userCount);

            List<AccountUser> users = new ArrayList<>();

            int beginIndex = (data.getPageNo() - 1) * data.getPageRowCount();
            int endIndex = beginIndex + data.getPageRowCount();

            if (endIndex > userCount) {
                endIndex = userCount;
            }

            for (int i = beginIndex; i < endIndex; i++) {
                users.add(response.getUsers().get(i));
            }

            response.getUsers().clear();
            response.getUsers().addAll(users);
        } else {
            response.setTotalCount(response.getUsers().size());
        }
    }

    public MessageResult updateUserInfo(RequestUpdateUserInfo data) {
        if (data.getGrade() == null && data.getMemo() == null && data.getNickName() == null) {
            return new MessageResult(true, "");
        }

        Holder<String> errorMessage = new Holder<>();
        String condition = String.format("%s = %d", User.Fields.user_sn.name(), data.getUserNo());

        User user = this.userDao.selectUser(null, condition, errorMessage);

        if (user == null) {
            if (errorMessage.value != null) {
                return new MessageResult(false, errorMessage.value);
            } else {
                return new MessageResult(false, "존재하지 않는 사용자 계정입니다.");
            }
        }

        Map<User.Fields, Object> updates = new HashMap<>();

        if (data.getGrade() != null) {
            updates.put(User.Fields.grad_sn, data.getGrade());
        }

        if (data.getMemo() != null) {
            updates.put(User.Fields.memo, data.getMemo());
        }

        if (data.getNickName() != null) {
            updates.put(User.Fields.user_name, data.getNickName());
        }

        if (!this.userDao.updateUser(updates, condition, errorMessage)) {
            return new MessageResult(false, errorMessage.value);
        }

        return new MessageResult(true, "");
    }

    public MessageResult deleteUser(RequestDeleteUser data) {
        Holder<String> errorMessage = new Holder<>();
        Connection connection = null;

        try {
            connection = this.database.getConnection();

            // Begin Transaction
            // 트랜잭션 수동제어
            connection.setAutoCommit(false);

            String condition = String.format("%s = %d", Option.Fields.user_sn.name(), data.getUserNo());

            if (!this.optionDao.deleteOption(condition, errorMessage)) {
                connection.rollback();
                return new MessageResult(false, errorMessage.value);
            }

            condition = String.format("%s = %d", Session.Fields.user_sn.name(), data.getUserNo());

            if (!this.sessionDao.deleteSession(condition, errorMessage)) {
                connection.rollback();
                return new MessageResult(false, errorMessage.value);
            }

            condition = String.format("%s = %d", User.Fields.user_sn.name(), data.getUserNo());

            if (!this.userDao.deleteUser(condition, errorMessage)) {
                connection.rollback();
                return new MessageResult(false, errorMessage.value);
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

    public ResponseAccountUser addNewUser(
            RequestNewUser data,
            ProcessManager processManager,
            IUserCreator userCreator,
            IPasswordPolicy passwordPolicy
    ) {
        Holder<String> errorMessage = new Holder<>();

        Map<Integer, Grade> gradeMap = readGrades(errorMessage); // out -> return value
        if (gradeMap == null) {
            return new ResponseAccountUser(false, errorMessage.value);
        }

        Connection connection = null;

        try {
            connection = this.database.getConnection();

            // Begin Transaction
            // 트랜잭션 수동제어
            connection.setAutoCommit(false);

            User user = new User();
            user.setGrad_sn(data.getGrade());
            user.setMemo(data.getMemo());
            user.setPassword("");
            user.setPassword_salt(LoadManager.makeSalt());
            user.setRgl_memb_sn(data.getRegularMemberNo());
            user.setSite_sn(data.getSiteNo());
            user.setUser_id(data.getUserID());
            user.setUser_name(data.getNickName());

            if (!this.userDao.insertUser(user, errorMessage)) {
                connection.rollback();
                return new ResponseAccountUser(false, errorMessage.value);
            }

            String condition = String.format("a.%s = %d", User.Fields.user_sn, user.getUser_sn());
            List<Map<String, Object>> arrDatas = this.joinDao.joinUserRegularMemberRegular(condition, null, 1, null, this.database, errorMessage);

            if (arrDatas == null) {
                connection.rollback();
                return new ResponseAccountUser(false, errorMessage.value);
            }

            for (Map<String, Object> _data : arrDatas) {
                User _user = (User) _data.get(User.tableName);
                RegularMember member = (RegularMember) _data.get(RegularMember.tableName);
                Regular regular = (Regular) _data.get(Regular.tableName);

                Holder<Map<Integer, String>> jobLevels = new Holder<>();
                Holder<Map<Integer, String>> jobPositions = new Holder<>();

                RequestUserList request = new RequestUserList(
                        null, 1, null, data.getSiteNo(),
                        true, true, true, true, true, true, true, true
                );

                AccountUser accountUser = makeAccountUser(
                        _user, member, regular, request,
                        gradeMap, jobLevels, jobPositions, errorMessage
                );

                if (accountUser == null) {
                    connection.rollback();
                    return new ResponseAccountUser(false, errorMessage.value); // accountUser 실패 시 에러
                }

                if (userCreator != null && passwordPolicy != null) {
                    boolean passCreated = userCreator.setDefaultPassword(
                            processManager, passwordPolicy,
                            _user.getUser_sn(), _user.getUser_id(),
                            _user.getRgl_memb_sn(), _user.getPassword_salt(), errorMessage
                    );

                    if (!passCreated) {
                        return new ResponseAccountUser(false, errorMessage.value);
                    }
                }

                ResponseAccountUser response = new ResponseAccountUser(true, "");
                response.setUser(accountUser);
                return response;
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
            return new ResponseAccountUser(false, e.getMessage());
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
                    return new ResponseAccountUser(false, "데이터베이스의 트랜잭션을 정상적으로 종료할 수 없습니다.");
                }
            }
        }

        return new ResponseAccountUser(false, "데이터베이스에 사용자 정보가 정상적으로 입력되지 못하였습니다.");
    }

    public MessageResult changePassword(RequestChangePassword data) {
        MessageResult result;

        if (!data.getValue().isEmpty() || !data.getKey().isEmpty()) {
            try {
                String decrypted = AesHelper.decrypt(data.getValue(), data.getKey());

                int index1 = decrypted.indexOf('|');
                int index2 = decrypted.indexOf('|', index1 + 1);

                if (index1 > 0 && index2 > 0) {
                    String strUserNo = decrypted.substring(0, index1).trim();
                    String strPW = decrypted.substring(index1 + 1, index2).trim();
                    String strNewPW = decrypted.substring(index2 + 1).trim();

                    int userNo;
                    try {
                        userNo = Integer.parseInt(strUserNo);
                    } catch (NumberFormatException e) {
                        return new MessageResult(false, "사용자 번호가 유효하지 않습니다.");
                    }

                    result = changePassword(userNo, strPW, strNewPW);
                } else {
                    result = new MessageResult(false, "잘못된 Parameter 입니다.");
                }
            } catch (Exception e) {
                result = new MessageResult(false, e.getMessage());
            }
        } else {
            result = new MessageResult(false, "잘못된 Parameter 호출입니다.");
        }

        return result;
    }

    private MessageResult changePassword(int userNo, String oldPassword, String newPassword) {
        Holder<String> errorMessage = new Holder<>();
        String condition = String.format("%s = %d", User.Fields.user_sn.name(), userNo);

        User user = this.userDao.selectUser(null, condition, errorMessage);

        if (user == null) {
            return new MessageResult(false, errorMessage.value != null ? errorMessage.value : "사용자 정보를 찾을 수 없습니다.");
        } else if (!user.getPassword().equals(oldPassword)) {
            return new MessageResult(false, "기존 비밀번호가 맞지 않습니다. 확인바랍니다.");
        }

        user.setPassword(newPassword);
        user.setPassword_key(null);

        if (this.userDao.updateUser(user, errorMessage)) {
            return new MessageResult(true, "");
        }

        return new MessageResult(false, errorMessage.value != null ? errorMessage.value : "비밀번호 업데이트를 실패하였습니다.");
    }

    public String makeRandomPassword(
            IPasswordPolicy passwordPolicy,
            int userNo,
            String userId,
            Holder<String> salt,
            Holder<String> errorMessage
    ) {
        String password = makeRandomPassword(passwordPolicy, errorMessage);
        if (password == null) {
            return null;
        }

        String encrypted = makePassword(userId, password, salt, errorMessage);

        if (encrypted == null)
            return null;

        boolean updated = updatePassword(userNo, encrypted, salt.value, errorMessage);

        if (!updated) {
            return null;
        }

        return password;
    }

    public MessageResult makeTemporaryPasswordWithSMS(
            ProcessManager processManager,
            IUserCreator userCreator,
            IPasswordPolicy passwordPolicy,
            String userName,
            String phoneNumber
    ) {
        if (passwordPolicy == null) {
            return new MessageResult(false, "비밀번호 정책이 지정되지 않았습니다.");
        } else if (userCreator == null) {
            return new MessageResult(false, "비밀번호 생성 모듈이 연결되지 않았습니다.");
        }

        Holder<String> errorMessage = new Holder<>();

        boolean result = userCreator.makeTemporaryPasswordWithSMS(
                processManager,
                passwordPolicy,
                userName,
                checkValidPhoneNumber(phoneNumber),
                errorMessage
        );

        if (!result) {
            return new MessageResult(false, errorMessage.value);
        }

        return new MessageResult(true, "");
    }

    public MessageResult makeTemporaryPasswordWithEmail(
            ProcessManager processManager,
            IUserCreator userCreator,
            IPasswordPolicy passwordPolicy,
            String userName,
            String email
    ) {
        if (passwordPolicy == null) {
            return new MessageResult(false, "비밀번호 정책이 지정되지 않았습니다.");
        } else if (userCreator == null) {
            return new MessageResult(false, "비밀번호 생성 모듈이 연결되지 않았습니다.");
        }

        Holder<String> errorMessage = new Holder<>();

        boolean success = userCreator.makeTemporaryPasswordWithEmail(
                processManager,
                passwordPolicy,
                userName,
                email,
                errorMessage
        );

        if (!success) {
            return new MessageResult(false, errorMessage.value);
        }

        return new MessageResult(true, "");
    }

    private String checkValidPhoneNumber(String strPhoneNumber) {
        if (strPhoneNumber == null) {
            return null;
        }

        StringBuilder phoneNumber = new StringBuilder();
        int len = strPhoneNumber.length();

        for (int i = 0; i < len; i++) {
            char ch = strPhoneNumber.charAt(i);
            if (ch >= '0' && ch <= '9') {
                phoneNumber.append(ch);
            }
        }

        return phoneNumber.toString();
    }

    private boolean updatePassword(
            int userNo,
            String password,
            String salt,
            Holder<String> errorMessage
    ) {
        Map<User.Fields, Object> updateFields = new HashMap<>();
        updateFields.put(User.Fields.password, password);
        updateFields.put(User.Fields.password_salt, salt);

        String condition = String.format("%s = %d", User.Fields.user_sn.name(), userNo);
        return this.userDao.updateUser(updateFields, condition, errorMessage);
    }

    private String makeRandomPassword(IPasswordPolicy passwordPolicy, Holder<String> errorMessage) {
        StringBuilder password = new StringBuilder();
        Holder<Integer> len = new Holder<>(0);

        Integer min = passwordPolicy.getMinimumLength();
        Integer max = passwordPolicy.getMaximumLength();

        if (min != null && max != null) {
            len.value = (min + max) / 2;
        } else if (min != null) {
            len.value = min;
        } else if (max != null) {
            len.value = max;
        } else {
            len.value = 12;
        }

        final int upperCase = 0;
        final int lowerCase = 1;
        final int number = 2;
        Holder<Integer> charactor = new Holder<>(3);
        Holder<Integer> typeCount = new Holder<>(4);

        if (!checkPasswordPolicyCount(passwordPolicy, charactor, typeCount, len, errorMessage)) {
            return null;
        }

        String lowerChars = "abcdefghijklmnopqrstuvwxyz";
        String upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String numberChars = "0123456789";

        int allowedCharCount = passwordPolicy.getAllowCharacters().size();
        Random rand = new Random(System.currentTimeMillis());

        for (int i = 0; i < len.value; i++) {
            int index = (i < typeCount.value) ? i : rand.nextInt(typeCount.value);

            if (index == upperCase) {
                password.append(getRandom(rand, upperChars, 26));
            }
            else if (index == lowerCase) {
                password.append(getRandom(rand, lowerChars, 26));
            }
            else if (index == number) {
                password.append(getRandom(rand, numberChars, 10));
            }
            else if (index == charactor.value) {
                password.append(getRandom(rand, passwordPolicy.getAllowCharacters(), allowedCharCount));
            }
        }

        return password.toString();
    }

    private boolean checkPasswordPolicyCount(
            IPasswordPolicy policy,
            Holder<Integer> charactor,
            Holder<Integer> typeCount,
            Holder<Integer> len,
            Holder<String> errorMessage
    ) {
        errorMessage.value = null;

        if (policy.getAllowCharacters().isEmpty()) {
            charactor.value = -1;
            typeCount.value = -1;
        }

        if (typeCount.value == 0) {
            errorMessage.value = "잘못된 비밀번호 정책입니다.";
            return false;
        }

        if (typeCount.value > len.value) {
            Integer max = policy.getMaximumLength();

            if (max == null) {
                len.value = typeCount.value;
            } else if (max < typeCount.value) {
                errorMessage. value = "잘못된 비밀번호 정책입니다. 허용 가능한 최대 길이가 정책과 맞지 않습니다.";
                return false;
            } else {
                len.value = typeCount.value;
            }
        }

        return true;
    }

    private char getRandom(Random rand, List<Character> src, int count) {
        int index = rand.nextInt(count);
        return src.get(index);
    }

    private char getRandom(Random rand, String str, int count) {
        int index = rand.nextInt(count);
        return str.charAt(index);
    }

    private String makePassword(String id, String password, Holder<String> salt, Holder<String> errorMessage)
    {
        errorMessage.value = null;

        if (salt.value == null || salt.value.isEmpty())
            salt.value = LoadManager.makeSalt();

        String combined = password + salt.value;
        byte[] hashed;

        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            hashed = sha256.digest(combined.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            errorMessage.value = "SHA-256 algorithm not available" + e.getMessage();
            return null;
        }

        StringBuilder hashedString = new StringBuilder();

        for (byte b : hashed)
        {
            hashedString.append(String.format("%02x", b));
        }

        return hashedString.toString();
    }
}
