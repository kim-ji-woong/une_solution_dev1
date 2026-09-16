using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DapperSample.BLL.DataAccessLayer.IDAL
{
    public interface IDataManager2 : IDataManager
    {
        new ISelect2 GetSelect();
    }
}
