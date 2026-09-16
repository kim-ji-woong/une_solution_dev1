using System;
using System.IO;
using System.Text;

namespace GGHTService
{
    using Managers;

    class Logger
    {
        private static Logger m_instance = null;

        private string m_strLogFolder = "";
        private double m_dLogLifeDays = 30;
        private string m_strLogTag = "";

        private int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;

        private DateTime m_dtLastDeleteLogfile = DateTime.Now.AddDays(-1);

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
            m_strLogFolder = ConfigManager.LogFolder;
            m_strLogTag = ConfigManager.LogFileTag;
            m_dLogLifeDays = ConfigManager.LogLifeDays;
        }

        public void Write(string strLog)
        {
            string strLogFolder = m_strLogFolder;

            if (strLogFolder.Length == 0)
                return;

            if (strLogFolder.EndsWith("\\") || strLogFolder.EndsWith("/"))
                strLogFolder = strLogFolder.Substring(0, strLogFolder.Length - 1);

            if (!Directory.Exists(strLogFolder))
                Directory.CreateDirectory(strLogFolder);

            DateTime dtNow = DateTime.Now;

            string strFilePath = strLogFolder + "\\" + m_strLogTag + string.Format("_{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day);
            StreamWriter writer = m_writer;

            try
            {
                if (!File.Exists(strFilePath))
                {
                    if (writer != null)
                        writer.Close();

                    writer = new StreamWriter(strFilePath, false, Encoding.UTF8);
                }
                else if (writer == null)
                {
                    writer = new StreamWriter(strFilePath, true, Encoding.UTF8);
                }

                writer.WriteLine($"[{dtNow.ToString("yyyy-MM-dd HH:mm:ss")}] " + strLog);
                writer.Flush();
            }
            catch (Exception /*ex*/)
            {
                if (writer != null)
                {
                    writer.Close();
                }

                m_writer = null;
                return;
            }

            if (m_dtLastDeleteLogfile.AddDays(1) < dtNow)
            {
                m_dtLastDeleteLogfile = dtNow;
                RemoveOldLogs();
            }


            m_writer = writer;
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

        public void RemoveOldLogs()
        {
            if (!Directory.Exists(m_strLogFolder))
                return;

            DateTime dtNow = DateTime.Now;

            if (dtNow.Year != m_nPrevYear && dtNow.Month != m_nPrevMonth && dtNow.Day != m_nPrevDay)
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

        public static string GetByteString(byte[] bytes)
        {
            string strBytes = "";

            foreach (byte b in bytes)
            {
                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }
    }
}
