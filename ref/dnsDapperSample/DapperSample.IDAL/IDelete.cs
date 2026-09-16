using DapperSample.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.IDAL
{
    public interface IDelete
    {
        bool Delete<T>(string strConditions, out string strErrMsg) where T : Table, new();
        bool Delete<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table, new();
    }
}
