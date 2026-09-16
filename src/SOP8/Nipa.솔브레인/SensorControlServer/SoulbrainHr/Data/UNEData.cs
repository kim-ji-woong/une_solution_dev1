namespace SoulbrainHr.Data
{
    public class UNEData
    {
        public class ForeignKeyInfo
        {
            public string ParentTable { get; set; }
            public string ParentColumn { get; set; }
            public string ReferencedTable { get; set; }
            public string ReferencedColumn { get; set; }
            public bool IsNullable { get; set; }
        }
    }
}