package egovframework.base.account.bll.process;

import egovframework.base.account.ibll.request.RequestLogin;
import egovframework.base.account.ibll.request.RequestLoginKey;
import egovframework.base.account.ibll.response.ResponseLoginKey;
import egovframework.base.model.account.User;
import egovframework.base.model.common.team.RegularMember;
import egovframework.base.model.account.Grade;
import egovframework.base.model.common.Site;
import egovframework.base.account.ibll.response.LoginResult;
import egovframework.base.account.ibll.response.ResponseSite;
import egovframework.base.account.ibll.response.ResponseGradeList;
import egovframework.base.account.bll.process.login.ExternalLoginManager;
import egovframework.base.account.bll.process.login.LoginManager;
import egovframework.base.generic.Holder;
import egovframework.base.dal.account.*;
import egovframework.base.dal.common.SiteDAO;
import egovframework.base.crypto.AES256Cipher;
import egovframework.base.response.resource.ID;
import egovframework.base.account.bll.resource.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;
import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;

public class LoadManager {
    private static final int KeySize = 32;
    private static char[] BaseArr = null;

    private GradeDAO gradeDao;
    private UserDAO userDao;
    private SiteDAO siteDao;
    private SessionDAO sessionDao;

    public LoadManager(GradeDAO gradeDao, UserDAO userDao, SiteDAO siteDao, SessionDAO sessionDao) {
        this.gradeDao = gradeDao;
        this.userDao = userDao;
        this.siteDao = siteDao;
        this.sessionDao = sessionDao;
    }

    public ResponseLoginKey getLoginKey(RequestLoginKey data, boolean isExternalLogin) {
        ResponseLoginKey result = new ResponseLoginKey();
        Holder<String> errorMessage = new Holder<String>();
        String salt = isExternalLogin ? "abc" : getSalt(data, errorMessage);

        if (salt == null || salt.isEmpty()) {
            result.setSuccess(false);
            result.setSalt("");
            result.setExternalLogin(isExternalLogin);
            result.setMessage(errorMessage.value != null ? errorMessage.value : "unknownUser");
        } else {
            result.setSuccess(true);
            result.setSalt(salt);
            result.setLoginKey(getLoginKey(data.getNum()));
            result.setExternalLogin(isExternalLogin);
            result.setMessage("");
        }

        return result;
    }

    public static String getLoginKey(Long num) {
        return makeRandomKey(num);
    }

    public LoginResult login(RequestLogin data, String externalLoginUrl, boolean autoLogin) {
        LoginResult result;

        if (!data.getValue().isEmpty() || !data.getKey().isEmpty()) {
            try {
                String decrypted = decrypt(data.getValue(), data.getKey());
                int index = decrypted.indexOf('|');

                if (index > 0) {
                    String userId = decrypted.substring(0, index).trim();
                    String password = decrypted.substring(index + 1).trim();
                    result = login(userId, password, data.getKey(), externalLoginUrl, autoLogin);

                    if (result.isSuccess()) {
                        result.setMessage("successToLogin");
                    }
                } else {
                    result = new LoginResult(false, "invalidFormat");
                }
            } catch (Exception e) {
                result = new LoginResult(false, e.getMessage());
            }
        } else {
            result = new LoginResult(false, "emptyData");
        }

        return result;
    }

    private LoginResult login(String userId, String password, String sessionKey, String externalLoginUrl, boolean autoLogin) {
        LoginResult result;

        if (externalLoginUrl != null && !externalLoginUrl.isEmpty()) {
            ExternalLoginManager externalLoginManager = new ExternalLoginManager(gradeDao, userDao, siteDao, sessionDao);
            result = externalLoginManager.externalLogin(userId, password, externalLoginUrl, sessionKey, autoLogin);
            if (!result.isSuccess()) return result;

            if (result.getUser() == null) {
                result.setSuccess(false);
                result.setMessage("invalidUserInfo");
            }
            return result;
        } else {
            LoginManager loginManager = new LoginManager(userDao, sessionDao, gradeDao);
            return loginManager.login(userId, password, sessionKey, autoLogin);
        }
    }

    public ResponseSite getAllSites() {
        Holder<String> errorMessage = new Holder<String>();
        List<Site> sites = this.siteDao.selectSites(null, null, null, errorMessage);
        if (sites == null || sites.isEmpty()) {
            return new ResponseSite(false, "Site 정보가 없습니다.");
        }

        ResponseSite response = new ResponseSite(true, "");
        response.getSites().addAll(sites);

        if (sites.size() > 1) {
            response.setUseMultiSite(true);
        }

        return response;
    }

    public static String makeSalt() {
        int length = 50;
        String chars = "0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        Random rand = new Random();

        for (int i = 0; i < length; i++) {
            int index = rand.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }

        return sb.toString();
    }

    private static String makeRandomKey(Long num) {
        if (BaseArr == null) {
            BaseArr = makeBaseArray();
        }

        int max = BaseArr.length;
        int seed = num != null ? num.hashCode() : new Random().nextInt();
        Random rand = new Random(seed);
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < KeySize; i++) {
            int index = rand.nextInt(max);
            key.append(BaseArr[index]);
        }

        return key.toString();
    }

    private static char[] makeBaseArray() {
        String base = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return base.toCharArray();
    }

    private String getSalt(RequestLoginKey data, Holder<String> errorMessage) {
        String condition = null;

        if (data.getUserID() != null) {
            condition = String.format("%s = '%s'", User.Fields.user_id, data.getUserID());
        }
        /*else if (data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.Email)
        {
            RegularMember member = GetRegularMember(data.Name, data.Data, null, out strErrorMessage);

            if (member == null)
                return null;
            else
                strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
        }
        else if (data.Name != null && data.Data != null && data.Mode == (int)RequestLoginKey.ModeType.PhoneNumber)
        {
            RegularMember member = GetRegularMember(data.Name, null, EncryptString(data.Data), out strErrorMessage);

            if (member == null)
                return null;
            else
                strCondition = string.Format("{0} = {1}", User.Fields.rgl_memb_sn, member.rgl_memb_sn);
        }*/
        else
        {
            errorMessage.value = ID.get(ErrorMessage.class, "moreParameter").value();
            return null;
        }

        List<User> users = this.userDao.selectUsers(null, condition, null, errorMessage);

        if (users == null) {
            return null;
        }

        if (!users.isEmpty()) {
            return users.get(0).getPassword_salt();
        }

        errorMessage.value = ID.get(ErrorMessage.class, "unknownUser").value();
        return null;
    }

    private static String decrypt(String inputHex, String key) throws Exception {
        byte[] inputBytes = hexStringToByteArray(inputHex);
        byte[] keyBytes = key.substring(0, 32).getBytes(StandardCharsets.UTF_8);
        byte[] ivBytes = key.substring(0, 16).getBytes(StandardCharsets.UTF_8);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec iv = new IvParameterSpec(ivBytes);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);

        byte[] decrypted = cipher.doFinal(inputBytes);
        return new String(decrypted, StandardCharsets.UTF_8);
    }

    private static byte[] hexStringToByteArray(String s) {
        s = s.replace(" ", "");
        int len = s.length();
        byte[] data = new byte[len / 2];

        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }

        return data;
    }

    public static String encryptString(String str) {
        if (str == null) return null;

        try {
            return AES256Cipher.encrypt(str); // Java용 AES256Cipher 정의 필요
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

        return null;
    }

    public static String decryptString(String str) {
        if (str == null) return null;

        try {
            return AES256Cipher.decrypt(str); // Java용 AES256Cipher 정의 필요
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

        return null;
    }

    public ResponseGradeList getGradeList() {
        Holder<String> errorMessage = new Holder<>();
        List<Grade> grades = this.gradeDao.selectGrades(null, null, null, errorMessage);

        if (grades == null) return new ResponseGradeList(false, "등급 목록을 가져올 수 없습니다.");

        ResponseGradeList response = new ResponseGradeList(true, "");
        response.getGrades().addAll(grades);
        return response;
    }
}