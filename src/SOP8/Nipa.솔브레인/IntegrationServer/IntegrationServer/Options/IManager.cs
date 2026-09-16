using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Options
{
    public interface IManager
    {
        int CurrentServerSeqNo { get; set; }
        ServerSetting ServerSetting { get; set; }
        void SetServerProperty(ServerData data, ServerProperty property, object value);
    }
}
