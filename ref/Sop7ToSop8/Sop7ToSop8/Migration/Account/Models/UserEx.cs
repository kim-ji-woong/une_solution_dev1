using System;
using Base.Model.Account;

namespace Sop7ToSop8.Migration.Account.Models
{
    class UserEx : User
    {
        // IDENTITY ON 상태에서 사용할 수 있도록 한다.
        public override Type GetWriteFieldType()
        {
            return typeof(Fields);
        }
    }
}
