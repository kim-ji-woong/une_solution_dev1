namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestCodeType
    {
        private int? m_codeType = null;
        private string m_strCodeTypeEngName = null;

        public int? CodeType
        {
            get { return m_codeType; }
            set { m_codeType = value; }
        }

        public string CodeTypeEngName
        {
            get { return m_strCodeTypeEngName; }
            set { m_strCodeTypeEngName = value; }
        }
    }
}
