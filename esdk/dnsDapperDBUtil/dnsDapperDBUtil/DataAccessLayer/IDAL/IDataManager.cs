using dnsDapperDBUtil.Manager;

namespace dnsDapperDBUtil.DataAccessLayer.IDAL
{
    public interface IDataManager
    {
        WebDBManager GetDBManager();
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
