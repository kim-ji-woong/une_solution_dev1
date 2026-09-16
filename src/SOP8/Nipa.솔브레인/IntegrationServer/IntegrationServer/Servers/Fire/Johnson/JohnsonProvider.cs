using dnsTcpLib2;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Servers.Fire.Johnson
{
    /// <summary>
    /// 화재-동방 통신
    /// </summary>
    public class JohnsonProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private JohnsonManager m_parentManager = null;

        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        private byte[] m_arrTempReceived = null;

        private MuxTypes m_muxType = MuxTypes.None;
        public MuxTypes MuxType
        {
            get { return m_muxType; }
            set { m_muxType = value; }
        }

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        private int m_nPingCount = 0;
        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        private const byte BEGIN_BYTE = 0x41;//'A'
        private const int BLOCK_LENGTH = 72;

        private const byte LOG_TYPE_FIRE = 0x07;
        private const byte LOG_TYPE_OP = 0x05;
        private const byte LOG_TYPE_FIRED = 0x06;
        private const byte LOG_TYPE_RECOVERTY = 0x0a;

        public JohnsonProvider(JohnsonManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnReceiveData()
        {
            try
            {
                lock (this)
                {
                    if (ReceivedData != null)
                    {
                        m_isReadingProcess = true;

                        int nBytesCount = ReceivedData.Count();

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;
                            byte[] bytes = ReceivedData;
                            ProcessData(bytes);
                        }
                    }

                    m_isReadingProcess = false;
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("OnReceiveData Error : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
            m_parentManager.Logger.Write(LogTypes.Info, ServerType.Fire_Johnson, m_nServerSeqNo, "close Connection");
        }

        public void ProcessData(byte[] bytes)
        {
            try
            {
                if (m_arrTempReceived != null)
                {
                    int len1 = m_arrTempReceived.Length;
                    int len2 = bytes.Length;

                    byte[] bytes2 = new byte[len1 + len2];
                    System.Buffer.BlockCopy(m_arrTempReceived, 0, bytes2, 0, len1);
                    System.Buffer.BlockCopy(bytes, 0, bytes2, len1, len2);

                    bytes = bytes2;
                }

                int nIndex = 0, nBeginIndex = -1, nEndIndex = -1;

                while (GetBytesBlock(bytes, ref nIndex, ref nBeginIndex, ref nEndIndex))
                {
                    ProcessData(bytes, nBeginIndex, nEndIndex);
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerType.Fire_Johnson, m_nServerSeqNo, "ProcessData(byte[]) : " + ex.Message);
            }
        }

        private void ProcessData(byte[] bytes, int nBeginIndex, int nEndIndex)
        {
            try
            {
                WriteBinaryLog(bytes, nBeginIndex, nEndIndex - nBeginIndex);

                byte lType = bytes[nBeginIndex + 1];
                DateTime timeStamp = ToDateTime(bytes, nBeginIndex + 2);
                bool isOn = bytes[nBeginIndex + 8] == 0x01;

                int nReceiverID = 0, nRelayTeam = 0, nLoopID = 0, nRelayID = 0, nTagID = 0;
                GetReceiverInfo(bytes, nBeginIndex + 9, ref nReceiverID, ref nRelayTeam, ref nLoopID, ref nRelayID, ref nTagID);

                string strArea = GetString(bytes, nBeginIndex + 19, 21);   // 구역
                string strDevice = GetString(bytes, nBeginIndex + 40, 23); // 장치
                string strRunning = GetString(bytes, nBeginIndex + 63, 9); // 동작 문자열

                string strLog = string.Format("[{10}] Receiver({0}), RealyTeam({1}), Loop({2}), RelayID({3}), Tag({4}), On({5}), Area : {6}, Device : {7}, Running : {8}, Type : {9}",
                    nReceiverID, nRelayTeam, nLoopID, nRelayID, nTagID, isOn, strArea, strDevice, strRunning, (int)lType, ServerType.Fire_Johnson);

                m_parentManager.Logger.Write(LogTypes.Info, ServerType.Fire_Johnson, m_nServerSeqNo, strLog);
                System.Diagnostics.Trace.WriteLine(strLog);

                if ((m_muxType == MuxTypes.Mux1 && lType == LOG_TYPE_OP && (strDevice.Contains("화재 복구") || strDevice.Contains("화재복구"))) ||
                    (m_muxType == MuxTypes.Mux2 && lType == LOG_TYPE_RECOVERTY))
                {
                    ProcessAllClear();
                }
                else if (lType == LOG_TYPE_FIRE || lType == LOG_TYPE_FIRED)
                {
                    if (isOn)
                    {
                        // 화재신호
                        ProcessFire(nReceiverID, nRelayTeam, nLoopID, nRelayID, nTagID, true);
                    }
                    else
                    {
                        // 복구신호
                        ProcessFire(nReceiverID, nRelayTeam, nLoopID, nRelayID, nTagID, false);
                    }
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerType.Fire_Johnson, m_nServerSeqNo, "ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
            }
        }

        public void ProcessFire(int nReceiverID, int nRelayTeam, int nLoopID, int nRelayID, int nTagID, bool bIsAlarm)
        {
            int nTagNo = GetJohnsonSensorTagNo(nReceiverID, nRelayTeam, nLoopID, nRelayID, nTagID);
            SensorZoneInfo sensorZoneInfo = SensorManager.Instance.FindSensor(m_nServerSeqNo, nTagNo.ToString());

            if (m_parentManager.SendSensorData(sensorZoneInfo.ID, sensorZoneInfo.SensorType, bIsAlarm, out string strErrorMessage) == false)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerType.Fire_Johnson, m_nServerSeqNo, "ProcessFire : " + strErrorMessage);
            }
        }

        private void ProcessAllClear()
        {
            // 전체복구 처리해야 함
            int? nSiteID = null;
            
            if (m_parentManager.SendAllClear(nSiteID, out string strErrorMessage) == false)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerType.Fire_Johnson, m_nServerSeqNo, "ProcessAllClear : " + strErrorMessage);
            }
        }

        public int GetJohnsonSensorTagNo(int nReceiverID, int nRelayTeam, int nLoopID, int nRelayID, int nTagID)
        {
            // nReceiverID * 100000 + nLoopID * 10000 + nRelayID * 10 + nTagID;
            // 1000000000 + 수신기*10000000 + 중계반*100000 + Loop*10000 + Relay*10 + TagID
            int nTagNo = 1000000000 + nReceiverID * 10000000 + nRelayTeam * 100000 + nLoopID * 10000 + nRelayID * 10 + nTagID;

            return nTagNo;
        }

        private void WriteBinaryLog(byte[] bytes, int nIndex, int len)
        {
            string strLog = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                string strBytes = string.Format("{0:X2}", bytes[i]);

                if (i == nIndex)
                    strLog = strBytes;
                else
                    strLog += " " + strBytes;
            }

            strLog = string.Format("[{2}] Recv from Server\r\nBytes Length : {0}\r\n{1}", len, strLog, ServerType.GetServerText(ServerType.Fire_Johnson));
            m_parentManager.Logger.Write(LogTypes.Info, ServerType.Fire_Johnson, m_nServerSeqNo, strLog);
        }

        private string GetString(byte[] bytes, int nIndex, int len)
        {
            byte[] trg = null;

            for (int i = nIndex; i < nIndex + len; i++)
            {
                if (bytes[i] == 0x00)
                {
                    if (i == nIndex)
                        return "";

                    trg = new byte[i - nIndex];
                    System.Buffer.BlockCopy(bytes, nIndex, trg, 0, i - nIndex);
                    break;
                }
            }

            if (trg == null)
            {
                trg = new byte[len];
                System.Buffer.BlockCopy(bytes, nIndex, trg, 0, len);
            }

            return Encoding.GetEncoding(51949).GetString(trg);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="nIndex"></param>
        /// <param name="nReceiverID">중계반 2bytes</param>
        /// <param name="nRelayID">Loop 1bytes</param>
        /// <param name="nLoopID">중계기 3bytes</param>
        /// <param name="nTagID">회로번호 1bytes</param>
        private void GetReceiverInfo(byte[] bytes, int nIndex, ref int nReceiverID, ref int nRelayTeam, ref int nLoopID, ref int nRelayID, ref int nTagID)
        {
            nReceiverID = AsciiToInt(bytes, nIndex, 2);  // 수신반
            nRelayTeam = AsciiToInt(bytes, nIndex + 2, 2);  // 중계반
            nLoopID = AsciiToInt(bytes, nIndex + 4, 1);  // Loop
            nRelayID = AsciiToInt(bytes, nIndex + 5, 3); // 중계기
            nTagID = AsciiToInt(bytes, nIndex + 8, 1);   // 회로번호
        }

        private int AsciiToInt(byte[] bytes, int nIndex, int len)
        {
            int data = 0;

            for (int i = nIndex; i < nIndex + len; i++)
            {
                data = data * 10 + ((char)bytes[i] - '0');
            }

            return data;
        }

        private DateTime ToDateTime(byte[] bytes, int nIndex)
        {
            int year = ((int)bytes[nIndex]) + 2000;
            int month = (int)bytes[nIndex + 1];
            int day = (int)bytes[nIndex + 2];
            int hour = (int)bytes[nIndex + 3];
            int min = (int)bytes[nIndex + 4];
            int sec = (int)bytes[nIndex + 5];

            return new DateTime(year, month, day, hour, min, sec);
        }

        private bool GetBytesBlock(byte[] bytes, ref int nIndex, ref int nBeginIndex, ref int nEndIndex)
        {
            m_arrTempReceived = null;

            int len = bytes.Length;
            bool find = false;

            for (int i = nIndex; i < len; i++)
            {
                if (bytes[i] == BEGIN_BYTE)
                {
                    nIndex = i;
                    find = true;
                    break;
                }
            }

            if (find == false)
                return false;

            while (nIndex < len)
            {
                if (nIndex == len - 1)
                {
                    m_arrTempReceived = new byte[1];
                    m_arrTempReceived[0] = bytes[nIndex];
                    return false;
                }
                else if (bytes[nIndex + 1] != BEGIN_BYTE)
                    break;
                else
                    nIndex++;
            }

            if (nIndex + BLOCK_LENGTH <= len)
            {
                nBeginIndex = nIndex;
                nEndIndex = nBeginIndex + BLOCK_LENGTH;
                nIndex = nEndIndex;
                return true;
            }

            if (len <= nIndex)
                return false;

            // 처리되지 못한 데이터는 m_arrTempReceived에 남겨둔다.
            m_arrTempReceived = new byte[len - nIndex];
            System.Buffer.BlockCopy(bytes, nIndex, m_arrTempReceived, 0, len - nIndex);
            return false;
        }
    }
}
