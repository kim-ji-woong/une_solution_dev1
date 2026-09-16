namespace Base.SOPManager.IBLL.Request
{
    public class RequestData
    {
        public enum ContentsType { DB = 0, XML };

        private RequestDisasterCategories m_requestDisasterCategories = null;
        private RequestDefault m_requestDefault = null;
        private RequestDisasterVersions m_requestDisasterVersions = null;
        private RequestSave m_requestSave = null;
        private RequestOpen m_requestOpen = null;
        private RequestDelete m_requestDelete = null;
        private RequestParseSpecialMessage m_requestParseSpecialMessage = null;
        private bool? m_requestSpecialMessageList = null;
        private bool? m_requestLinkedSOPs = null;
        private SaveLinkedSOPs m_saveLinkedSOPs = null;
        private RequestLoadLinkedSopVersions m_requestLoadLinkedSopVersions = null;
        private CheckSectionData m_checkSectionData = null;

        public RequestDisasterCategories RequestDisasterCategories
        {
            get { return m_requestDisasterCategories; }
            set { m_requestDisasterCategories = value; }
        }

        public RequestDefault RequestDefault
        {
            get { return m_requestDefault; }
            set { m_requestDefault = value; }
        }

        public RequestDisasterVersions RequestDisasterVersions
        {
            get { return m_requestDisasterVersions; }
            set { m_requestDisasterVersions = value; }
        }

        public RequestSave RequestSave
        {
            get { return m_requestSave; }
            set { m_requestSave = value; }
        }

        public RequestOpen RequestOpen
        {
            get { return m_requestOpen; }
            set { m_requestOpen = value; }
        }

        public RequestDelete RequestDelete
        {
            get { return m_requestDelete; }
            set { m_requestDelete = value; }
        }

        public RequestParseSpecialMessage RequestParseSpecialMessage
        {
            get { return m_requestParseSpecialMessage; }
            set { m_requestParseSpecialMessage = value; }
        }

        public bool? RequestSpecialMessageList
        {
            get { return m_requestSpecialMessageList; }
            set { m_requestSpecialMessageList = value; }
        }

        public bool? RequestLinkedSOPs
        {
            get { return m_requestLinkedSOPs; }
            set { m_requestLinkedSOPs = value; }
        }

        public SaveLinkedSOPs SaveLinkedSOPs
        {
            get { return m_saveLinkedSOPs; }
            set { m_saveLinkedSOPs = value; }
        }

        public RequestLoadLinkedSopVersions RequestLoadLinkedSopVersions
        {
            get { return m_requestLoadLinkedSopVersions; }
            set { m_requestLoadLinkedSopVersions = value; }
        }

        public CheckSectionData CheckSectionData
        {
            get { return m_checkSectionData; }
            set { m_checkSectionData = value; }
        }
    }
}
