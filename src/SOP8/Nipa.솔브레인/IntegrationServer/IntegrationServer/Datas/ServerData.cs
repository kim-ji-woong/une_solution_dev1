using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntegrationServer.Datas
{
    public class ServerSetting
    {
        public string DbIP { get; set; }
        public int DbType { get; set; }
        public string DbName { get; set; }
        public string DbID { get; set; }
        public string DbPW { get; set; }
        public string LogPath { get; set; }
        public string SOPWebServerFrontURL { get; set; }
        public List<ServerData> ServerDatas { get; set; }
    }

    public class ServerData
    {
        public int SeqNo { get; set; }
        public int ServerType { get; set; }
        public string ServerName { get; set; }
        public bool Use { get; set; }
        public int SiteID { get; set; }
        public string ServerAlias { get; set; }
        public string IP { get; set; }
        public int Port { get; set; }
        public string SOPWebServerURL { get; set; }
        public Dictionary<ServerProperty, object> ServerProperties { get; set; }
    }
}
