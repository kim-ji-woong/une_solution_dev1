using System;
using Base.Model.History;

namespace Sop7ToSop8.Migration.History.Models
{
    class SensorReactionHistoryEx : SensorReaction
    {
        // IDENTITY ON 상태에서 사용할 수 있도록 한다.
        public override Type GetWriteFieldType()
        {
            return typeof(Fields);
        }
    }
}
