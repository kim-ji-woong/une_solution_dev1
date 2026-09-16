using System.Collections.Generic;
using Base.Account.IBLL.Interface;
using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class PasswordPolicy : IPasswordPolicy
    {
        private bool m_needUpperCase = false;
        private bool m_needLowerCase = false;
        private bool m_needAlphabet = false;
        private bool m_needNumber = false;
        private bool m_needCharacter = false;
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

        public void ReadConfig(IConfiguration config, string strHeader = "PasswordPolicy")
        {
            string strUpperCase = config[strHeader + ":NeedUpperCase"];
            string strLowerCase = config[strHeader + ":NeedLowerCase"];
            string strAlphabet = config[strHeader + ":NeedAlphabet"];
            string strNumber = config[strHeader + ":NeedNumber"];
            string strCharacter = config[strHeader + ":NeedCharacter"];
            string strAllowCharacters = config[strHeader + ":AllowCharacters"];
            string strNeedNumberOrCharacter = config[strHeader + ":NeedNumberOrCharacter"];
            string strMinimumLength = config[strHeader + ":MinimumLength"];
            string strMaximumLength = config[strHeader + ":MaximumLength"];

            if (strUpperCase == null || strLowerCase == null || strAlphabet == null || strNumber == null || strCharacter == null || strAllowCharacters == null || strNeedNumberOrCharacter == null)
                return;

            bool? needUpperCase = GetBooleanValue(strUpperCase);
            bool? needLowerCase = GetBooleanValue(strLowerCase);
            bool? needAlphabet = GetBooleanValue(strAlphabet);
            bool? needNumber = GetBooleanValue(strNumber);
            bool? needCharacter = GetBooleanValue(strCharacter);
            bool? needNumberOrCharacter = GetBooleanValue(strNeedNumberOrCharacter);

            if (needUpperCase != null)
                this.NeedUpperCase = (bool)needUpperCase;

            if (needLowerCase != null)
                this.NeedLowerCase = (bool)needLowerCase;

            if (needAlphabet != null)
                this.NeedAlphabet = (bool)needAlphabet;

            if (needNumber != null)
                this.NeedNumber = (bool)needNumber;

            if (needCharacter != null)
                this.NeedCharacter = (bool)needCharacter;

            if (needNumberOrCharacter != null)
                this.NeedNumberOrCharacter = (bool)needNumberOrCharacter;

            int len = strAllowCharacters.Length;

            for (int i = 0; i < len; i++)
            {
                char ch = strAllowCharacters[i];
                this.AllowCharacters.Add(ch);
            }

            if (strMinimumLength != null)
            {
                int minLength;

                if (int.TryParse(strMinimumLength, out minLength))
                    this.MinimumLength = minLength;
            }

            if (strMaximumLength != null)
            {
                int maxLength;

                if (int.TryParse(strMaximumLength, out maxLength))
                    this.MaximumLength = maxLength;
            }
        }

        public static bool? GetBooleanValue(string value)
        {
            value = value.ToLower();

            if (value == "true" || value == "1")
                return true;
            else if (value == "false" || value == "0")
                return false;

            return null;
        }
    }
}