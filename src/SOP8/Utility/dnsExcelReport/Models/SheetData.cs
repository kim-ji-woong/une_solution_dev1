using System;
using System.Collections.Generic;
using NPOI.SS.UserModel;

namespace dnsExcelReport.Models
{
    public class SheetData : IComparable
    {
        private string m_strSheetName = "";
        // 첫번째 행의 데이터들
        // Key : ColumnIndex
        private Dictionary<int, string> m_dicTitles = new Dictionary<int, string>();
        private Dictionary<int, ICellStyle> m_dicTitleStyles = new Dictionary<int, ICellStyle>();
        // Key : ColumnIndex
        private Dictionary<int, List<string>> m_dicColumnDatas = new Dictionary<int, List<string>>();
        // Value.Key : ColumnData Index
        private Dictionary<int, Dictionary<int, ICellStyle>> m_dicCellStyles = new Dictionary<int, Dictionary<int, ICellStyle>>();
        private int? m_titleRowHeight = null;
        // Key : ColumnIndex
        private Dictionary<int, int> m_dicRowHeight = new Dictionary<int, int>();
        private object m_tag = null;

        public string SheetName
        {
            get { return m_strSheetName; }
            set { m_strSheetName = value; }
        }

        // 첫번째 행의 데이터들
        // Key : ColumnIndex
        public Dictionary<int, string> Titles
        {
            get { return m_dicTitles; }
        }

        // Key : ColumnIndex
        public Dictionary<int, ICellStyle> TitleStyles
        {
            get { return m_dicTitleStyles; }
        }

        // Key : ColumnIndex
        public Dictionary<int, List<string>> ColumnDatas
        {
            get { return m_dicColumnDatas; }
        }

        // Key : ColumnIndex
        // Value.Key : ColumnData Index
        public Dictionary<int, Dictionary<int, ICellStyle>> CellStyles
        {
            get { return m_dicCellStyles; }
        }

        public int? TitleRowHeight
        {
            get { return m_titleRowHeight; }
            set { m_titleRowHeight = value; }
        }

        // Key : ColumnIndex
        public Dictionary<int, int> RowHeight
        {
            get { return m_dicRowHeight; }
        }

        public object Tag
        {
            get { return m_tag; }
            set { m_tag = value; }
        }

        public SheetData(string strSheetName)
        {
            m_strSheetName = strSheetName;
        }

        public int CompareTo(object obj)
        {
            SheetData data1 = this;
            SheetData data2 = (SheetData)obj;
            return data1.m_strSheetName.CompareTo(data2.m_strSheetName);
        }
    }
}
