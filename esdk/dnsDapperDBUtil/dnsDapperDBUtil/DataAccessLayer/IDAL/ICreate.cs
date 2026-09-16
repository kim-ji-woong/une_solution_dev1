using System.Collections.Generic;

namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public interface ICreate
    {
        bool Insert<T>(T addT, out string strErrMsg) where T : Table;
        bool InsertGeometry<T>(T addT, out string strErrMsg) where T : Table;
        bool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table;
        bool Insert<T>(List<T> t, out string strErrMsg) where T : Table, new();
        bool Insert(string strSQL, out string strErrMsg);
    }
}
