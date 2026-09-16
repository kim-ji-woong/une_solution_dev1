using System;
using Base.Model.Sop.Config;

namespace Sop7ToSop8.Migration.Sop.Models
{
    class LinkedSopEx : LinkedSop
    {
        // IDENTITY ON 상태에서 사용할 수 있도록 한다.
        public override Type GetWriteFieldType()
        {
            return typeof(Fields);
        }
    }
}
