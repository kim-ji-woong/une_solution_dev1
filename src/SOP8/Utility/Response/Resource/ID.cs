namespace Response.Resource
{
    public class ID
    {
        public enum LanguageTypes { ko, en }

        private static LanguageTypes m_targetLanguage = LanguageTypes.ko;

        public static LanguageTypes TargetLanguage
        {
            get { return m_targetLanguage; }
            set { m_targetLanguage = value; }
        }

        public static MessageMap Get<T>(string strTag) where T : MessageMap, new()
        {
            T t = new T();
            return t.Get(m_targetLanguage).Get(strTag);
        }
    }
}
