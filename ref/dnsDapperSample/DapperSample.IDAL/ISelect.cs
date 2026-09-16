using DapperSample.Model;
using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;

namespace DapperSample.IDAL
{
    public interface ISelect
    {
        T SelectFirst<T>(string strConditions, out string strErrMsg) where T : Table, new();
        IEnumerable<T> Select<T>(string strConditions, out string strErrMsg) where T : Table, new();
        dynamic SelectFirst(string strSQL, out string strErrMsg);
        IEnumerable<dynamic> Select(string strSQL, out string strErrMsg);
        IEnumerable<T3> Select<T1, T2, T3>(string strSQL, T3 t3, out string strErrMsg) where T3 : IDataClass, new();

        IEnumerable<Regular> JoinRegular(out string strErrMsg);
    }
}
