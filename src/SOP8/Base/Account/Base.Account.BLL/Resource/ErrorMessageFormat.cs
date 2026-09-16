using System.Collections.Generic;
using Response.Resource;

namespace Base.Account.BLL.Resource
{
    class ErrorMessageFormat : MessageMap
    {
        private static Dictionary<ID.LanguageTypes, Dictionary<string, object>> m_messageMaps = null;

        private static void Init()
        {
            Dictionary<ID.LanguageTypes, Dictionary<string, object>> dicMessageMaps = new Dictionary<ID.LanguageTypes, Dictionary<string, object>>();

            // 한글
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "lockFail", "{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 {2} 할수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "lockLoginFail", "{0}회 이상 로그인에 실패하였기 때문에 앞으로 {1}분 동안 로그인 할수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "lockLoginFail2", "ID 또는 비밀번호를 잘못 입력하였습니다. ({0}/{1}회)\r\n연속으로 {1}회 이상 로그인에 실패하면 {2}분동안 해당 계정으로 로그인 할 수 없습니다.");

            // 영문
            // ...

            m_messageMaps = dicMessageMaps;
        }

        protected ErrorMessageFormat(Dictionary<string, object> messageMaps)
            : base(messageMaps)
        {
        }

        public ErrorMessageFormat()
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
