using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Windows.Forms;

namespace Sop7ToSop8.Migration
{
    interface IMigrationClient
    {
        IDataManager Sop7DataManager
        {
            get;
        }

        IDataManager Sop8DataManager
        {
            get;
        }

        void SendStatus(string strStatus);
        void Finish();
        DialogResult CheckInterrupt();
    }
}
