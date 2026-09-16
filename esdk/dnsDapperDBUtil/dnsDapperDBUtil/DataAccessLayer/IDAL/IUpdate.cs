using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public interface IUpdate
    {
        bool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new();
        bool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table;        
        bool Update<T>(List<T> t, out string strErrMsg) where T : Table;
        bool UpdateGeometry<T>(T t, out string strErrMsg) where T : Table;
        bool UpdateGeometry<T>(List<T> t, out string strErrMsg) where T : Table;
        bool Update(string strSQL, out string strErrMsg);
    }
}
