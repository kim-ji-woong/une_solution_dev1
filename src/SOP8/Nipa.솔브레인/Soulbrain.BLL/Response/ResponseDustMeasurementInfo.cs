using System;
using System.Collections.Generic;
using Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Response
{
    public class ResponseDustMeasurementInfo : MessageResult
    {
        private List<DustMeasurement> m_dustMeasurement = new List<DustMeasurement>();
        
        public List<DustMeasurement> DustMeasurements
        {
            get { return m_dustMeasurement; }
            set { m_dustMeasurement = value; }
        }
         
        public ResponseDustMeasurementInfo()
            : base()
        {
        }
        
        public ResponseDustMeasurementInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}