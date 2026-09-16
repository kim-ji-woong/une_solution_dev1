using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.Collections.Generic;
using System.IO;
using System;
using System.Collections;

namespace dnsExcelReport.Writer
{
    using Models;

    public abstract class ExcelWriter
    {
        public enum TableHeaderMode { Left = 1, Middle = 2, Right = 4 };
        public enum TableBodyRow { Top = 1, Middle = 2, Bottom = 4 };

        public ExcelWriter()
        {
        }

        public byte[] Run(out string strErrorMessage)
        {
            try
            {
                strErrorMessage = null;
                HSSFWorkbook workbook = MakeWorkbook();

                if (workbook == null)
                    return null;

                ICollection<SheetData> sheetDatas = ReadSheetDatas(workbook, out strErrorMessage);

                if (sheetDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                WriteSheetDatas(workbook, sheetDatas);

                byte[] bytes = null;

                using (MemoryStream stream = new MemoryStream())
                {
                    workbook.Write(stream);
                    bytes = stream.ToArray();
                }

                workbook.Close();
                return bytes;
            }
            catch (System.Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return null;
        }

        protected void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas)
        {
            foreach (SheetData sheetData in sheetDatas)
            {
                ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

                if (sheet == null)
                    return;

                int nextRowIndex = WritePrev(sheet, workbook);

                IRow row = sheet.CreateRow(nextRowIndex);

                if (sheetData.TitleRowHeight != null)
                    row.HeightInPoints = (int)sheetData.TitleRowHeight;

                int min, max;

                if (GetMinMax(sheetData.Titles, out max, out min) == false)
                    continue;

                string strTitle;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.Titles.TryGetValue(i, out strTitle))
                    {
                        ICell cell = row.CreateCell(i);

                        ICellStyle style;

                        if (sheetData.TitleStyles.TryGetValue(i, out style))
                            cell.CellStyle = style;

                        if (cell != null && strTitle != null)
                            cell.SetCellValue(strTitle);
                    }
                }

                List<string> values;
                // Key : Column Index
                Dictionary<int, IRow> dicColumnRows = new Dictionary<int, IRow>();

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.ColumnDatas.TryGetValue(i, out values))
                    {
                        int nValueCount = values.Count;

                        for (int j = 0; j < nValueCount; j++)
                        {
                            if (dicColumnRows.TryGetValue(j, out row) == false)
                            {
                                row = sheet.CreateRow(j + 1 + nextRowIndex);
                                dicColumnRows[j] = row;

                                int rowHeight;

                                if (sheetData.RowHeight.TryGetValue(j, out rowHeight))
                                    row.HeightInPoints = rowHeight;
                            }

                            string str = values[j];
                            ICell cell = row.CreateCell(i);

                            Dictionary<int, ICellStyle> dicStyles;

                            if (sheetData.CellStyles.TryGetValue(i, out dicStyles))
                            {
                                ICellStyle style;

                                if (dicStyles.TryGetValue(j, out style))
                                    cell.CellStyle = style;
                            }

                            if (cell != null && str != null)
                                cell.SetCellValue(str);
                        }
                    }
                }

                WritePost(sheet, workbook);
            }
        }

        protected virtual int WritePrev(ISheet sheet, HSSFWorkbook workbook)
        {
            return 0;
        }

        protected virtual void WritePost(ISheet sheet, HSSFWorkbook workbook)
        {
        }

        protected bool GetMinMax(Dictionary<int, string> dicTitles, out int max, out int min)
        {
            max = -1;
            min = 1;

            foreach (KeyValuePair<int, string> pair in dicTitles)
            {
                if (min > max)
                {
                    min = max = pair.Key;
                }
                else
                {
                    if (min > pair.Key)
                        min = pair.Key;

                    if (max < pair.Key)
                        max = pair.Key;
                }
            }

            return min <= max;
        }

        private HSSFWorkbook MakeWorkbook()
        {
            string strCompany = "유엔이";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook(/*stream*/);

            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            //create a entry of SummaryInformation
            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = GetSubject();
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        protected abstract ICollection<SheetData> ReadSheetDatas(HSSFWorkbook workbook, out string strErrorMessage);
        protected abstract string GetSubject();

        public virtual string GetFileName()
        {
            return GetFileName(GetSubject());
        }

        protected string GetFileName(string strTag)
        {
            DateTime dtNow = DateTime.Now;
            return string.Format("{0}_{1}{2:00}{3:00}_{4:00}{5:00}{6:00}.xls", strTag, dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
        }

        protected static bool IsLeft(int mode)
        {
            if ((mode & (int)TableHeaderMode.Left) == (int)TableHeaderMode.Left)
                return true;

            return false;
        }

        protected static bool IsHMiddle(int mode)
        {
            if ((mode & (int)TableHeaderMode.Middle) == (int)TableHeaderMode.Middle)
                return true;

            return false;
        }

        protected static bool IsRight(int mode)
        {
            if ((mode & (int)TableHeaderMode.Right) == (int)TableHeaderMode.Right)
                return true;

            return false;
        }

        protected static bool IsTop(int mode)
        {
            if ((mode & (int)TableBodyRow.Top) == (int)TableBodyRow.Top)
                return true;

            return false;
        }

        protected static bool IsVMiddle(int mode)
        {
            if ((mode & (int)TableBodyRow.Middle) == (int)TableBodyRow.Middle)
                return true;

            return false;
        }

        protected static bool IsBottom(int mode)
        {
            if ((mode & (int)TableBodyRow.Bottom) == (int)TableBodyRow.Bottom)
                return true;

            return false;
        }
    }
}
