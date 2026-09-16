namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseRackCoord : MessageResult
    {
        private string m_strCoord = null;

        public string Coord
        {
            get { return m_strCoord; }
            set { m_strCoord = value; }
        }

        public ResponseRackCoord()
            : base()
        {
        }

        public ResponseRackCoord(bool success, string message)
            : base(success, message)
        {
        }
    }
}
