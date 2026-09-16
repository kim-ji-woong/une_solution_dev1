using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.IDAL
{
    public interface ICreate
    {
        bool Insert<T>(T addT, out string strErrMsg) where T : Table, new();
        bool Insert<T>(T addT, out int nAddID, out string strErrMsg) where T : Table, new();
        bool Insert<T>(List<T> t, out string strErrMsg) where T : Table, new();
    }
}
