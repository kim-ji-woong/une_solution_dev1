using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationServer.Datas
{
    /// <summary>
    /// 서버 속성
    /// </summary>
    public enum ServerProperty
    {
        /// <summary>
        /// 화재-동방
        /// </summary>
        MuxType = 0,
        /// <summary>
        /// 화재-지멘스
        /// </summary>
        ServerMode = 1,
        /// <summary>
        /// S1-SVMS
        /// </summary>
        SvmsIP,
        SvmsPort,
        SvmsID,
        SvmsPW,
        RtspServerName,
        RunRtspServer,
        CctvConfig,
        SoulURL,
        SoulID,
        SoulPW,
        HRDbName,
    }

    public enum LogTypes
    {
        Info = 0,
        Error = 1
    }

    public enum MuxTypes
    {
        None = 0,
        Mux1 = 1,
        Mux2 = 2
    }

    public enum ServerModes
    {
        Client = 0,
        Server = 1
    }

    public enum DbTypes
    {
        sqlserver = 0,
        mysql = 1,
        oracle = 2
    }

    public enum ComboBoxServerTypes
    {
        None = dnsData.CommonCode.SdmsSensor.ServerType.None,
        Fire_Johnson = dnsData.CommonCode.SdmsSensor.ServerType.Fire_Johnson,
        CCTV_S1_SVMS = dnsData.CommonCode.SdmsSensor.ServerType.CCTV_S1_SVMS,
        Soulbrain_Hancom = dnsData.CommonCode.SdmsSensor.ServerType.Soulbrain_Hancom,
        Soulbrain_HR = dnsData.CommonCode.SdmsSensor.ServerType.Soulbrain_HR,
    }
}
