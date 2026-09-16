using dnsDapperDBUtil.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace DapperSample.Model
{
    public class RegularMemberData : IDataClass
    {
        public Regular Regular { get; set; }
        public RegularMember RegularMember { get; set; }

        public void Binding(params object[] obj)
        {
            if (obj == null)
                return;

            for (int i = 0; i < obj.Length; i++)
            {
                if (obj[i] is Regular)
                    this.Regular = (Regular)obj[i];
                else if (obj[i] is RegularMember)
                    this.RegularMember = (RegularMember)obj[i];
            }
        }

        public object MakeDataClass()
        {
            return new RegularMemberData();
        }
    }
}
