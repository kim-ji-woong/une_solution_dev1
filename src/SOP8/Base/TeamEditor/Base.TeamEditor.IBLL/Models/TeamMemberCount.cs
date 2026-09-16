namespace Base.TeamEditor.IBLL.Models
{
    public class TeamMemberCount
    {
        public int RegularSn { get; set; }
        public int Count { get; set; }

        public TeamMemberCount()
        {
        }

        public TeamMemberCount(int regularSn, int count)
        {
            RegularSn = regularSn;
            Count = count;
        }
    }
}
