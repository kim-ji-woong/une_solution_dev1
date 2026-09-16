using ExcelDataReader;
using System.Collections.Generic;
using System.IO;

namespace dnsExcelReport.Reader
{
    using Models;

    public abstract class ExcelReader
    {
        private string m_strFilePath = null;

        public ExcelReader(string strFilePath)
        {
            m_strFilePath = strFilePath;
        }

        public bool Run(out string strErrorMessage, object parameter = null)
        {
            if (m_strFilePath == null)
            {
                strErrorMessage = "m_strFilePath 값이 null";
                return false;
            }

            try
            {
                List<SheetData> sheetDatas = new List<SheetData>();
                
                using (var stream = File.Open(m_strFilePath, FileMode.Open, FileAccess.Read))
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        do
                        {
                            SheetData sheet = new SheetData(reader.Name);
                            sheetDatas.Add(sheet);

                            bool firstLine = true;
                            List<string> columnDatas = null;

                            while (reader.Read())
                            {
                                int nFieldCount = reader.FieldCount;

                                for (int i = 0; i < nFieldCount; i++)
                                {
                                    object value = reader.GetValue(i);

                                    if (value == null)
                                    {
                                        if (firstLine)
                                            sheet.Titles[i] = null;
                                        else
                                        {
                                            if (sheet.ColumnDatas.TryGetValue(i, out columnDatas) == false)
                                            {
                                                columnDatas = new List<string>();
                                                sheet.ColumnDatas[i] = columnDatas;
                                            }

                                            columnDatas.Add(null);
                                        }
                                    }
                                    else
                                    {
                                        if (firstLine)
                                            sheet.Titles[i] = value.ToString();
                                        else
                                        {
                                            if (sheet.ColumnDatas.TryGetValue(i, out columnDatas) == false)
                                            {
                                                columnDatas = new List<string>();
                                                sheet.ColumnDatas[i] = columnDatas;
                                            }

                                            columnDatas.Add(value.ToString());
                                        }
                                    }
                                }

                                firstLine = false;
                            }
                        }
                        while (reader.NextResult());
                    }
                }

                return UpdateData(sheetDatas, parameter, out strErrorMessage);
            }
            catch (System.Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return false;
        }

        protected int[] GetColumnCounts(SheetData sheetData, int min, int max, out int maxColumnCount)
        {
            maxColumnCount = 0;

            foreach (KeyValuePair<int, List<string>> pair in sheetData.ColumnDatas)
            {
                int nColumnCount = pair.Value.Count;

                if (maxColumnCount < nColumnCount)
                    maxColumnCount = nColumnCount;
            }

            if (min > max)
                return null;

            List<string> datas;
            int[] arrColumnCount = new int[max - min + 1];

            for (int i = min; i <= max; i++)
            {
                if (sheetData.ColumnDatas.TryGetValue(i, out datas))
                    arrColumnCount[i - min] = datas.Count;
                else
                    arrColumnCount[i - min] = 0;
            }

            return arrColumnCount;
        }

        protected abstract bool UpdateData(List<SheetData> sheetDatas, object parameter, out string strErrorMessage);
    }
}
