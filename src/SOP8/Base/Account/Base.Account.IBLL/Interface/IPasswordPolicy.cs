using System.Collections.Generic;

namespace Base.Account.IBLL.Interface
{
    public interface IPasswordPolicy
    {
        public bool NeedUpperCase
        {
            get; set;
        }

        public bool NeedLowerCase
        {
            get; set;
        }

        public bool NeedAlphabet
        {
            get; set;
        }

        public bool NeedNumber
        {
            get; set;
        }

        public bool NeedCharacter
        {
            get; set;
        }

        public bool NeedNumberOrCharacter
        {
            get; set;
        }

        public int? MinimumLength
        {
            get; set;
        }

        public int? MaximumLength
        {
            get; set;
        }

        public List<char> AllowCharacters
        {
            get; set;
        }
    }
}
