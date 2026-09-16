using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{
    public class ResponseParkingImage : MessageResult
    {
        private byte[] m_bytes = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }

        public ResponseParkingImage()
            : base()
        {
        }

        public ResponseParkingImage(bool success, string message)
            : base(success, message)
        {
        }
    }
}
