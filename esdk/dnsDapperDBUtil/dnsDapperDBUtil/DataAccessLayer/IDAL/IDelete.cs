namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public interface IDelete
    {
        bool Delete<T>(string strConditions, out string strErrMsg) where T : Table, new();
        bool Delete<T>(T t, string strAdditionalConditions, out string strErrMsg) where T : Table;
    }
}
