using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoulbrainWebAPIServer.Model.UniAETModels
{
    public class ResponseUniAET
    {
        public enum HttpStatusCode
        {
            OK = 202
        }

        public int resultCode { get; set; }
        //public string Error { get; set; }
    }
}
