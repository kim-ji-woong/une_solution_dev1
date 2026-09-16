using S1SVMSSDKv2.Info;
using S1SVMSSDKv2.Model.Alarm;
using S1SVMSSDKv2.Model.Etc;
using SVMSServer.Datas;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml;

namespace SVMSServer.SVMS
{
    using DAL;

    class SVMSEventReceiver : IDisposable
    {
        private class SVMSConnectionInfo
        {
            private string m_strIP = "";
            private int m_nPort = -1;
            private string m_strID = "";
            private string m_strPW = "";

            public string IP
            {
                get { return m_strIP; }
                set { m_strIP = value; }
            }

            public int Port
            {
                get { return m_nPort; }
                set { m_nPort = value; }
            }

            public string ID
            {
                get { return m_strID; }
                set { m_strID = value; }
            }

            public string Password
            {
                get { return m_strPW; }
                set { m_strPW = value; }
            }

            public SVMSConnectionInfo()
            {
            }

            public SVMSConnectionInfo(string strIP, int nPort, string strID, string strPW)
            {
                m_strIP = strIP;
                m_nPort = nPort;
                m_strID = strID;
                m_strPW = strPW;
            }
        }

        //private WebDBManager m_dbMgr = null;
        private ManagementServer m_svmsMgr = null;
        private SVMSConnectionInfo m_svmsInfo = null;

        // Key : Camera GUID
        private Dictionary<string, CCTVData> m_dicCameras = new Dictionary<string, CCTVData>();
        // Key : Camera GUID
        // Value : Camera에 할당된 Profile별 URL들
        private Dictionary<string, List<string>> m_dicCameraURLs = new Dictionary<string, List<string>>();

        private bool m_isConnectSVMS = false;
        private string _clientGUID = "";

        // 재접속(Launch) 진행 중 여부. 주기 재접속과 SDK 자동 재접속 루프가 겹쳐
        // m_svmsMgr 필드를 동시에 갈아끼우는 경쟁을 막기 위한 가드.
        private volatile bool m_bLaunching = false;

        private int m_nLastEventType = 0;
        private int m_nLastIntelligentEvent = 0;

        private ISVMSEventOwner m_owner = null;
        private SvmsManager m_parent = null;

        private int m_nSiteNo = 0;
        private string m_strSvmsIP = "";
        private int m_nSvmsPort = 0;
        private string m_strSvmsID = "";
        private string m_strSvmsPW = "";

        public bool IsConnectSVMS
        {
            get { return m_isConnectSVMS; }
        }

        public string SvmsServerIP
        {
            get
            {
                if (m_svmsInfo == null)
                    return m_strSvmsIP;

                return m_svmsInfo.IP;
            }
        }

        public int SvmsPort
        {
            get
            {
                if (m_svmsInfo == null)
                    return m_nSvmsPort;

                return m_svmsInfo.Port;
            }
        }

        public string ID
        {
            get
            {
                if (m_svmsInfo == null)
                    return m_strSvmsID;

                return m_svmsInfo.ID;
            }
        }

        public string Password
        {
            get
            {
                if (m_svmsInfo == null)
                    return m_strSvmsPW;

                return m_svmsInfo.Password;
            }
        }

        private Dictionary<string, int> m_dicCCTVSubTypes = new Dictionary<string, int>();
        public Dictionary<string, int> DicCCTVSubTypes
        {
            get { return m_dicCCTVSubTypes; }
        }

        public SVMSEventReceiver(SvmsManager owner, int nSiteNo, string ip, int port, string id, string pw, Dictionary<string, int> dicCCTVSubTypes)
        {
            m_owner = owner;
            m_parent = owner;
            m_nSiteNo = nSiteNo;
            m_strSvmsIP = ip;
            m_nSvmsPort = port;
            m_strSvmsID = id;
            m_strSvmsPW = pw;

            m_dicCCTVSubTypes = dicCCTVSubTypes;
        }

        public void Dispose()
        {
            m_isConnectSVMS = false;
        }

        public int GetSubType(string strSubTypeName)
        {
            int nSubType = m_dicCCTVSubTypes[SvmsManager.SubType_NONE];

            if (m_dicCCTVSubTypes.ContainsKey(strSubTypeName))
            {
                nSubType = m_dicCCTVSubTypes[strSubTypeName];
            }

            return nSubType;
        }

        #region static
        public static void DisposeInstances(List<SVMSEventReceiver> receivers)
        {
            foreach (SVMSEventReceiver receiver in receivers)
            {
                receiver.Dispose();
            }

            receivers.Clear();
        }

        public static ICollection<CCTVData> GetCCTVList(List<SVMSEventReceiver> receivers)
        {
            if (receivers == null)
                return null;

            List<CCTVData> cctvs = new List<CCTVData>();

            foreach (SVMSEventReceiver receiver in receivers)
            {
                ICollection<CCTVData> cctvList = receiver.GetCCTVList();

                if (cctvList == null)
                    continue;

                cctvs.AddRange(cctvList);
            }

            return cctvs;
        }
        #endregion

        public void ConnectServer()
        {
            if (m_svmsInfo == null)
                m_svmsInfo = new SVMSConnectionInfo(m_strSvmsIP, m_nSvmsPort, m_strSvmsID, m_strSvmsPW);
            else
            {
                m_svmsInfo.IP = m_strSvmsIP;
                m_svmsInfo.Port = m_nSvmsPort;
                m_svmsInfo.ID = m_strSvmsID;
                m_svmsInfo.Password = m_strSvmsPW;
            }

            RequestLaunch();
        }

        public void ConnectServer(string strIP, int nPort, string strID, string strPW)
        {
            if (m_svmsInfo == null)
                m_svmsInfo = new SVMSConnectionInfo(strIP, nPort, strID, strPW);
            else
            {
                m_svmsInfo.IP = strIP;
                m_svmsInfo.Port = nPort;
                m_svmsInfo.ID = strID;
                m_svmsInfo.Password = strPW;
            }

            RequestLaunch();
        }

        /// <summary>
        /// 상시 연결을 재로그인시켜 CCTV 목록을 강제 갱신한다.
        /// 내부적으로 ConnectServer()를 다시 호출하여 Cleanup → 재접속 → 재로그인 →
        /// RequestCameraList 전체 사이클을 수행한다 (DeviceCameraListCompleted 이벤트가
        /// 정상 응답하는 유일한 경로가 로그인 직후이기 때문).
        /// </summary>
        /// <returns>재접속을 시작했으면 true, 이미 진행 중이라 건너뛰면 false</returns>
        public bool Reconnect()
        {
            // 1. 이미 재접속(Launch)이 진행 중이면 중복 실행 방지
            if (m_bLaunching)
                return false;

            // 2. 저장된 접속 정보(m_svmsInfo/필드)로 풀 재로그인 수행
            ConnectServer();
            return true;
        }

        private void RequestLaunch()
        {
            if (m_svmsInfo == null)
                return;

            // 1. 재접속(Launch) 시작을 표시 (성공 시 OnLaunchCallback에서 해제)
            m_bLaunching = true;

            if (m_svmsMgr != null)
                m_svmsMgr.Cleanup();

            m_svmsMgr = new ManagementServer(m_svmsInfo.IP, m_svmsInfo.Port, m_svmsInfo.ID, m_svmsInfo.Password, false, 1, SVMSClientType.externalclient);

            //if (m_svmsMgr != null)
            //     m_svmsMgr.Launch(OnLaunchCallback);

            InitializeSVMSResponse();

            //S1SVMSSDKv2.JARVIS.Instance.SetAutoFindLiveStream("clsrnfmf akssksmfk tititi", false);

            Task.Factory.StartNew(() =>
            {
                m_svmsMgr.Launch(OnLaunchCallback);
            });
        }

        public void OnLaunchCallback(string server, bool isSuccess)
        {
            if (isSuccess == true)
            {
                m_isConnectSVMS = true;
                m_bLaunching = false;   // 재접속 완료
            }
            else
            {
                m_isConnectSVMS = false;

                // 자동 재접속 이후도 접속종료 하지 못하는 경우 재 접속한다.
                // (실패 시 RequestLaunch()가 다시 호출되므로 m_bLaunching은 유지된다)
                RequestLaunch();
            }
        }

        private void InitializeSVMSResponse()
        {
            Logger.Instance.Write(LogTypes.Info, "InitializeSVMSResponse Start");

            m_svmsMgr.ClientTypeCompleted += new Action<string, bool, string, XmlNode>(SVMSInitClient);
            //managementServer.NetworkConnectionStatusNotified ConnectCompleted += new Action<bool, XmlNode>(SVMSServerConnect);

            /*-------------------------------------------------------------------------------------
                [로그인 결과]
            -------------------------------------------------------------------------------------*/
            m_svmsMgr.LoginCompleted += new Action<string, bool, bool, XmlNode>(OnLoginComplete);

            /*-------------------------------------------------------------------------------------
                [서버 연결 해제]
            -------------------------------------------------------------------------------------*/
            m_svmsMgr.Disconnected += (s) =>
            {
                //m_bConnectServer = false;
            };

            m_svmsMgr.Reconnected += (s, b) =>
            {
                RequestCameraList();
            };

            m_svmsMgr.DeviceGroupListCompleted += (arg1, isSuccess, arg2, deviceGroups, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                }
            };

            m_svmsMgr.DeviceCameraListCompleted += SVMSEventCameraList;

            m_svmsMgr.AddDeviceCameraNotified += (arg1, isSuccess, addDeviceCamera, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    // .TODO: 현장 테스트 필요
                    RequestCameraList();
                    Console.WriteLine("[DeviceCamera] " + addDeviceCamera.CameraGUID + " added.");
                }
            };

            // CCTV별 접속끊김 정보는 여기서 확인...(실시간)
            m_svmsMgr.ModifyDeviceCameraNotified += new Action<string, bool, S1SVMSSDKv2.Model.Device.DeviceCamera, XmlNode>(OnModifiedCamera);
            /*m_svmsMgr.ModifyDeviceCameraNotified += (arg1, isSuccess, modifyDeviceCamera, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    //RequestCameraList();
                    Console.WriteLine("[DeviceCamera] " + modifyDeviceCamera.CameraGUID + " modified.");
                }
            };*/

            m_svmsMgr.RemoveDeviceCameraNotified += (arg1, isSuccess, deviceCameraGUID, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    // .TODO: 현장 테스트 필요
                    RequestCameraList();
                    Console.WriteLine("[DeviceCamera] " + deviceCameraGUID + " removed.");
                }
            };

            m_svmsMgr.GetDeviceCameraLiveStreamInformationCompleted += GetDeviceCameraLiveStreamInformationCompleted;
            m_svmsMgr.DeviceSequenceCameraListCompleted += DeviceSequenceCameraListCompleted;

            /*-------------------------------------------------------------------------------------
                [지능형/장치 이벤트 발생]
            -------------------------------------------------------------------------------------*/
            m_svmsMgr.SVMSEventNotified += SVMSEventNotify;
            //m_svmsMgr.SVMSEventNotified += new Action<string, bool, SVMSEventInformation, XmlNode>(this.SVMSEventNotify);
        }

        private void DeviceSequenceCameraListCompleted(string arg1, bool arg2, bool arg3, List<S1SVMSSDKv2.Model.Device.DeviceSequenceCamera> arg4, XmlNode arg5)
        {
            System.Diagnostics.Trace.WriteLine("DeviceSequenceCameraListCompleted : " + arg1);
        }

        //static int MultiProfileCount = 0;

        private void GetDeviceCameraLiveStreamInformationCompleted(string str, bool flag, S1SVMSSDKv2.Model.Device.DeviceCameraLiveSream stream, XmlNode node)
        {
            CCTVData cctv;

            if (m_dicCameras.TryGetValue(stream.DeviceCameraGUID, out cctv))
            {
                string strCCTVUrl = cctv.url.Replace("?a=0", "");

                int urlWidth, urlHeight;
                int width, height;

                if (GetCCTVResolution(cctv.url, out urlWidth, out urlHeight) && GetCCTVResolution(stream.ConnectURL, out width, out height))
                {
                    if (urlWidth == width && urlHeight == height)
                    {
                        if (strCCTVUrl == stream.ConnectURL)
                        {
                            cctv.hd_url = cctv.url;
                        }
                        else
                        {
                            if (cctv.hd_url == null)
                            {
                                cctv.hd_url = cctv.url;
                            }

                            if (cctv.ld_url == null)
                            {
                                cctv.ld_url = stream.ConnectURL + "?a=0";
                            }
                            else
                            {
                                if (GetCCTVResolution(cctv.ld_url, out urlWidth, out urlHeight) && urlWidth >= width && urlHeight >= height)
                                {
                                    cctv.ld_url = stream.ConnectURL + "?a=0";
                                }
                            }
                        }
                    }
                    else if (urlWidth > width && urlHeight > height)
                    {
                        cctv.ld_url = stream.ConnectURL + "?a=0";
                    }
                }
                else
                {
                    if (stream.ConnectURL.ToLower().EndsWith("sub"))
                    {
                        // 솔브레인에만 예외적으로 적용
                        // "L_"로 시작하는 CCTV에 한하여...
                        if (cctv.camera_name.StartsWith("L_"))
                        {
                            string strURL = stream.ConnectURL + "?a=0";
                            string strSmallURL = cctv.url;
                            cctv.url = strURL;
                            cctv.ld_url = strSmallURL;
                        }
                        else
                            cctv.ld_url = stream.ConnectURL + "?a=0";
                    }
                }

                /*if (cctv.URL == stream.ConnectURL)
                    cctv.BigURL = stream.ConnectURL;
                else
                {
                    cctv.SmallURL = stream.ConnectURL;
                    MultiProfileCount++;
                }*/
            }
        }

        private bool GetCCTVResolution(string url, out int width, out int height)
        {
            //"RTSP://192.168.254.13:554/192.168.250.133_H264_1280x720_005"
            width = height = 0;

            int xIndex = url.LastIndexOf('x');

            if (xIndex < 0)
                return false;

            int nIndex2 = url.LastIndexOf('_');

            if (nIndex2 < xIndex)
                return false;

            string str2 = url.Substring(0, xIndex);
            int nIndex1 = str2.LastIndexOf('_');

            if (nIndex1 < 0)
                return false;

            string strWidth = url.Substring(nIndex1 + 1, xIndex - nIndex1 - 1).Trim();
            string strHeight = url.Substring(xIndex + 1, nIndex2 - xIndex - 1).Trim();

            if (int.TryParse(strWidth, out width) && int.TryParse(strHeight, out height))
            {
                if (width > 0 && height > 0)
                    return true;
            }

            return false;
        }

        // CCTV별 접속끊김 정보는 여기서 확인...(실시간)
        private void OnModifiedCamera(string arg1, bool isSuccess, S1SVMSSDKv2.Model.Device.DeviceCamera modifyDeviceCamera, XmlNode originalActionStructure)
        {
            if (isSuccess == true)
            {
                CCTVData cctv;

                if (m_dicCameras.TryGetValue(modifyDeviceCamera.CameraGUID, out cctv))
                {
                    bool isChanged = false;

                    if (modifyDeviceCamera.ID != cctv.user_id)
                    {
                        cctv.user_id = modifyDeviceCamera.ID;
                        isChanged = true;
                    }

                    if (modifyDeviceCamera.Password != cctv.password)
                    {
                        cctv.password = modifyDeviceCamera.Password;
                        isChanged = true;
                    }

                    if (modifyDeviceCamera.CameraName != cctv.camera_name)
                    {
                        cctv.camera_name = modifyDeviceCamera.CameraName;
                        isChanged = true;
                    }

                    string strURL = modifyDeviceCamera.ConnectURL + "?a=0";

                    if (strURL != cctv.url)
                    {
                        cctv.url = strURL;
                        isChanged = true;
                    }

                    bool isEnabled = modifyDeviceCamera.IsActive && modifyDeviceCamera.IsAlive;

                    if (isEnabled != cctv.enab)
                    {
                        Logger.Instance.Write(LogTypes.Info, "OnModifiedCamera, CCTV[" + cctv.sensor_sn + "], " + cctv.unq_key + ", Enabled : " + isEnabled);
                        cctv.enab = isEnabled;
                        isChanged = true;
                    }

                    if (modifyDeviceCamera.CameraIPAddress != cctv.camera_ip)
                    {
                        cctv.camera_ip = modifyDeviceCamera.CameraIPAddress;
                        isChanged = true;
                    }

                    if (modifyDeviceCamera.CameraManufactureCompany != cctv.camera_makr_name)
                    {
                        cctv.camera_makr_name = modifyDeviceCamera.CameraManufactureCompany;
                        isChanged = true;
                    }

                    if (modifyDeviceCamera.CameraModelName != cctv.camera_model_name)
                    {
                        cctv.camera_model_name = modifyDeviceCamera.CameraModelName;
                        isChanged = true;
                    }

                    if (m_owner != null && isChanged)
                        m_owner.OnModifiedCamera(cctv);
                }

                Console.WriteLine("[DeviceCamera] " + modifyDeviceCamera.CameraGUID + " modified.");
            }
        }

        private void OnLoginComplete(string serverKey, bool isSuccess, bool isAdministrator, XmlNode originalActionStructure)
        {
            // 로그인 완료 처리
            if (m_svmsMgr == null)
                return;

            var message = string.Empty;

            if (m_svmsMgr.IsLogin == false)
            {
                var resultCode = (originalActionStructure.SelectSingleNode("//Result") as System.Xml.XmlElement).GetAttribute("code");

                if (string.Equals(resultCode, "10"))
                {
                    message = "로그인 실패 (이미 로그인 상태)";
                }
                else if (string.Equals(resultCode, "11"))
                {
                    message = "로그인 실패 (잘못된 아이디 또는 비밀번호)";
                }
                else if (string.Equals(resultCode, "12"))
                {
                    message = "로그인 실패 (접속권한 없음)";
                }
                else if (string.Equals(resultCode, "13"))
                {
                    message = "로그인 실패 (관리자에 의해 사용이 차단된 아이디 또는 아이피)";
                }
                else if (string.Equals(resultCode, "14"))
                {
                    message = "로그인 실패 (동시 접속자 수 초과)";
                }
                else if (string.Equals(resultCode, "15"))
                {
                    message = "로그인 실패 (비밀번호 3회 입력 오류로 차단된 아이디 또는 아이피)";
                }
                else if (string.Equals(resultCode, "16"))
                {
                    message = "로그인 실패 (할당되지 않은 사용자)";
                }
                else if (string.Equals(resultCode, "17"))
                {
                    message = "로그인 실패 (장기간 미접속 차단 계정)";
                }
                else
                {
                    message = "로그인 실패 (로그인 실패)";
                }

                m_owner.OnMessage(DateTime.Now, null, GetSubType(SvmsManager.SubType_NONE), message);
                return;
            }
            else
            {
                RequestCameraList();
                message = "카메라 정보를 불러오고 있습니다.";
            }

            // 로그인 완료
            m_owner.OnMessage(DateTime.Now, null, GetSubType(SvmsManager.SubType_NONE), message);
        }

        private void RequestCameraList()
        {
            //m_dicCameras.Clear();
            if (m_svmsMgr != null)
                m_svmsMgr.RequestDeviceCameraList();
        }

        private void SVMSInitClient(string serverKey, bool isSuccess, string clientGUID, XmlNode originalActionStructure)
        {
            if (isSuccess == true)
            {
                _clientGUID = clientGUID;

                m_dicCameras.Clear();
            }
        }

        private void SVMSEventCameraList(string arg1, bool isSuccess, bool isFinished, List<S1SVMSSDKv2.Model.Device.DeviceCamera> deviceCameras, XmlNode originalActionStructure)
        {
            if (isSuccess == true)
            {
                if (isFinished != true)
                {
                    foreach (var deviceCameraItem in deviceCameras)
                    {
                        try
                        {
                            string deviceCameraGUID = deviceCameraItem.CameraGUID;
                            string cameraIP = deviceCameraItem.CameraIPAddress;
                            if (cameraIP != "")
                            {
                                cameraIP = deviceCameraItem.CameraRTSPURL;
                            }

                            System.Diagnostics.Trace.WriteLine("GUID: " + deviceCameraGUID);
                            System.Diagnostics.Trace.WriteLine("Camera: " + cameraIP);

                            string strCameraName = deviceCameraItem.CameraName;
                            string strURL = deviceCameraItem.ConnectURL;
                            int nPort = deviceCameraItem.CameraRTSPPort;
                            string strID = deviceCameraItem.ID;
                            string strPW = deviceCameraItem.Password;

                            string strIP = deviceCameraItem.CameraIPAddress;
                            string strCameraCompanyName = deviceCameraItem.CameraManufactureCompany;
                            string strCameraModelName = deviceCameraItem.CameraModelName;

                            if (deviceCameraGUID != null)
                            {
                                CCTVData cctv = new CCTVData();
                                cctv.user_id = strID;
                                cctv.password = strPW;
                                cctv.camera_name = strCameraName;
                                cctv.url = strURL + "?a=0";
                                cctv.unq_key = deviceCameraGUID;
                                cctv.enab = deviceCameraItem.IsActive && deviceCameraItem.IsAlive;
                                cctv.camera_ip = strIP;
                                cctv.camera_makr_name = strCameraCompanyName;
                                cctv.camera_model_name = strCameraModelName;

                                Logger.Instance.Write(LogTypes.Info, "SVMSEventCameraList, CCTV[" + cctv.camera_name + "], " + cctv.unq_key + ", Enabled : " + cctv.enab);

                                // Multi Profile Check
                                // 일부러 낮은 해상도의 Profile이 있나 물어본다.
                                // 원익 예외 발생됨
                                if (m_nSiteNo != 30)
                                    m_svmsMgr.RequestGetDeviceCameraLiveStreamInformation(cctv.unq_key, 100, 100);

                                m_dicCameras[deviceCameraGUID] = cctv;

                                if (m_owner != null)
                                    m_owner.OnAddCCTV(cctv);

                                List<string> urls = null;

                                if (m_dicCameraURLs.TryGetValue(deviceCameraGUID, out urls) == false)
                                {
                                    urls = new List<string>();
                                    m_dicCameraURLs[deviceCameraGUID] = urls;
                                }

                                if (urls.Contains(cctv.url) == false)
                                    urls.Add(cctv.url);
                            }

                            if (string.IsNullOrEmpty(deviceCameraGUID) == false)
                            {
                                //managementServer.GetIntelligentConfigurationInformation(deviceCameraGUID);
                            }

                            Console.WriteLine("[DeviceCamera] " + deviceCameraItem.CameraGUID);
                        }
                        catch (Exception ex)
                        {
                            Logger.Instance.Write(LogTypes.Error, string.Format("SVMSEventCameraList error: {0}", ex.Message));
                        }
                    }

                    Logger.Instance.Write(LogTypes.Info, string.Format("CCTV 총 {0}개 읽어오기 완료", m_dicCameras.Count));
                }
                else
                {
                    Console.WriteLine("[------------] " + "list up completed.");
                }
            }
        }

        private void SVMSEventNotify(string serverKey, bool isSuccess, SVMSEventInformation SVMSEventInformation, XmlNode originalActionStructure)
        {
            if (isSuccess == true)
            {
                Logger.Instance.Write(LogTypes.Info, "[SVMSEvent (" + SVMSEventInformation.DeviceGUID + ")] type: →" + SVMSEventInformation.AlarmProperty.Type + " " + SVMSEventInformation.DeviceType);
                int nReciverID = -1;
                int nData = 0;
                bool bFire = false;
                int nType = SVMSEventInformation.AlarmProperty.Type;
                // 시스템 상태값
                if (nType >= 1000 && nType <= 1004)
                {
                    switch (nType)
                    {
                        case 1000: // System on
                            break;
                        case 1001: // System off                                 
                            break;
                        case 1002: // CPU Power over
                            break;
                        case 1003: // system network over
                            break;
                        case 1004: // system memory over
                            break;
                    }

                }
                else
                {
                    //IntPtr ptr = new IntPtr(nType);
                    //IntelligentConfigurationInformation alarm = (IntelligentConfigurationInformation)Marshal.PtrToStructure(ptr, typeof(IntelligentConfigurationInformation));
                    //int nAlarmType = alarm.IntelligentAlgorithmType;

                    // 우리가 처리할 항목 침입 / 배회 / 쓰러짐 / 도난 / 방치 / 가상펜스 / 화재 / 비상벨(DIO)
                    string strEventType = "";
                    int sensorType = GetSubType(SvmsManager.SubType_NONE);

                    switch (nType)
                    {
                        case 0: // Previous Event clear
                            break;
                        case 2: // Intrusion(침입)
                            strEventType = "침입";
                            sensorType = GetSubType(strEventType);
                            break;
                        case 3: // Loitering (배회)
                            strEventType = "배회";
                            sensorType = GetSubType(strEventType);
                            break;
                        case 4: // Slip( 쓰러짐 )
                            strEventType = "쓰러짐";
                            sensorType = GetSubType(strEventType);
                            break;
                        case 6: // Steal (도난)
                            strEventType = "도난";
                            sensorType = GetSubType(strEventType);
                            break;
                        case 7: // Abandoned( 방치)
                            strEventType = "방치";
                            sensorType = GetSubType(strEventType);
                            //break;
                            nReciverID = 2;
                            nData = 1;
                            break;
                        case 8: // Fence (가상펜스)
                            strEventType = "가상펜스";
                            sensorType = GetSubType(strEventType);
                            //break;
                            nReciverID = 5;
                            nData = 1;
                            break;
                        case 100: // Fire (화재)
                            strEventType = "화재";
                            sensorType = GetSubType(strEventType);
                            break;
                            /*if (m_dbMgr.SiteID == 102)
                            {
                                nReciverID = 2;
                            }
                            else
                                nReciverID = 5;*/
                            bFire = true;
                            nData = 1;
                            break;
                        case 200: // DIO (카메라 DIO 비상벨)
                            break;
                        default:
                            break;
                    }
                    m_nLastIntelligentEvent = nType;

                    DateTime eventTime = DateTime.FromBinary(SVMSEventInformation.AlarmProperty.Time);
                    string strEventMessage = string.Format("[{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}] ({6}) {7}",
                        eventTime.Year,
                        eventTime.Month,
                        eventTime.Day,
                        eventTime.Hour,
                        eventTime.Minute,
                        eventTime.Second,
                        strEventType,
                        SVMSEventInformation.DeviceName
                        );

                    if (sensorType != GetSubType(SvmsManager.SubType_NONE))
                        m_owner.OnMessage(eventTime, SVMSEventInformation.DeviceGUID, sensorType, strEventMessage);
                }

                System.Diagnostics.Trace.WriteLine("[SVMSEvent (" + SVMSEventInformation.DeviceGUID + ")] type: →" + SVMSEventInformation.AlarmProperty.Type + " " + SVMSEventInformation.DeviceType);
            }
        }

        public ICollection<CCTVData> GetCCTVList()
        {
            return m_dicCameras.Values;
        }
    }

    interface ISVMSEventOwner
    {
        void OnMessage(DateTime eventTime, string uniqueKey, int sensorType, string strMessage);
        void OnModifiedCamera(CCTVData cctv);
        void OnAddCCTV(CCTVData cctv);
    }
}
