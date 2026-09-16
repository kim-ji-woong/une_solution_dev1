using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.IDAL
{
    public interface IDataManager
    {
        ISelect GetSelect();
        ICreate GetCreate();
        IDelete GetDelete();
        IUpdate GetUpdate();

        bool BeginBatch(out string strErrMsg);
        bool BatchCommit(out string strErrMsg);
        bool BatchRollback(out string strErrMsg);
        IDataManager Clone();
    }
}
