using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;

namespace Sop7ToSop8.Migration.Sop
{
    using Models;

    class ComponentManager
    {
        public static bool CreateComponent(IDataManager dataManager, int componentType, int addNumber, dynamic data, out string strErrorMessage)
        {
            ComponentEx component = new ComponentEx();
            component.compn_sn = data.ID + addNumber;
            component.grid_sn = data.GridID;
            component.column_no = data.GridColumnIndex;
            component.row_no = data.GridRowIndex;
            component.compn_optn_code = (int)CodeType.ComponentType;
            component.compn_code = componentType;
            component.step_memb_sn = data.StepMemberID;

            return dataManager.GetCreate().Insert<ComponentEx>(component, out strErrorMessage);
        }
    }
}
