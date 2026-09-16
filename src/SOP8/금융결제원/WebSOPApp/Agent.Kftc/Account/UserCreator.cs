using Base.Account.IBLL;
using Base.Account.IBLL.Interface;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Agent.Sample.Account
{
    public class UserCreator : IUserCreator
    {
        // 신규계정의 비밀번호를 생성하고 생성된 비밀번호를 시스템 정책에 따라 사용자에게 전달한다.
        public bool SetDefaultPassword(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, int userNo, string strUserID, int? regularMemberNo, string strSalt, out string strErrorMessage)
        {
            PasswordManager passwordManager = new PasswordManager();
            return passwordManager.SetDefaultPasswordSMS(processManager, dataManager, passwordPolicy, userNo, strUserID, regularMemberNo, strSalt, out strErrorMessage);
        }

        // 계정 소유자의 이름과 전화번호를 이용하여 임시 비밀번호를 만들어 전달한다.
        public bool MakeTemporaryPasswordWithSMS(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, string strUserName, string strPhoneNumber, out string strErrorMessage)
        {
            PasswordManager passwordManager = new PasswordManager();
            return passwordManager.MakeTemporaryPasswordSMS(processManager, dataManager, passwordPolicy, strUserName, strPhoneNumber, out strErrorMessage);
        }

        // 계정 소유자의 이름과 이메일을 이용하여 임시 비밀번호를 만들어 전달한다.
        public bool MakeTemporaryPasswordWithEmail(IProcessManager processManager, IDataManager dataManager, IPasswordPolicy passwordPolicy, string strUserName, string strEmail, out string strErrorMessage)
        {
            PasswordManager passwordManager = new PasswordManager();
            return passwordManager.MakeTemporaryPasswordEmail(processManager, dataManager, passwordPolicy, strUserName, strEmail, out strErrorMessage);
        }
    }
}
