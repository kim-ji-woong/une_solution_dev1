using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using dnsData.CommonCode;

namespace IntegrationServer
{
    public class Logger
    {
        private static Logger m_instance = null;

        private string m_strLogFolder = "";
        private double m_dLogLifeDays = 30;
        private string m_strLogTag = "";

        private int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;

        //private DateTime m_dtLastDeleteLogfile = DateTime.Now.AddDays(-1);

        private StreamWriter m_writer = null;

        public static Logger Instance
        {
            get
            {
                if (m_instance == null)
                    m_instance = new Logger();

                return m_instance;
            }
        }

        public string LogFolder
        {
            get { return m_strLogFolder; }
        }

        private Logger()
        {
            m_strLogFolder = Application.StartupPath; //System.Configuration.ConfigurationManager.AppSettings["logFolder"].ToString();
            m_strLogTag = "IntegrationServer";

            string strLifeTime = "30";
            double.TryParse(strLifeTime, out m_dLogLifeDays);
        }

        public void Write(LogTypes logType, int serverType, int nServerSeqNo, string strLog)
        {
            if (m_strLogFolder.Length == 0)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            DateTime dtNow = DateTime.Now;
            
            string strServerType = GetServerTypeString(serverType);

            string strFilePath = m_strLogFolder + "\\" + strServerType + "\\" + string.Format("{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day);
            
            StreamWriter writer = m_writer;

            try
            {
                if (!File.Exists(strFilePath))
                {
                    if (writer != null)
                        writer.Close();

                    writer = new StreamWriter(strFilePath, false, Encoding.UTF8);
                    // 날짜가 바뀌면 이전 로그를 지운다.
                    RemoveOldLogs();
                }
                else if (writer == null)
                {
                    writer = new StreamWriter(strFilePath, true, Encoding.UTF8);
                    // 처음 동작시 이전 로그를 지운다.
                    RemoveOldLogs();
                }

                writer.WriteLine($"[{logType}][{dtNow.ToString("yyyy-MM-dd HH:mm:ss") }] " + strLog);
                writer.Flush();
            }
            catch (Exception ex)
            {
                if (writer != null)
                {
                    writer.Close();
                }

                m_writer = null;
                return;
            }

            /*if (m_dtLastDeleteLogfile.AddDays(1) < dtNow)
            {
                m_dtLastDeleteLogfile = dtNow;
                RemoveOldLogs();
            }*/


            m_writer = writer;
        }

        public Logger Clone(string strPath, string strTag)
        {
            Logger logger = new Logger();
            logger.m_strLogTag = strTag;
            if (strPath != null && strPath.Length > 0)
                logger.m_strLogFolder = strPath + "\\" + strTag + "\\";
            else
                logger.m_strLogFolder = logger.m_strLogFolder + strTag + "\\";
            return logger;
        }

        public void Close()
        {
            StreamWriter writer = m_writer;

            try
            {
                if (writer != null)
                {
                    writer.Close();
                }
            }
            catch (Exception)
            {
            }

            m_writer = null;
        }

        public string GetServerTypeString(int serverType)
        {
            string strServerType = "";
            if (serverType == SdmsSensor.ServerType.Fire_Johnson)
                strServerType = "Fire_Johnson";
            else if (serverType == SdmsSensor.ServerType.Fire_Siemens)
                strServerType = "Fire_Siemens";
            else if (serverType == SdmsSensor.ServerType.Soulbrain_Hancom)
                strServerType = "Soulbrain_Hancom";
            else if (serverType == SdmsSensor.ServerType.Soulbrain_HR)
                strServerType = "Soulbrain_HR";
            else
                strServerType = "Undefined";
            
            return strServerType;
        }

        public void RemoveOldLogs()
        {
            if (!Directory.Exists(m_strLogFolder))
                return;

            DateTime dtNow = DateTime.Now;

            if (dtNow.Year != m_nPrevYear || dtNow.Month != m_nPrevMonth || dtNow.Day != m_nPrevDay)
            {
                m_nPrevYear = dtNow.Year;
                m_nPrevMonth = dtNow.Month;
                m_nPrevDay = dtNow.Day;
            }
            else
                return;

            DateTime dtLimit = dtNow.AddDays(-m_dLogLifeDays);
            string strDate = string.Format("{0}{1:00}{2:00}", dtLimit.Year, dtLimit.Month, dtLimit.Day);

            foreach (string strFile in Directory.GetFiles(m_strLogFolder, "*.log"))
            {
                int nIndex = strFile.LastIndexOf("\\");

                if (nIndex < 0)
                    continue;

                string strFileDate = strFile.Substring(nIndex + 1, 8);

                if (strFileDate.CompareTo(strDate) < 0)
                    File.Delete(strFile);
            }
        }

        public static string GetByteString(byte[] bytes, int nIndex, int len)
        {
            string strBytes = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                byte b = bytes[i];

                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }
    }
}
