using System;
using System.IO;
using System.Text;
using System.Windows.Forms;
using Microsoft.Extensions.Configuration;

namespace PohangSensorServer
{
    public class Logger
    {
        private static Logger m_instance = null;

        private string m_strLogFolder = "";
        private int m_nLogLifeDays = 30;
        private string m_strLogTag = "";

        private static int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;

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

        private Logger()
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var logConfig = new Config.Config.Log();
            configuration.GetSection("Log").Bind(logConfig);

            m_strLogFolder = logConfig.logFolder;
            m_strLogTag = logConfig.logFileTag;
            m_nLogLifeDays = logConfig.logLifeTime;
        }

        public void Write(string strLog)
        {
            if (m_strLogFolder.Length == 0)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            DateTime dtNow = DateTime.Now;

            string strFilePath = m_strLogFolder + string.Format("\\{3}_{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day, m_strLogTag);
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

                string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
                writer.WriteLine("[" + strTime + "] " + strLog);
                writer.Flush();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                
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

        public Logger Clone(string strTag)
        {
            Logger logger = new Logger();
            logger.m_strLogTag = strTag;
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

            DateTime dtLimit = dtNow.AddDays(-m_nLogLifeDays);
            string strDate = string.Format("{0}{1:00}{2:00}", dtLimit.Year, dtLimit.Month, dtLimit.Day);

            foreach (string strFile in Directory.GetFiles(m_strLogFolder, "*.log"))
            {
                int nIndex = strFile.LastIndexOf('_');

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
