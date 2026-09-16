using Response;

namespace Base.TeamEditor.IBLL.Response
{
    public class ResponseUpdateTemporaryMember : MessageResult
    {
        private int m_nNewNo = -1;
        public int NewNo
        {
            get { return m_nNewNo; }
            set { m_nNewNo = value; }
        }

        public ResponseUpdateTemporaryMember()
            : base()
        {
        }

        public ResponseUpdateTemporaryMember(bool success, string message)
            : base(success, message)
        {
        }
    }
}
