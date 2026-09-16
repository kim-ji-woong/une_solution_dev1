using System;

namespace Sop7ToSop8.Migration.Option.Models
{
    class OptionEx : Base.Model.Common.Option
    {
        // IDENTITY ON 상태에서 사용할 수 있도록 한다.
        public override Type GetWriteFieldType()
        {
            return typeof(Fields);
        }
    }
}
