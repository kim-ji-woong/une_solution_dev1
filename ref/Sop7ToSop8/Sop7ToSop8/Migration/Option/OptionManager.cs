using System;
using System.Collections.Generic;
using System.Text;

namespace Sop7ToSop8.Migration.Option
{
    class OptionManager
    {
		private IMigrationClient m_client = null;

		private int m_nSop8SiteNo = -1;

		public OptionManager(IMigrationClient client, int sop8SiteNo)
		{
			m_client = client;
			m_nSop8SiteNo = sop8SiteNo;
		}

		public bool Run()
		{
			/*SystemOptionManager systemOptionManager = new SystemOptionManager(m_client, m_nSop8SiteNo);
			if (!systemOptionManager.Run())
			{
				return false;
			}*/
			return true;
		}
	}
}
