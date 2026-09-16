namespace DCOP.BLL.Models.Response
{
    public class Response360CameraUrl : MessageResult
    {
        private string m_strUrl = "";

        public string Url
        {
            get { return m_strUrl; }
            set { m_strUrl = value; }
        }

        public Response360CameraUrl()
            : base()
        {
        }

        public Response360CameraUrl(bool success, string message)
            : base(success, message)
        {
        }
    }
}
