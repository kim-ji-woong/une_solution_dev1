using System.Collections.Generic;
using Response;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Response
{
    public class ResponseWaterGatherInfo : MessageResult
    {
        private WaterGather m_waterGather = new WaterGather();
        
        public WaterGather WaterGather
        {
            get { return m_waterGather; }
            set { m_waterGather = value; }
        }

        public ResponseWaterGatherInfo()
            : base()
        {
            
        }
        
        public ResponseWaterGatherInfo(bool success, string message) 
            : base(success, message)
        {
            
        }
        
    }
}