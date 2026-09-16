using Base.Model.Sensor;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDataKftc.CommonCode;
using Kftc.Model.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static dnsDataKftc.CommonCode.SdmsSensor;

namespace AccessControl
{
    class AccessDataManager
    {
        private const string CODE_ENTRY = "4200";
        private const string CODE_EXIT = "4201";

        private const string KEY_DOOR = "DOOR_";


        private const int PERSON_TYPE_VISIT_2 = 2;
        private const int PERSON_TYPE_VISIT_3 = 3;

        private DataManager m_dataManager = null;
        private AccessControlManager m_parent = null;

        // 스피드 게이트 [출구 Device ID - 입구 Device ID]
        private Dictionary<int, int> SPEED_EXIT = null;


        public AccessDataManager(AccessControlManager parent, DataManager dataManager)
        {
            m_parent = parent;
            m_dataManager = dataManager;

            SPEED_EXIT = new Dictionary<int, int>();
            SPEED_EXIT[3497] = 3494;
            SPEED_EXIT[3503] = 3500;
            SPEED_EXIT[3509] = 3506;
        }

        public List<ComingPerson> GetAccessEvents(int? nAlarmID, Dictionary<string, DoorInfo> doorInfos, out string strErrMsg)
        {
            List<ComingPerson> comingPeople = new List<ComingPerson>();
            strErrMsg = null;

            try
            {
                string strSQL = string.Format(@$"SELECT AlarmID, VIEW_ACCESS_EVENT.DeviceID, VIEW_ACCESS_EVENT.AccessTime, VIEW_ACCESS_EVENT.DeviceName, VIEW_ACCESS_EVENT.LocationName, VIEW_ACCESS_EVENT.Sabun, VIEW_ACCESS_EVENT.CardNo, StatusName, State,  
                                                View_Card_Person.Name, View_Card_Person.OrgName, View_Card_Person.GradeName, View_Card_Person.PersonType
                                                FROM VIEW_ACCESS_EVENT 
                                                INNER JOIN View_Card_Person ON View_Card_Person.CardNo = VIEW_ACCESS_EVENT.CardNo 
                                                {(nAlarmID.HasValue ? "WHERE AlarmID > " + nAlarmID.Value : null)}
                                                ORDER BY AccessTime");

                IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);
                if (results == null)
                {
                    throw new ApplicationException(strErrMsg);
                }

                foreach (var result in results)
                {
                    // DeviceID >> 카드리더기ID >> 카드리더기ID == 출입문ID + 1
                    int nDeviceID = result.DeviceID - 1;

                    // 스피드 게이트 출구 예외처리 >> 스피드 게이트 입구와 출구 하나로 예외처리
                    if (SPEED_EXIT.ContainsKey(nDeviceID))
                        nDeviceID = SPEED_EXIT[nDeviceID];
                    
                    string key = KEY_DOOR + (nDeviceID);
                    if (doorInfos.ContainsKey(key) == false)
                        continue;

                    int? nPersonType = result.PersonType;

                    DoorInfo doorInfo = doorInfos[key];

                    ComingPerson comingPerson = new ComingPerson();
                    comingPerson.cmg_event_sn = result.AlarmID;
                    comingPerson.cmg_tm = result.AccessTime;
                    comingPerson.eqpmn_name = result.DeviceName;
                    comingPerson.lc_name = result.LocationName;
                    comingPerson.empno = result.Sabun;
                    comingPerson.card_no = result.CardNo;
                    comingPerson.event_name = result.StatusName;
                    comingPerson.event_code = result.State;
                    comingPerson.cmg_nmpr_name = result.Name;
                    comingPerson.team_name = result.OrgName;
                    comingPerson.clsf_name = result.GradeName;

                    comingPerson.sensor_sn = doorInfo.SensorNo;
                    comingPerson.sensor_sttus_optn_code = (int)CodeType.SensorType;
                    comingPerson.sensor_sttus_code = SensorType.Door;

                    // 사번이 없다면 방문객으로 간주
                    // PersonType으로 방문객 구별
                    if (result.Sabun == null || result.Sabun == "" || result.Sabun == "NULL" || result.Sabun == "Undefined" ||
                        nPersonType == PERSON_TYPE_VISIT_2 || nPersonType == PERSON_TYPE_VISIT_3)
                        comingPerson.visitr_yn = true;
                    else
                        comingPerson.visitr_yn = false;

                    if (comingPerson.event_code == null)
                    {
                        continue;
                    }                        
                    else if (comingPerson.event_code.EndsWith(CODE_ENTRY))
                    {
                        // 스피드 게이트 출구의 입장은 퇴장으로 예외처리
                        if (SPEED_EXIT.ContainsKey(result.DeviceID - 1))
                            comingPerson.entnc_yn = false;
                        else
                            comingPerson.entnc_yn = true;
                    }
                    else if (comingPerson.event_code.EndsWith(CODE_EXIT))
                        comingPerson.entnc_yn = false;
                    else
                    {
                        continue;
                    }

                    comingPeople.Add(comingPerson);
                }
            }
            catch (Exception e)
            {
                comingPeople = null;
                strErrMsg = e.Message;
            }

            return comingPeople;
        }
    }
}
