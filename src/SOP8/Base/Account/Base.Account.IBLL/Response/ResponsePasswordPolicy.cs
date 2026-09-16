using Response;
using System.Collections.Generic;

namespace Base.Account.IBLL.Response
{
    public class ResponsePasswordPolicy : MessageResult
    {
        private bool m_needUpperCase = false;
        private bool m_needLowerCase = false;
        private bool m_needAlphabet = true;
        private bool m_needNumber = false;
        private bool m_needCharacter = false;
        // 숫자와 특수문자 가운데 하나는 반드시 있어야 하는가?
        private bool m_needNumberOrCharacter = false;
        private int? m_minimumLength = null;
        private int? m_maximumLength = null;
        private List<char> m_allowCharacters = new List<char>();

        public bool NeedUpperCase
        {
            get { return m_needUpperCase; }
            set { m_needUpperCase = value; }
        }

        public bool NeedLowerCase
        {
            get { return m_needLowerCase; }
            set { m_needLowerCase = value; }
        }

        public bool NeedAlphabet
        {
            get { return m_needAlphabet; }
            set { m_needAlphabet = value; }
        }

        public bool NeedNumber
        {
            get { return m_needNumber; }
            set { m_needNumber = value; }
        }

        public bool NeedCharacter
        {
            get { return m_needCharacter; }
            set { m_needCharacter = value; }
        }

        // 숫자와 특수문자 가운데 하나는 반드시 있어야 하는가?
        public bool NeedNumberOrCharacter
        {
            get { return m_needNumberOrCharacter; }
            set { m_needNumberOrCharacter = value; }
        }

        public int? MinimumLength
        {
            get { return m_minimumLength; }
            set { m_minimumLength = value; }
        }

        public int? MaximumLength
        {
            get { return m_maximumLength; }
            set { m_maximumLength = value; }
        }

        public List<char> AllowCharacters
        {
            get { return m_allowCharacters; }
            set { m_allowCharacters = value; }
        }

        public ResponsePasswordPolicy()
            : base()
        {
        }

        public ResponsePasswordPolicy(bool success, string message)
            : base(success, message)
        {
        }
    }
}
