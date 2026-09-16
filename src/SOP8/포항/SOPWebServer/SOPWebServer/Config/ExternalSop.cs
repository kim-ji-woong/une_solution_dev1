using Microsoft.Extensions.Configuration;

namespace SOPWebServer.Config
{
    public class ExternalSop
    {
        private int m_nSclasSn = 0;
        private int m_nDedupWindowSeconds = 0;

        public int SclasSn
        {
            get { return m_nSclasSn; }
            set { m_nSclasSn = value; }
        }

        // 재시도 중복 판정 시간창(초). 미설정/0/음수이면 기본값 30을 사용한다.
        // appsettings.json 예시: "ExternalSop": { "SclasSn": 1, "DedupWindowSeconds": 30 }
        public int DedupWindowSeconds
        {
            get { return m_nDedupWindowSeconds > 0 ? m_nDedupWindowSeconds : 30; }
            set { m_nDedupWindowSeconds = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadInt(config, "ExternalSop:SclasSn", ref m_nSclasSn);
            ReadInt(config, "ExternalSop:DedupWindowSeconds", ref m_nDedupWindowSeconds);
        }

        private void ReadInt(IConfiguration config, string strTarget, ref int nValue)
        {
            string strData = config[strTarget];

            if (strData != null)
            {
                int data;

                if (int.TryParse(strData.Trim(), out data))
                    nValue = data;
            }
        }
    }
}
