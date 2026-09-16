namespace Base.SOPManager.BLL.Models
{
    /// <summary>
    /// 연결 설정된 SOP의 버전 개수
    /// ex) A SOP의 버전이 몇 개인지
    /// </summary>
    public class LinkedSopCountByVersion
    {
        public int LinkedSopNo { get; set; }
        public int Count { get; set; }
    }
}
