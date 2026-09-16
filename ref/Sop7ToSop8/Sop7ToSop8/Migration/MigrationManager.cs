using System.Threading;

namespace Sop7ToSop8.Migration
{
    using Spatial;
    using Sensor;
    using Team;
    using Account;
    using History;
    using Sdms;
    using Sop;
    using Alarm;
    using Weather;

    class MigrationManager
    {
        private IMigrationClient m_client = null;
        private int m_sop8SiteNo = -1;

        public MigrationManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_sop8SiteNo = sop8SiteNo;
        }

        public void Run()
        {
            Thread t = new Thread(new ThreadStart(MigrationThread));
            t.Start();
        }

        private void MigrationThread()
        {
            if (DeleteOldDatabase())
            {
                SpatialManager spatialManager = new SpatialManager(m_client, m_sop8SiteNo);

                if (spatialManager.Run())
                {
                    SensorManager sensorManager = new SensorManager(m_client, m_sop8SiteNo);

                    if (sensorManager.Run())
                    {
                        TeamManager teamManager = new TeamManager(m_client, m_sop8SiteNo);

                        if (teamManager.Run())
                        {
                            AccountManager accountManager = new AccountManager(m_client, m_sop8SiteNo);

                            if (accountManager.Run())
                            {
                                SdmsManager sdmsManager = new SdmsManager(m_client, m_sop8SiteNo);

                                if (sdmsManager.Run())
                                {
                                    SopManager sopManager = new SopManager(m_client, m_sop8SiteNo);

                                    if (sopManager.Run())
                                    {
                                        HistoryManager historyManager = new HistoryManager(m_client, m_sop8SiteNo);
                                        
                                        if (historyManager.Run())
                                        {
                                            AlarmManager alarmManager = new AlarmManager(m_client, m_sop8SiteNo, historyManager.SensorZoneHistoryManager);
                                            
                                            if (alarmManager.Run())
                                            {
                                                Option.OptionManager optionManager = new Option.OptionManager(m_client, m_sop8SiteNo);
                                                
                                                if (optionManager.Run())
                                                {
                                                    WeatherManager weatherManager = new WeatherManager(m_client, m_sop8SiteNo);
                                                    weatherManager.Run();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            m_client.Finish();
        }

        private bool DeleteOldDatabase()
        {
            m_client.SendStatus("기존 DB를 삭제하는 중입니다.");

            string strErrorMessage;

            if (DeleteDatabase(out strErrorMessage) == false)
            {
                m_client.SendStatus(strErrorMessage);
                return false;
            }

            m_client.SendStatus("기존 DB가 모두 삭제되었습니다.");
            return true;
        }

        private bool DeleteDatabase(out string strErrorMessage)
        {
            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Weather.Current>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Weather.Weekly>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Weather.Site>(null, out strErrorMessage) == false)
                return false;

            //if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Option>(null, out strErrorMessage) == false)
            //    return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Alarm.Current>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.ComponentDetail>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.Component>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.ActionStep>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Config.SpecialCharactor>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Config.LinkedSop>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Arrow>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.TransmissionRegular>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.TransmissionTemporary>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Transmission>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.ProcessMission>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.ProcessRegular>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.ProcessTemporary>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Process>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.DecisionAutoScriptVariable>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Decision>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Endpoint>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Comment>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Component>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.GridRow>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.GridColumn>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.Grid>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Component.StepMember>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Category.ActionStep>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Category.SmallClass>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Category.Version>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Category.MiddleClass>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sop.Category.LargeClass>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Gltf.ModelOrthoData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Gltf.ModelData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Gltf.Model>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.SensorReaction>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.SensorZoneDetail>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.History.SensorZone>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Account.Option>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Account.Session>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Account.User>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Account.Grade>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Team.TemporaryMember>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Team.Temporary>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Team.RegularMember>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Team.Regular>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Common.Team.Option>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.MaterialRangeLimitData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.MaterialLimitData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.Material>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.CCTV.EquipZoneCCTV>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.CCTV.CCTV>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.SensorZone>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.Sensor>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Sensor.ServerInfo>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.FakeWall>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.EquipmentZoneLinkedZone>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.EquipmentZone>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.ZoneData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.Zone>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.BuildingData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.Building>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.BuildingGroupData>(null, out strErrorMessage) == false)
                return false;

            if (m_client.Sop8DataManager.GetDelete().Delete<Base.Model.Spatial.BuildingGroup>(null, out strErrorMessage) == false)
                return false;

            return true;
        }
    }
}
