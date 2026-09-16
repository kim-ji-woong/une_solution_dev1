using System;
using System.Collections.Generic;
using System.Text;

namespace dnsDataKftc.CommonCode
{
    public abstract class CodeTypeData
    {
        protected List<int> m_collections = new List<int>();

        public IEnumerable<int> Collection
        {
            get { return m_collections; }
        }

        public abstract CommonCode.CodeType CodeType
        {
            get;
        }
    }
}
