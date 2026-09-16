using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.Model.Sensor;
using Base.Model.Common.Team;
using dnsData.CommonCode;
using System.Collections.Generic;

namespace SOPWebServer.BLL.Process
{
    // FacilityManager를 통한 상황전파
    class TransferManager
    {
        public enum TransferType { SMS = 0, Email, KakaoTalk };

        public static bool SendMessage(IDataManager dataManager, int sensorType, int detectType, int siteNo, string strMessage, TransferType transferType, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7} and {8} = {9}",
                FacilityManager.Fields.sensor_ty_optn_code,
                (int)CodeType.SensorType,
                FacilityManager.Fields.sensor_ty_code,
                sensorType,
                FacilityManager.Fields.detct_ty_optn_code,
                (int)CodeType.DetectType,
                FacilityManager.Fields.detct_ty_code,
                detectType,
                FacilityManager.Fields.site_sn,
                siteNo);

            strErrorMessage = null;
            FacilityManager facilityManager = dataManager.GetSelect().SelectFirst<FacilityManager>(strCondition, out strErrorMessage);

            if (facilityManager == null)
                return false;

            Dictionary<int, RegularMember> dicRegularMembers = new Dictionary<int, RegularMember>();

            if (GetRegularMemberFromRegular(dataManager, sensorType, detectType, dicRegularMembers, out strErrorMessage) == false)
                return false;
            if (GetRegularMemberFromRegularMember(dataManager, sensorType, detectType, dicRegularMembers, out strErrorMessage) == false)
                return false;
            if (GetRegularMemberFromTemporary(dataManager, sensorType, detectType, dicRegularMembers, out strErrorMessage) == false)
                return false;
            if (GetRegularMemberFromTemporaryMember(dataManager, sensorType, detectType, dicRegularMembers, out strErrorMessage) == false)
                return false;

            return SendMessage(dataManager, dicRegularMembers.Values, strMessage, transferType, out strErrorMessage);
        }

        private static bool GetRegularMemberFromTemporaryMember(IDataManager dataManager, int sensorType, int detectType, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6} and {7} = {8} and {9} = {10})",
                FacilityManagerTemporaryMember.Fields.fclty_mgr_sn, 
                FacilityManager.Fields.fclty_mgr_sn,
                FacilityManager.TableName,
                FacilityManager.Fields.sensor_ty_optn_code,
                (int)CodeType.SensorType,
                FacilityManager.Fields.sensor_ty_code,
                sensorType,
                FacilityManager.Fields.detct_ty_optn_code,
                (int)CodeType.DetectType,
                FacilityManager.Fields.detct_ty_code,
                detectType);

            strErrorMessage = null;
            IEnumerable<FacilityManagerTemporaryMember> facilityManagers = dataManager.GetSelect().Select<FacilityManagerTemporaryMember>(strCondition, out strErrorMessage);

            if (facilityManagers == null)
                return false;

            Dictionary<int, int> dicTemporaryMemberNos = new Dictionary<int, int>();
            string strTemporaryMemberNos = "";

            foreach (FacilityManagerTemporaryMember facilityManager in facilityManagers)
            {
                if (dicTemporaryMemberNos.ContainsKey(facilityManager.tmpr_memb_sn) == false)
                {
                    dicTemporaryMemberNos[facilityManager.tmpr_memb_sn] = facilityManager.tmpr_memb_sn;

                    if (strTemporaryMemberNos.Length == 0)
                        strTemporaryMemberNos = facilityManager.tmpr_memb_sn.ToString();
                    else
                        strTemporaryMemberNos += "," + facilityManager.tmpr_memb_sn.ToString();
                }
            }

            if (strTemporaryMemberNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_memb_sn, strTemporaryMemberNos);
                IEnumerable<TemporaryMember> temporaryMembers = dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

                if (temporaryMembers == null)
                    return false;

                return GetRegularMembersFromTemporaryMembers(dataManager, temporaryMembers, dicRegularMembers, out strErrorMessage);
            }

            return true;
        }

        private static bool GetRegularMemberFromTemporary(IDataManager dataManager, int sensorType, int detectType, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6} and {7} = {8} and {9} = {10})",
                FacilityManagerTemporary.Fields.fclty_mgr_sn,
                FacilityManager.Fields.fclty_mgr_sn,
                FacilityManager.TableName,
                FacilityManager.Fields.sensor_ty_optn_code,
                (int)CodeType.SensorType,
                FacilityManager.Fields.sensor_ty_code,
                sensorType,
                FacilityManager.Fields.detct_ty_optn_code,
                (int)CodeType.DetectType,
                FacilityManager.Fields.detct_ty_code,
                detectType);

            strErrorMessage = null;
            IEnumerable<FacilityManagerTemporary> facilityManagers = dataManager.GetSelect().Select<FacilityManagerTemporary>(strCondition, out strErrorMessage);

            if (facilityManagers == null)
                return false;

            Dictionary<int, int> dicTemporaryNos = new Dictionary<int, int>();
            string strTemporaryNos = "";

            foreach (FacilityManagerTemporary facilityManager in facilityManagers)
            {
                if (dicTemporaryNos.ContainsKey(facilityManager.tmpr_sn) == false)
                {
                    dicTemporaryNos[facilityManager.tmpr_sn] = facilityManager.tmpr_sn;

                    if (strTemporaryNos.Length == 0)
                        strTemporaryNos = facilityManager.tmpr_sn.ToString();
                    else
                        strTemporaryNos += "," + facilityManager.tmpr_sn.ToString();
                }
            }

            if (strTemporaryNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", TemporaryMember.Fields.tmpr_sn, strTemporaryNos);
                IEnumerable<TemporaryMember> temporaryMembers = dataManager.GetSelect().Select<TemporaryMember>(strCondition, out strErrorMessage);

                if (temporaryMembers == null)
                    return false;

                return GetRegularMembersFromTemporaryMembers(dataManager, temporaryMembers, dicRegularMembers, out strErrorMessage);
            }

            return true;
        }

        private static bool GetRegularMembersFromTemporaryMembers(IDataManager dataManager, IEnumerable<TemporaryMember> temporaryMembers, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            string strRegularNos = "", strRegularMemberNos = "";
            Dictionary<int, int> dicRegularNos = new Dictionary<int, int>();
            Dictionary<int, int> dicRegularMemberNos = new Dictionary<int, int>();

            foreach (TemporaryMember member in temporaryMembers)
            {
                if (member.rgl_sn != null)
                {
                    if (dicRegularNos.ContainsKey((int)member.rgl_sn) == false)
                    {
                        dicRegularNos[(int)member.rgl_sn] = (int)member.rgl_sn;

                        if (strRegularNos.Length == 0)
                            strRegularNos = ((int)member.rgl_sn).ToString();
                        else
                            strRegularNos += "," + ((int)member.rgl_sn).ToString();
                    }
                }

                if (member.rgl_memb_sn != null)
                {
                    if (dicRegularMemberNos.ContainsKey((int)member.rgl_memb_sn) == false)
                    {
                        dicRegularMemberNos[(int)member.rgl_sn] = (int)member.rgl_memb_sn;

                        if (strRegularMemberNos.Length == 0)
                            strRegularMemberNos = ((int)member.rgl_memb_sn).ToString();
                        else
                            strRegularMemberNos += "," + ((int)member.rgl_memb_sn).ToString();
                    }
                }
            }

            strErrorMessage = null;
            string strCondition = "";

            if (strRegularNos.Length == 0 && strRegularMemberNos.Length == 0)
                return true;
            else if (strRegularNos.Length == 0)
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
            else if (strRegularMemberNos.Length == 0)
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
            else
                strCondition = string.Format("{0} in ({1}) or {2} in ({3})", RegularMember.Fields.rgl_sn, strRegularNos, RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);

            IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

            if (regularMembers == null)
                return false;

            foreach (RegularMember member in regularMembers)
            {
                dicRegularMembers[member.rgl_memb_sn] = member;
            }

            return true;
        }

        private static bool GetRegularMemberFromRegular(IDataManager dataManager, int sensorType, int detectType, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4} and {5} = {6} and {7} = {8} and {9} = {10})",
                FacilityManagerRegular.Fields.fclty_mgr_sn,
                FacilityManager.Fields.fclty_mgr_sn,
                FacilityManager.TableName,
                FacilityManager.Fields.sensor_ty_optn_code,
                (int)CodeType.SensorType,
                FacilityManager.Fields.sensor_ty_code,
                sensorType,
                FacilityManager.Fields.detct_ty_optn_code,
                (int)CodeType.DetectType,
                FacilityManager.Fields.detct_ty_code,
                detectType);

            strErrorMessage = null;
            IEnumerable<FacilityManagerRegular> facilityManagers = dataManager.GetSelect().Select<FacilityManagerRegular>(strCondition, out strErrorMessage);

            if (facilityManagers == null)
                return false;

            Dictionary<int, int> dicRegularNos = new Dictionary<int, int>();
            string strRegularNos = "";

            foreach (FacilityManagerRegular facilityManager in facilityManagers)
            {
                if (dicRegularNos.ContainsKey(facilityManager.rgl_sn) == false)
                {
                    dicRegularNos[facilityManager.rgl_sn] = facilityManager.rgl_sn;

                    if (strRegularNos.Length == 0)
                        strRegularNos = facilityManager.rgl_sn.ToString();
                    else
                        strRegularNos += "," + facilityManager.rgl_sn.ToString();
                }
            }

            if (strRegularNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_sn, strRegularNos);
                IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

                if (regularMembers == null)
                    return false;

                foreach (RegularMember member in regularMembers)
                {
                    dicRegularMembers[member.rgl_memb_sn] = member;
                }
            }

            return true;
        }

        private static bool GetRegularMemberFromRegularMember(IDataManager dataManager, int sensorType, int detectType, Dictionary<int, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {0} = {1} and {2} = {3} and {4} = {5} and {6} = {7})",
                FacilityManagerRegularMember.Fields.fclty_mgr_sn,
                FacilityManager.Fields.fclty_mgr_sn,
                FacilityManager.TableName,
                FacilityManager.Fields.sensor_ty_optn_code,
                (int)CodeType.SensorType,
                FacilityManager.Fields.sensor_ty_code,
                sensorType,
                FacilityManager.Fields.detct_ty_optn_code,
                (int)CodeType.DetectType,
                FacilityManager.Fields.detct_ty_code,
                detectType);

            strErrorMessage = null;
            IEnumerable<FacilityManagerRegularMember> facilityManagers = dataManager.GetSelect().Select<FacilityManagerRegularMember>(strCondition, out strErrorMessage);

            if (facilityManagers == null)
                return false;

            Dictionary<int, int> dicRegularMemberNos = new Dictionary<int, int>();
            string strRegularMemberNos = "";

            foreach (FacilityManagerRegularMember facilityManager in facilityManagers)
            {
                if (dicRegularMemberNos.ContainsKey(facilityManager.rgl_memb_sn) == false)
                {
                    dicRegularMemberNos[facilityManager.rgl_memb_sn] = facilityManager.rgl_memb_sn;

                    if (strRegularMemberNos.Length == 0)
                        strRegularMemberNos = facilityManager.rgl_memb_sn.ToString();
                    else
                        strRegularMemberNos += "," + facilityManager.rgl_memb_sn.ToString();
                }
            }

            if (strRegularMemberNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", RegularMember.Fields.rgl_memb_sn, strRegularMemberNos);
                IEnumerable<RegularMember> regularMembers = dataManager.GetSelect().Select<RegularMember>(strCondition, out strErrorMessage);

                if (regularMembers == null)
                    return false;

                foreach (RegularMember member in regularMembers)
                {
                    dicRegularMembers[member.rgl_memb_sn] = member;
                }
            }

            return true;
        }

        private static bool SendMessage(IDataManager dataManager, IEnumerable<RegularMember> regularMembers, string strMessage, TransferType transferType, out string strErrorMessage)
        {
            strErrorMessage = null;
            return true;
        }
    }
}
