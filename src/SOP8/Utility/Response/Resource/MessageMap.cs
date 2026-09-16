using System.Collections.Generic;

namespace Response.Resource
{
    public class MessageMap
    {
        protected Dictionary<string, object> m_maps = null;
        protected string m_strTarget = "";

        protected MessageMap(Dictionary<string, object> messageMaps)
        {
            m_maps = messageMaps;
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTag, string strMessage)
        {
            Dictionary<string, object> dicMessageMaps;

            if (messageMaps.TryGetValue(type, out dicMessageMaps) == false)
            {
                dicMessageMaps = new Dictionary<string, object>();
                messageMaps[type] = dicMessageMaps;
            }

            dicMessageMaps[strTag] = strMessage;
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strMessage)
        {
            Dictionary<string, object> dicRoot = GetRootMap(messageMaps, type, strTagLevel1);
            SetMessage(dicRoot, strTagLevel2, strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);

            int nCount = tags.Count;

            for (int i=0;i<nCount-1;i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount-1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strTagLevel6, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);
            tags.Add(strTagLevel6);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strTagLevel6, string strTagLevel7, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);
            tags.Add(strTagLevel6);
            tags.Add(strTagLevel7);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strTagLevel6, string strTagLevel7, string strTagLevel8, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);
            tags.Add(strTagLevel6);
            tags.Add(strTagLevel7);
            tags.Add(strTagLevel8);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strTagLevel6, string strTagLevel7, string strTagLevel8, string strTagLevel9, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);
            tags.Add(strTagLevel6);
            tags.Add(strTagLevel7);
            tags.Add(strTagLevel8);
            tags.Add(strTagLevel9);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTagLevel1, string strTagLevel2, string strTagLevel3, string strTagLevel4, string strTagLevel5, string strTagLevel6, string strTagLevel7, string strTagLevel8, string strTagLevel9, string strTagLevel10, string strMessage)
        {
            Dictionary<string, object> dicParent = GetRootMap(messageMaps, type, strTagLevel1);

            List<string> tags = new List<string>();
            tags.Add(strTagLevel2);
            tags.Add(strTagLevel3);
            tags.Add(strTagLevel4);
            tags.Add(strTagLevel5);
            tags.Add(strTagLevel6);
            tags.Add(strTagLevel7);
            tags.Add(strTagLevel8);
            tags.Add(strTagLevel9);
            tags.Add(strTagLevel10);

            int nCount = tags.Count;

            for (int i = 0; i < nCount - 1; i++)
            {
                string strTag = tags[i];
                dicParent = GetMap(dicParent, strTag);
            }

            SetMessage(dicParent, tags[nCount - 1], strMessage);
        }

        protected static void SetMessage(Dictionary<string, object> messageMaps, string strTag, string strMessage)
        {
            messageMaps[strTag] = strMessage;
        }

        protected static Dictionary<string, object> GetRootMap(Dictionary<ID.LanguageTypes, Dictionary<string, object>> messageMaps, ID.LanguageTypes type, string strTag)
        {
            Dictionary<string, object> dicMessageMaps;

            if (messageMaps.TryGetValue(type, out dicMessageMaps) == false)
            {
                dicMessageMaps = new Dictionary<string, object>();
                messageMaps[type] = dicMessageMaps;
            }

            object dicSubMessageMaps;

            if (dicMessageMaps.TryGetValue(strTag, out dicSubMessageMaps) == false)
            {
                dicSubMessageMaps = new Dictionary<string, object>();
                dicMessageMaps[strTag] = dicSubMessageMaps;
            }

            return (Dictionary<string, object>)dicSubMessageMaps;
        }

        protected static Dictionary<string, object> GetMap(Dictionary<string, object> parentMap, string strTag)
        {
            object dicSubMessageMaps;

            if (parentMap.TryGetValue(strTag, out dicSubMessageMaps) == false)
            {
                dicSubMessageMaps = new Dictionary<string, object>();
                parentMap[strTag] = dicSubMessageMaps;
            }

            return (Dictionary<string, object>)dicSubMessageMaps;
        }

        public MessageMap Get(string strTag)
        {
            if (m_maps == null)
                return this;

            object dicMessageMaps = null;

            if (m_maps.TryGetValue(strTag, out dicMessageMaps))
            {
                if (dicMessageMaps is string)
                {
                    m_strTarget = (string)dicMessageMaps;
                    m_maps = null;
                    return this;
                }

                m_maps = (Dictionary<string, object>)dicMessageMaps;
                return this;
            }

            m_maps = null;
            return this;
        }

        public string Value(string strTag)
        {
            if (m_maps == null)
                return m_strTarget;

            object target;

            if (m_maps.TryGetValue(strTag, out target))
            {
                if (target is string)
                {
                    m_maps = null;
                    m_strTarget = (string)target;
                    return m_strTarget;
                }
            }

            return "";
        }

        public string Value()
        {
            return m_strTarget;
        }

        public virtual MessageMap Get(ID.LanguageTypes type)
        {
            return null;
        }
    }
}
