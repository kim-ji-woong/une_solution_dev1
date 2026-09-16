using System.Collections.Generic;
using Response.Resource;

namespace Base.SOPManager.BLL.Resource
{
    class ErrorMessageFormat : MessageMap
    {
        private static Dictionary<ID.LanguageTypes, Dictionary<string, object>> m_messageMaps = null;

        private static void Init()
        {
            Dictionary<ID.LanguageTypes, Dictionary<string, object>> dicMessageMaps = new Dictionary<ID.LanguageTypes, Dictionary<string, object>>();
            
            // 한글
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noBeginComponent", "[{0}] 단계에 시작 Component가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "noEndComponent", "[{0}] 단계에 종료 Component가 존재하지 않습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "unknownSOPVersion", "알수없는 SOP 버전입니다.({0})");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "unconnectedComponent", "연결되어 있지 않은 컴포넌트가 존재합니다.({0}, {1})");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "fieldLengthOver", "{0} 그 길이가 영문의 경우 {1}자를 초과할 수 없습니다.");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "invalidDateTimeString", "DateTime Instance를 생성할 수 없는 문자열입니다. : {0}");

            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerInWidth", "width는 정수값만 허용됩니다.(width=\"{0}\")");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerInHeight", "height는 정수값만 허용됩니다.(height=\"{0}\")");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerInTeamType", "teamType은 정수값만 허용됩니다.(teamType=\"{0}\")");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyBooleanTag1", "{0}은 Boolean 값만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyBooleanTag2", "{0}는 Boolean 값만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerTag1", "{0}은 정수값만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerTag2", "{0}는 정수값만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerAttr1", "{0}은 정수값만 허용됩니다.({0}=\"{1}\")");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyIntegerAttr2", "{0}는 정수값만 허용됩니다.({0}=\"{1}\">)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyNumberTag1", "{0}은 숫자만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "onlyNumberTag2", "{0}는 숫자만 허용됩니다.(<{0}>{1}</{0}>)");
            SetMessage(dicMessageMaps, ID.LanguageTypes.ko, "xml", "noDefinedTag", "정의되지 않은 값입니다.(<{0}>{1}</{0}>)");

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
