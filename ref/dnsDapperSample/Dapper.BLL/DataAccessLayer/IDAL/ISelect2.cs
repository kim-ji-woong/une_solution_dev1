using DapperSample.Model;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;

namespace DapperSample.BLL.DataAccessLayer.IDAL
{
    public interface ISelect2 : ISelect
    {
        IEnumerable<Regular> JoinRegular(out string strErrMsg);
    }
}
