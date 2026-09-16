using System.Collections.Generic;
using Response.Resource;

namespace Base.Account.BLL.Resource
{
    class ErrorMessage : MessageMap
    {
        private static Dictionary<ID.LanguageTypes, Dictionary<string, object>> m_messageMaps = null;

        private static void Init()
        {
            Dictionary<ID.LanguageTypes, Dictionary<string, object>> dicMessageMaps = new Dictionary<ID.LanguageTypes, Dictionary<string, object>>();

            // 한글
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "moreParameter", "Parameter가 부족합니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "unknownID", "존재하지 않는 계정입니다.\r\n입력한 정보를 다시 확인해주세요.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "unknownUser", "계정정보를 찾을수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noneUserLevel", "계정등급 정보를 찾을수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToCreateUser", "계정 생성에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToSession", "세션 생성에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "invalidUserInfo", "아이디 또는 비밀번호가 잘못되었습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToInitLoginFail", "로그인 실패횟수 초기화에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToUpdateLoginFail", "로그인 실패횟수 업데이트에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "successToLogin", "로그인에 성공하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadSession", "세션 정보를 읽어오는데 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToUpdateSession", "세션 업데이트에 실패하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noneSession", "세션 정보가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "logoutSession", "로그아웃 되었습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "validSession", "해당 Session은 유효합니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "anotherOneLogin", "다른 곳에서 로그인하였습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToReadOption", "사용자의 옵션 정보를 읽을 수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "failToSaveOption", "사용자의 옵션 정보를 저장할 수 없습니다.");

            // 영문
            // ...

            m_messageMaps = dicMessageMaps;
        }

        protected ErrorMessage(Dictionary<string, object> messageMaps)
            : base(messageMaps)
        {
        }

        public ErrorMessage()
            : base(null)
        {
        }

        public override MessageMap Get(ID.LanguageTypes type)
        {
            if (m_messageMaps == null)
                Init();

            Dictionary<string, object> dicMessageMaps = null;

            if (m_messageMaps.TryGetValue(type, out dicMessageMaps))
            {
                m_maps = dicMessageMaps;
                return this;
                //return new ErrorMessageFormat(dicMessageMaps);
            }

            m_maps = null;
            return this;
            //return new ErrorMessageFormat(null);
        }
    }
}
