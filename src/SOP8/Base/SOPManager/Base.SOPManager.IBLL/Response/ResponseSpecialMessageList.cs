using System.Collections.Generic;
using Base.Model.Sop.Config;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    public class ResponseSpecialMessageList : MessageResult
    {
        private List<SpecialCharactor> m_specialMessages = new List<SpecialCharactor>();

        public List<SpecialCharactor> SpecialMessages
        {
            get { return m_specialMessages; }
        }

        public ResponseSpecialMessageList()
            : base()
        {
        }

        public ResponseSpecialMessageList(bool success, IEnumerable<SpecialCharactor> spcecialMessages, string strErrorMessage)
            : base(success, strErrorMessage)
        {
            Success = success;
            Message = strErrorMessage;

            if (spcecialMessages != null)
            {
                m_specialMessages.AddRange(spcecialMessages);
            }
        }
    }
}
