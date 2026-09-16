using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.IDAL
{
    public interface IUpdate
    {
        bool Update<T, Fields>(Dictionary<Fields, object> dicSets, string strConditions, out string strErrMsg) where T : Table, new();
        bool Update<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new();
    }
}
