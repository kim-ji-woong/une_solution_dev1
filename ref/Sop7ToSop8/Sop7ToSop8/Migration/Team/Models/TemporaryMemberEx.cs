using System;
using Base.Model.Common.Team;

namespace Sop7ToSop8.Migration.Team.Models
{
    class TemporaryMemberEx : TemporaryMember
    {
        public override Type GetWriteFieldType()
        {
            // IDENTITY ON 상태에서 사용할 수 있도록 한다.
            return typeof(Fields);
        }
    }
}
