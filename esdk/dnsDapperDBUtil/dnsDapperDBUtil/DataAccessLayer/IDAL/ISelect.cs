using dnsDapperDBUtil.Interfaces;
using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public interface ISelect
    {
        T SelectFirst<T>(string strConditions, out string strErrMsg) where T : Table, new();
        IEnumerable<T> Select<T>(string strConditions, out string strErrMsg) where T : Table, new();
        List<T> SelectGeometry<T>(string strConditions, out string strErrMsg) where T : Table, new();
        dynamic SelectFirst(string strSQL, out string strErrMsg);
        IEnumerable<dynamic> Select(string strSQL, out string strErrMsg);
        IEnumerable<T3> Select<T1, T2, T3>(string strSQL, T3 t3, out string strErrMsg) where T3 : IDataClass, new();

        int GetColumnMaximumLength(string strTableName, string strColumnName, out string strErrMsg);
    }
}
