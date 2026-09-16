package egovframework.base.account.ibll.interface_;

import egovframework.base.account.ibll.IProcessManager;
import egovframework.base.account.ibll.interface_.IPasswordPolicy;
import egovframework.base.generic.Holder;

public interface IUserCreator {

    /**
     * 신규계정의 비밀번호를 생성하고 생성된 비밀번호를 시스템 정책에 따라 사용자에게 전달한다.
     *
     * @param processManager 프로세스 관리자
     * @param passwordPolicy 비밀번호 정책
     * @param userNo 사용자 번호
     * @param strUserID 사용자 ID
     * @param regularMemberNo 정회원 번호 (nullable)
     * @param strSalt 비밀번호 해시용 솔트
     * @param errorMessage 에러 메시지
     * @return 성공 여부
     */
    boolean setDefaultPassword(IProcessManager processManager, IPasswordPolicy passwordPolicy,
                               int userNo, String strUserID, Integer regularMemberNo, String strSalt,
                               Holder<String> errorMessage);

    /**
     * 계정 소유자의 이름과 전화번호를 이용하여 임시 비밀번호를 만들어 전달한다.
     *
     * @param processManager 프로세스 관리자
     * @param passwordPolicy 비밀번호 정책
     * @param strUserName 사용자 이름
     * @param strPhoneNumber 전화번호
     * @param errorMessage 에러 메시지
     * @return 성공 여부
     */
    boolean makeTemporaryPasswordWithSMS(IProcessManager processManager, IPasswordPolicy passwordPolicy, String strUserName, String strPhoneNumber,
                                          Holder<String> errorMessage);

    /**
     * 계정 소유자의 이름과 이메일을 이용하여 임시 비밀번호를 만들어 전달한다.
     *
     * @param processManager 프로세스 관리자
     * @param passwordPolicy 비밀번호 정책
     * @param strUserName 사용자 이름
     * @param strEmail 이메일
     * @param errorMessage 에러 메시지
     * @return 성공 여부
     */
    boolean makeTemporaryPasswordWithEmail(IProcessManager processManager,
                                            IPasswordPolicy passwordPolicy, String strUserName, String strEmail,
                                            Holder<String> errorMessage);
}