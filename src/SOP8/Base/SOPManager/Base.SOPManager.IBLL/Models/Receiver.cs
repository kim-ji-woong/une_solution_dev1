namespace Base.SOPManager.IBLL.Models
{
    public class Receiver
    {
        public enum TeamDataType { None = -1, RegularTeam = 0, TemporaryNormalTeam, TemporaryEmergencyTeam };

        private int m_nTeamType = (int)TeamDataType.None;
        private int m_nTeamNo = -1;

        public int TeamType
        {
            get { return m_nTeamType; }
            set { m_nTeamType = value; }
        }

        public int TeamNo
        {
            get { return m_nTeamNo; }
            set { m_nTeamNo = value; }
        }

        public Receiver()
        {
        }

        public Receiver(int nTeamType, int nTeamNo)
        {
            if (nTeamType >= (int)TeamDataType.RegularTeam && nTeamType <= (int)TeamDataType.TemporaryNormalTeam)
                m_nTeamType = nTeamType;
            else
                m_nTeamType = (int)TeamDataType.None;

            m_nTeamNo = nTeamNo;
        }
    }
}
