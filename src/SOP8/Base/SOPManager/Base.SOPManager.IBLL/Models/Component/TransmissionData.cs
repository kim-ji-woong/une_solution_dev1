using System.Collections.Generic;
using Base.Model.Sop.Component;

namespace Base.SOPManager.IBLL.Models.Component
{
    public class TransmissionData : Base.Model.Sop.Component.Component
    {
        private Transmission m_transmission = null;
        private List<TransmissionRegular> m_regulars = new List<TransmissionRegular>();
        private List<TransmissionTemporaryEx> m_temporaries = new List<TransmissionTemporaryEx>();

        public Transmission Transmission
        {
            get { return m_transmission; }
            set { m_transmission = value; }
        }

        public List<TransmissionRegular> Regulars
        {
            get { return m_regulars; }
        }

        public List<TransmissionTemporaryEx> Temporaries
        {
            get { return m_temporaries; }
        }
    }

    public class TransmissionTemporaryEx : TransmissionTemporary
    {
        private bool? m_nor_yn = null;

        public bool? nor_yn
        {
            get { return m_nor_yn; }
            set { m_nor_yn = value; }
        }

        public TransmissionTemporaryEx()
        {
        }

        public TransmissionTemporaryEx(int compn_sn, int tmpr_sn, bool? nor_yn = null)
        {
            this.compn_sn = compn_sn;
            this.tmpr_sn = tmpr_sn;
            this.nor_yn = nor_yn;
        }
    }
}
