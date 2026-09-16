using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace PatrolMirrorService
{
    public class Logger
    {
        private string m_strLogFolder = "";
        private double m_dLogLifeDays = 30;
        private string m_strLogTag = "";

        private int m_nPrevYear = 0, m_nPrevMonth = 0, m_nPrevDay = 0;
        private StreamWriter m_writer = null;

        public Logger()
        {
            m_strLogTag = "Log";
            m_strLogFolder = AppContext.BaseDirectory;
        }

        public void Write(string strLog)
        {
            if (m_strLogFolder.Length == 0)
                return;

            if (!Directory.Exists(m_strLogFolder))
                Directory.CreateDirectory(m_strLogFolder);

            DateTime dtNow = DateTime.Now;

            string strFilePath = m_strLogFolder + "\\" + m_strLogTag + "\\" + string.Format("{0}{1:00}{2:00}.log", dtNow.Year, dtNow.Month, dtNow.Day);

            StreamWriter writer = m_writer;

            try
            {
                if (!File.Exists(strFilePath))
                {
                    if (writer != null)
                        writer.Close();

                    string directory = Path.GetDirectoryName(strFilePath);
                    if (!Directory.Exists(directory))
                        Directory.CreateDirectory(directory);

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

                writer.WriteLine($"[{dtNow.ToString("yyyy-MM-dd HH:mm:ss") }] " + strLog);
                writer.Flush();
            }
            catch (Exception e)
            {
                if (writer != null)
                {
                    writer.Close();
                }

                m_writer = null;
                return;
            }

            m_writer = writer;
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
    }
}
