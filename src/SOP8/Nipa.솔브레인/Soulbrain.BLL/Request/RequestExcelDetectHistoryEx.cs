using System.Collections.Generic;
using Base.History.IBLL.Request;

namespace Soulbrain.BLL.Request
{
    public class RequestExcelDetectHistoryEx : RequestExcelDetectHistory
    {
        public class _PermitZones
        {
            private List<int> m_zoneNos = null;
            private List<int> m_exceptSensorNos = null;

            public List<int> ZoneNo
            {
                get { return m_zoneNos; }
                set { m_zoneNos = value; }
            }

            public List<int> ExceptSensorNo
            {
                get { return m_exceptSensorNos; }
                set { m_exceptSensorNos = value; }
            }
        }

        private _PermitZones m_permitZones = null;
        private List<int> m_permitSensorNos = null;

        public _PermitZones PermitZones
        {
            get { return m_permitZones; }
            set { m_permitZones = value; }
        }

        public List<int> PermitSensorNo
        {
            get { return m_permitSensorNos; }
            set { m_permitSensorNos = value; }
        }

        public override RequestSensorDetectHistory ToRequestSensorDetectHistory()
        {
            RequestSensorDetectHistoryEx request = (RequestSensorDetectHistoryEx)base.ToRequestSensorDetectHistory();

            if (this.PermitZones != null)
            {
                var zoneNos = this.PermitZones.ZoneNo;
                var exceptSensorNos = this.PermitZones.ExceptSensorNo;

                if (zoneNos != null && zoneNos.Count > 0 && exceptSensorNos != null && exceptSensorNos.Count > 0)
                {
                    request.PermitZones = new RequestSensorDetectHistoryEx._PermitZones();
                    request.PermitZones.ZoneNo = zoneNos;
                    request.PermitZones.ExceptSensorNo = exceptSensorNos;
                }
            }

            if (this.PermitSensorNo != null)
                request.PermitSensorNo = this.PermitSensorNo;

            return request;
        }

        protected override RequestSensorDetectHistory MakeRequestSensorDetectHistory()
        {
            return new RequestSensorDetectHistoryEx();
        }
    }
}
