using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SDMS.IBLL.Models
{
    public class ErrorCode
    {
        public const int None = 0;

        /// <summary>
        /// DB Error : 1000 ~ 1999
        /// </summary>
        public const int BeginTransactionFail = 1000;
        public const int CommitTransactionFail = 1001;
        public const int DuplicateData = 1100;
        public const int NoParameters = 1101;
        public const int InvalidParameters = 1102;
        public const int UnknownError = 1999;
    }

    public class DBError
    {
        public static int GetInsertErrorCode(string strMessage)
        {
            if (strMessage == null)
                return ErrorCode.UnknownError;

            if (strMessage.ToLower().Contains("uk_"))
                return ErrorCode.DuplicateData;

            return ErrorCode.UnknownError;
        }
    }
}
