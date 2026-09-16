using DCOP.Model;

namespace DCOP.BLL.Models.Response.RackEditor
{
    public class ResponseDataCenterInfo : MessageResult
    {
        private DataCenter m_dataCenter = null;
        private int m_nTileWidth = 0;
        private int m_nTileHeight = 0;

        public DataCenter DataCenter
        {
            get { return m_dataCenter; }
            set { m_dataCenter = value; }
        }

        public int TileWidth
        {
            get { return m_nTileWidth; }
            set { m_nTileWidth = value; }
        }

        public int TileHeight
        {
            get { return m_nTileHeight; }
            set { m_nTileHeight = value; }
        }

        public ResponseDataCenterInfo()
            : base()
        {
        }

        public ResponseDataCenterInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
