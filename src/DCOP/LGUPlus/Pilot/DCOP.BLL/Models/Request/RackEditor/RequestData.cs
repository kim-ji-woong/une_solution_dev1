namespace DCOP.BLL.Models.Request.RackEditor
{
    public class RequestData
    {
        private RequestDataCenterInfo m_requestDataCenterInfo = null;
        private RequestItem m_requestItem = null;
        private RequestCodeType m_requestCodeType = null;
        private RequestRackType m_requestRackType = null;
        private RequestRackUnit m_requestRackUnit = null;
        private RequestRack m_requestRack = null;
        private RequestRackCoord m_requestRackCoord = null;
        private RequestRackItems m_requestRackItems = null;
        private RequestSave m_requestSave = null;

        public RequestDataCenterInfo RequestDataCenterInfo
        {
            get { return m_requestDataCenterInfo; }
            set { m_requestDataCenterInfo = value; }
        }

        public RequestItem RequestItem
        {
            get { return m_requestItem; }
            set { m_requestItem = value; }
        }

        public RequestCodeType RequestCodeType
        {
            get { return m_requestCodeType; }
            set { m_requestCodeType = value; }
        }

        public RequestRackType RequestRackType
        {
            get { return m_requestRackType; }
            set { m_requestRackType = value; }
        }

        public RequestRackUnit RequestRackUnit
        {
            get { return m_requestRackUnit; }
            set { m_requestRackUnit = value; }
        }

        public RequestRack RequestRack
        {
            get { return m_requestRack; }
            set { m_requestRack = value; }
        }

        public RequestRackCoord RequestRackCoord
        {
            get { return m_requestRackCoord; }
            set { m_requestRackCoord = value; }
        }

        public RequestRackItems RequestRackItems
        {
            get { return m_requestRackItems; }
            set { m_requestRackItems = value; }
        }

        public RequestSave RequestSave
        {
            get { return m_requestSave; }
            set { m_requestSave = value; }
        }
    }
}
