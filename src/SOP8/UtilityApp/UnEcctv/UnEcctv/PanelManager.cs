using System.Collections.Generic;

namespace UnEcctv
{
    using Data;

    class PanelManager
    {
        public enum ProcessMessageType
        {
            OpenCCTV = 1,
            ShowCCTV
        }

        private IProcessOwner m_owner = null;

        public PanelManager(IProcessOwner owner)
        {
            m_owner = owner;
        }

        public void ProcessMessage(string strMessage)
        {
            string[] tokens = strMessage.Split(',');
            int tokenCount = tokens.Length;

            int header;

            if (int.TryParse(tokens[0].Trim(), out header))
            {
                if (header == (int)ProcessMessageType.OpenCCTV)
                    OpenCCTV(tokens, tokenCount);
                else if (header == (int)ProcessMessageType.ShowCCTV)
                    ShowCCTV(tokens, tokenCount);
            }
        }

        private void ShowCCTV(string[] tokens, int tokenCount)
        {
            if (tokenCount >= 2)
            {
                bool? visible = GetBoolean(tokens[1].Trim());

                if (visible == true)
                    m_owner.SetVisible(true);
                else if (visible == false)
                    m_owner.SetVisible(false);
            }
        }

        private void OpenCCTV(string[] tokens, int tokenCount)
        {
            int cctvNo;
            List<int> nos = new List<int>();
            Dictionary<int, int> dicCCTVNos = new Dictionary<int, int>();

            int markNo;
            int? mark = null;

            if (tokenCount >= 2)
            {
                if (int.TryParse(tokens[1].Trim(), out markNo))
                    mark = markNo;
            }

            for (int i = 2; i < tokenCount; i++)
            {
                if (int.TryParse(tokens[i].Trim(), out cctvNo))
                {
                    nos.Add(cctvNo);
                    dicCCTVNos[i - 1] = cctvNo;
                }
            }

            int index = 0;

            if (nos.Count > 0)
            {
                Dictionary<int, CCTVData> dicCCTVDatas = m_owner.ReadCCTVDatas(nos);

                if (dicCCTVDatas != null)
                {
                    CCTVData data;

                    foreach (KeyValuePair<int, int> pair in dicCCTVNos)
                    {
                        if (dicCCTVDatas.TryGetValue(pair.Value, out data))
                        {
                            m_owner.GetPanel(index).Data = data;
                            m_owner.GetPanel(index++).Visible = true;
                        }
                    }
                }
            }

            for (int i = index; i < 4; i++)
            {
                m_owner.GetPanel(i).Visible = false;
            }

            m_owner.CheckBigPanel();
            m_owner.SetMark(mark);
        }

        private bool? GetBoolean(string str)
        {
            string strLower = str.ToLower();

            if (strLower == "1" || strLower == "true")
                return true;
            else if (strLower == "0" || strLower == "false")
                return false;

            return false;
        }
    }

    interface IProcessOwner
    {
        VlcPanel GetPanel(int index);
        Dictionary<int, CCTVData> ReadCCTVDatas(List<int> ids);
        void SetVisible(bool visible);
        void CheckBigPanel();
        void SetMark(int? markNo);
    }
}
