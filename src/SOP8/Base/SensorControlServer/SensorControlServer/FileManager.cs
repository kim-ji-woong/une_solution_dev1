using System.Text;
using System.IO;
using System.Windows.Forms;
using System.Collections.Generic;

namespace SensorControlServer
{
    class FileManager
    {
        private static string m_strDataFilePath = "process.dat";

        public static void WriteFile(DataGridView grid, string strOwnFolderPath)
        {
            string strPath = strOwnFolderPath.EndsWith("\\") == false ? strOwnFolderPath + "\\" + m_strDataFilePath : strOwnFolderPath + m_strDataFilePath;
            StreamWriter writer = new StreamWriter(strPath, false, Encoding.UTF8);

            int rowCount = grid.Rows.Count;

            char chBegin = (char)0x02;
            char chEnd = (char)0x03;
            string strEnd = chEnd.ToString();

            for (int i=0;i<rowCount;i++)
            {
                DataGridViewRow row = grid.Rows[i];

                if (row != null)
                {
                    string strInfo = null;

                    if (row.Tag != null && row.Tag is string)
                        strInfo = (string)row.Tag;

                    string strLine = string.Format("{3}\t{0}\t{1}\t{2}", GetValueString(1, row), GetValueString(2, row), GetValueString(3, row), chBegin);
                    writer.WriteLine(strLine);

                    if (strInfo != null && strInfo.Trim().Length > 0)
                        writer.WriteLine(strInfo);

                    writer.WriteLine(strEnd);
                }
            }

            writer.Close();
        }

        public static List<string> ReadFile(string strFolderPath)
        {
            string strFilePath = strFolderPath + "\\" + m_strDataFilePath;
            if (File.Exists(strFilePath) == false)
                return null;

            List<string> results = new List<string>();

            StreamReader reader = new StreamReader(strFilePath, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine();
                results.Add(strLine);
            }

            reader.Close();
            return results;
        }

        private static string GetValueString(int index, DataGridViewRow row)
        {
            if (row.Cells[index].Value == null)
                return "";

            return row.Cells[index].Value.ToString();
        }
    }
}
