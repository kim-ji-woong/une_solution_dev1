using System;
using System.Configuration;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using System.Collections;
using DCOP.Model;
using DCOP.Model.Code;
using DCOP.DAL;

namespace RackEditor
{
    //using Models.Databse;
    //using Models.Databse.Code;
    using Models.Business;
    //using DAL;

    class DBManager
    {
        private const string RackCoordTag = "TileCoord";
        private const string UnitTag = "RackUnit";
        private const string RackTag = "Rack";
        private const string ItemTag = "Item";

        private DataManager m_dataManager = null;
        private IDBOwner m_owner = null;
        private int m_nTileWidth = 0, m_nTileHeight = 0;
        private DataCenter m_dataCenter = null;

        private WebServiceManager m_webServiceManager = new WebServiceManager();

        public int TileWidth
        {
            get { return m_nTileWidth; }
            set { m_nTileHeight = value; }
        }

        public int TileHeight
        {
            get { return m_nTileHeight; }
            set { m_nTileHeight = value; }
        }

        public DataCenter DataCenter
        {
            get { return m_dataCenter; }
            set { m_dataCenter = value; }
        }

        public DBManager(IDBOwner owner)
        {
            m_owner = owner;
            ReadConfig();

            /*if (m_dataManager != null)
                ReadTileSize();*/
        }

        private void ReadConfig()
        {
            string strDBHost = ConfigurationManager.AppSettings.Get("Host");
            string strDBInfo = ConfigurationManager.AppSettings.Get("DBInfo");

            if (strDBHost != null && strDBHost.Length > 0 && strDBInfo != null && strDBInfo.Length > 0)
            {
                string strDecrypt = AES256Cipher.AES_decrypt(strDBInfo);

                int index = strDecrypt.IndexOf('-');

                if (index > 0)
                {
                    int index2 = strDecrypt.IndexOf('-', index + 1);

                    if (index2 > 0)
                    {
                        string strDBName = strDecrypt.Substring(0, index).Trim();
                        string strID = strDecrypt.Substring(index + 1, index2 - index - 1).Trim();
                        string strPW = strDecrypt.Substring(index2 + 1).Trim();

                        m_dataManager = new DataManager(0, strDBHost, strDBName, strID, strPW);
                    }
                }
            }
        }

        public bool GetBarcodeInfo(string strBarcode, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_dataManager == null && m_webServiceManager == null)
                return false;

            if (strBarcode == null || strBarcode.Length == 0)
            {
                strErrorMessage = "Barcode 값이 비어있습니다.";
                return false;
            }

            strBarcode = strBarcode.Trim();

            string strHead = strBarcode.Substring(0, 1);
            int nCodeType;

            if (int.TryParse(strHead, out nCodeType) == false)
            {
                if (strBarcode.Length > 2)
                {
                    strHead = strBarcode.Substring(0, 2);

                    if (strHead == "DC")
                        return SetDataCenter(strBarcode, out strErrorMessage);
                    else if (strHead == "RR")
                        return GetRack(strBarcode, out strErrorMessage);
                    else if (strHead == "RP")
                        return GetRackCoord(strBarcode, out strErrorMessage);
                    else if (strHead == "RM")
                        return GetRackType(strBarcode, out strErrorMessage);
                    else if (strHead == "RU")
                        return GetUnit(strBarcode, out strErrorMessage);
                }
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            CodeType codeType = ReadCodeType(nCodeType, out strErrorMessage);

            if (codeType == null)
                return false;

            if (codeType.CodeTypeEngName == RackCoordTag)
                return GetRackCoord(strBarcode, codeType, out strErrorMessage);
            else if (codeType.CodeTypeEngName == RackTag)
                return GetRack(strBarcode, codeType, out strErrorMessage);
            else if (codeType.CodeTypeEngName == UnitTag)
                return GetUnit(strBarcode, codeType, out strErrorMessage);
            else if (codeType.CodeTypeEngName == ItemTag)
                return GetItem(strBarcode, codeType, out strErrorMessage);

            return true;
        }

        private bool SetDataCenter(string strBarcode, out string strErrorMessage)
        {
            DataCenter dataCenter = m_webServiceManager.GetDataCenterInfo(strBarcode, out m_nTileWidth, out m_nTileHeight, out strErrorMessage);

            if (dataCenter == null)
                return false;

            /*string strCondition = string.Format("{0} = '{1}'", DataCenter.Fields.Barcode, strBarcode);
            DataCenter dataCenter = m_dataManager.GetSelect().SelectFirst<DataCenter>(strCondition, out strErrorMessage);

            if (dataCenter == null)
                return false;*/

            m_owner.ReadDataCenter(dataCenter);
            //ReadTileSize();
            return true;
        }

        private bool GetItem(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            Item item;
            ItemType itemType;
            EquipmentType equipmentType;

            if (m_webServiceManager.GetItem(strBarcode, codeType, out item, out itemType, out equipmentType, out strErrorMessage))
            {
                m_owner.ReadItem(item, itemType, equipmentType);
                return true;
            }

            return false;
            /*int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            strBarcode = strBarcode.Substring(0, needLength + 1);

            string strCondition = string.Format("a.{0} = '{1}'", Item.Fields.Barcode, strBarcode);
            ArrayList arrDatas = JoinManager.JoinItemItemTypeEquipmentType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            if (arrDatas.Count >= 3 && arrDatas[0] is Item && arrDatas[1] is ItemType && arrDatas[2] is EquipmentType)
            {
                m_owner.ReadItem((Item)arrDatas[0], (ItemType)arrDatas[1], (EquipmentType)arrDatas[2]);
                return true;
            }

            strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
            return false;*/
        }

        private CodeType ReadCodeType(int nCodeType, out string strErrorMessage)
        {
            return m_webServiceManager.GetCodeType(nCodeType, null, out strErrorMessage);
            /*string strCondition = string.Format("{0} = {1}", CodeType.Fields.CodeTypeNo, nCodeType);
            CodeType codeType = m_dataManager.GetSelect().SelectFirst<CodeType>(strCondition, out strErrorMessage);

            if (codeType == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";

                return null;
            }

            return codeType;*/
        }

        private CodeType ReadCodeType(string strCodeTypeEngName, out string strErrorMessage)
        {
            return m_webServiceManager.GetCodeType(null, strCodeTypeEngName, out strErrorMessage);
            /*string strCondition = string.Format("{0} = '{1}'", CodeType.Fields.CodeTypeEngName, strCodeTypeEngName);
            CodeType codeType = m_dataManager.GetSelect().SelectFirst<CodeType>(strCondition, out strErrorMessage);

            if (codeType == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";

                return null;
            }

            return codeType;*/
        }

        private bool GetRackType(string strBarcode, out string strErrorMessage)
        {
            RackType rackType = m_webServiceManager.GetRackType(strBarcode, out strErrorMessage);

            if (rackType != null)
            {
                m_owner.ReadRackType(rackType);
                return true;
            }

            return false;
            /*string strCondition = string.Format("{0} = '{1}'", RackType.Fields.Barcode, strBarcode);
            RackType rackType = m_dataManager.GetSelect().SelectFirst<RackType>(strCondition, out strErrorMessage);

            if (rackType == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";

                return false;
            }

            m_owner.ReadRackType(rackType);
            return true;*/
        }

        private bool GetUnit(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            RackUnit rackUnit = m_webServiceManager.GetRackUnit(strBarcode, codeType, out strErrorMessage);

            if (rackUnit != null)
            {
                m_owner.ReadRackUnit(rackUnit);
                return true;
            }

            return false;
            /*int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            string strCode = strBarcode.Substring(1, needLength);
            string strCondition = string.Format("{0} = '{1}' and {2} = {3}",
                RackUnit.Fields.Barcode, strCode,
                RackUnit.Fields.CodeTypeNo, codeType.CodeTypeNo);

            RackUnit unit = m_dataManager.GetSelect().SelectFirst<RackUnit>(strCondition, out strErrorMessage);

            if (unit == null)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            m_owner.ReadRackUnit(unit);
            return true;*/
        }

        private bool GetUnit(string strBarcode, out string strErrorMessage)
        {
            if (strBarcode.Length > 2)
                strBarcode = strBarcode.Substring(2);

            int no;

            if (int.TryParse(strBarcode, out no))
            {
                RackUnit rackUnit = m_webServiceManager.GetRackUnit(no, out strErrorMessage);

                if (rackUnit != null)
                {
                    m_owner.ReadRackUnit(rackUnit);
                    return true;
                }

                return false;
                /*string strCondition = string.Format("{0} = {1}", RackUnit.Fields.RackUnitNo, no);
                RackUnit unit = m_dataManager.GetSelect().SelectFirst<RackUnit>(strCondition, out strErrorMessage);

                if (unit == null)
                {
                    strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                    return false;
                }

                m_owner.ReadRackUnit(unit);
                return true;*/
            }

            strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
            return false;
        }

        private bool GetRack(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            RackType rackType;
            Rack rack = m_webServiceManager.GetRack(strBarcode, codeType, m_dataCenter, out rackType, out strErrorMessage);

            if (rack == null)
                return false;

            if (rackType != null)
                m_owner.ReadRack(rack, rackType);
            else
                m_owner.ReadRack(rack);

            return true;
            /*int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            strBarcode = strBarcode.Substring(0, needLength + 1);

            string strCondition = string.Format("a.{0} = '{1}'", Rack.Fields.Barcode, strBarcode);
            ArrayList arrDatas = JoinManager.JoinRackRackType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            if (arrDatas.Count >= 2 && arrDatas[0] is Rack && arrDatas[1] is RackType)
            {
                m_owner.ReadRack((Rack)arrDatas[0], (RackType)arrDatas[1]);
                return true;
            }
            else
            {
                Rack rack = MakeNewRack(strBarcode);
                m_owner.ReadRack(rack);
            }

            strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
            return false;*/
        }

        public RackType GetRackType(Rack rack, RackType rackType)
        {
            if (rackType != null)
                return rackType;

            string strErrorMessage;
            return m_webServiceManager.GetRackType(rack.RackTypeNo, out strErrorMessage);
            /*string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", RackType.Fields.RackTypeNo, rack.RackTypeNo);
            return m_dataManager.GetSelect().SelectFirst<RackType>(strCondition, out strErrorMessage);*/
        }

        /*private static int TempRackCount = 0;

        private Rack MakeNewRack(string strBarcode)
        {
            string strRackName = "Rack_Temp_" + (++TempRackCount).ToString();

            Rack rack = new Rack();

            rack.Barcode = strBarcode;
            rack.DataCenterNo = m_dataCenter == null ? 1 : m_dataCenter.DataCenterNo;
            rack.RackGroupNo = 1;
            rack.RackName = strRackName;
            rack.RackNo = -1;
            rack.RackTypeNo = -1;
            rack.RegTime = DateTime.Now;
            rack.Rotation = 180;

            return rack;
        }*/

        private bool GetRack(string strBarcode, out string strErrorMessage)
        {
            if (m_dataCenter == null)
            {
                strErrorMessage = "먼저 국사정보를 읽어야 합니다.";
                return false;
            }

            strBarcode = strBarcode.Substring(3);
            CodeType codeType = ReadCodeType("Rack", out strErrorMessage);

            if (codeType == null)
            {
                if (strErrorMessage != null)
                    strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";

                return false;
            }

            return GetRack(strBarcode, codeType, out strErrorMessage);
        }

        private bool GetRackCoord(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            string strCoord = m_webServiceManager.GetRackCoord(strBarcode, codeType, out strErrorMessage);

            if (strCoord == null)
                return false;

            m_owner.ReadRackCoord(strCoord);
            return true;
            /*int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            string strLevel1 = strBarcode.Substring(1, codeType.CodeLength);
            string strLevel2 = strBarcode.Substring(1 + codeType.CodeLength, codeType.CodeLength);

            string strCondition = string.Format("{0} = {1} and (({2} = '{4}' and {3} = 1) or ({2} = '{5}' and {3} = 2))",
                TileCoord.Fields.CodeTypeNo, codeType.CodeTypeNo,
                TileCoord.Fields.Barcode, TileCoord.Fields.CodeLevel,
                strLevel1, strLevel2);

            IEnumerable<TileCoord> tileCoords = m_dataManager.GetSelect().Select<TileCoord>(strCondition, out strErrorMessage);

            if (tileCoords == null)
                return false;

            string str1 = null, str2 = null;

            foreach (var tileCoord in tileCoords)
            {
                if (tileCoord.CodeLevel == 1)
                    str1 = tileCoord.CodeName;
                else if (tileCoord.CodeLevel == 2)
                    str2 = tileCoord.CodeName;
            }

            if (str1 != null && str2 != null)
            {
                m_owner.ReadRackCoord(str1 + str2);
                return true;
            }

            strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
            return false;*/
        }

        private bool GetRackCoord(string strBarcode, out string strErrorMessage)
        {
            if (m_dataCenter == null)
            {
                strErrorMessage = "먼저 국사정보를 읽어야 합니다.";
                return false;
            }

            strBarcode = strBarcode.Substring(3);
            CodeType codeType = ReadCodeType("RackUnit", out strErrorMessage);

            if (codeType == null)
                return false;

            if (strBarcode.Length > 2)
            {
                string strHead = strBarcode.Substring(1, 1);

                int no;

                if (int.TryParse(strBarcode.Substring(2), out no))
                {
                    m_owner.ReadRackCoord(strHead + no.ToString());
                    return true;
                }
            }

            strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
            return false;
        }

        public Rack GetRack(int rackNo, out string strErrorMessage)
        {
            return m_webServiceManager.GetRack(rackNo, out strErrorMessage);
            /*strErrorMessage = null;

            if (rackNo <= 0)
                return null;

            string strCondition = string.Format("{0} = {1}", Rack.Fields.RackNo, rackNo);
            return m_dataManager.GetSelect().SelectFirst<Rack>(strCondition, out strErrorMessage);*/
        }

        public List<RackItem> GetRackItems(Rack rack, out string strErrorMessage)
        {
            return m_webServiceManager.GetRackItems(rack, out strErrorMessage);
            /*if (rack.RackTypeNo <= 0 || rack.RackNo <= 0)
                return new List<RackItem>();

            string strCondition = string.Format("{0} = {1}", RackType.Fields.RackTypeNo, rack.RackTypeNo);
            RackType rackType = m_dataManager.GetSelect().SelectFirst<RackType>(strCondition, out strErrorMessage);

            if (rackType == null)
                return new List<RackItem>();

            return GetRackItems(rack.RackNo, rackType, out strErrorMessage);*/
        }

        public List<RackItem> GetRackItems(int rackNo, RackType rackType, out string strErrorMessage)
        {
            return m_webServiceManager.GetRackItems(rackNo, rackType.RackTypeNo, out strErrorMessage);
            /*string strCondition = string.Format("{0} = {1}", Item_RU.Fields.RackNo, rackNo);
            IEnumerable<Item_RU> itemDatas = m_dataManager.GetSelect().Select<Item_RU>(strCondition, out strErrorMessage);

            if (itemDatas == null)
                return null;

            string strItemNos = "";
            Dictionary<int, int> dicItemPos = new Dictionary<int, int>();

            foreach (Item_RU itemRU in itemDatas)
            {
                dicItemPos[itemRU.ItemNo] = itemRU.UPos;

                if (strItemNos.Length == 0)
                    strItemNos = itemRU.ItemNo.ToString();
                else
                    strItemNos += "," + itemRU.ItemNo.ToString();
            }

            List<RackItem> rackItems = new List<RackItem>();

            if (strItemNos.Length == 0)
            {
                for (int i=0;i<rackType.Unit;i++)
                {
                    rackItems.Add(new RackItem(i + 1, null, null, null));
                }

                return rackItems;
            }

            strCondition = string.Format("a.{0} in ({1})", Item.Fields.ItemNo, strItemNos);
            ArrayList arrDatas = JoinManager.JoinItemItemTypeEquipmentType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is ItemType && arrDatas[i + 2] is EquipmentType)
                {
                    Item item = (Item)arrDatas[i];
                    ItemType itemType = (ItemType)arrDatas[i + 1];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 2];

                    int uPos;

                    if (dicItemPos.TryGetValue(item.ItemNo, out uPos))
                    {
                        rackItems.Add(new RackItem(uPos, item, itemType, equipmentType));
                    }
                }
            }

            rackItems.Sort();
            int beginIndex = 0;

            for (int i=1;i<=rackType.Unit;i++)
            {
                RackItem rackItem = GetRackItem(rackItems, ref beginIndex, i);

                if (rackItem == null)
                {
                    rackItems.Add(new RackItem(i, null, null, null));
                }
            }

            rackItems.Sort();
            return rackItems;*/
        }

        /*private RackItem GetRackItem(List<RackItem> rackItems, ref int beginIndex, int uPos)
        {
            int itemCount = rackItems.Count;

            for (int i = beginIndex; i < itemCount; i++)
            {
                var rackItem = rackItems[i];

                if (rackItem.UPos == uPos)
                {
                    beginIndex = i + 1;
                    return rackItem;
                }
                else if (rackItem.UPos > uPos)
                {
                    beginIndex = i;
                    break;
                }
            }

            return null;
        }*/

        /*private void ReadTileSize()
        {
            if (m_dataCenter != null)
            {
                m_nTileWidth = m_dataCenter.TileWidth;
                m_nTileHeight = m_dataCenter.TileLength;
                return;
            }

            string strErrorMessage;
            IEnumerable<DataCenter> dataCenters = m_dataManager.GetSelect().Select<DataCenter>(null, out strErrorMessage);

            foreach (DataCenter dataCenter in dataCenters)
            {
                m_nTileWidth = dataCenter.TileWidth;
                m_nTileHeight = dataCenter.TileLength;
                break;
            }
        }*/

        public bool Save(Rack rack, List<RackItem> rackItems, out string strErrorMessage)
        {
            return m_webServiceManager.Save(rack, rackItems, out strErrorMessage);
            /*IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            // Rack 좌표를 갱신한다.
            if (dataManager.GetUpdate().Update<Rack>(rack, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            string strCondition = string.Format("{0} = {1}", Item_RU.Fields.RackNo, rack.RackNo);
            
            // Rack에 배치되었던 Item들을 모두 삭제한다.
            if (dataManager.GetDelete().Delete<Item_RU>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            List<Item_RU> items = new List<Item_RU>();
            Item_RU prevItemRU = null;
            string strItemNos = "";

            foreach (RackItem rackItem in rackItems)
            {
                if (rackItem.Item != null)
                {
                    if (prevItemRU != null)
                    {
                        if (prevItemRU.ItemNo == rackItem.Item.ItemNo)
                            continue;
                    }

                    Item_RU itemRU = new Item_RU();

                    itemRU.UPos = rackItem.UPos;
                    itemRU.ItemNo = rackItem.Item.ItemNo;
                    itemRU.RackNo = rack.RackNo;

                    items.Add(itemRU);
                    prevItemRU = itemRU;

                    if (strItemNos.Length == 0)
                        strItemNos = itemRU.ItemNo.ToString();
                    else
                        strItemNos += "," + itemRU.ItemNo.ToString();
                }
            }

            // 새로 배치될 Item들이 다른곳에 배치되었으면 이를 모두 삭제한다.
            if (strItemNos.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", Item_RU.Fields.ItemNo, strItemNos);
                
                if (dataManager.GetDelete().Delete<Item_RU>(strCondition, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return false;
                }
            }

            if (dataManager.GetCreate().Insert<Item_RU>(items, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return false;
            }

            return true;*/
        }

        public bool Save(Rack rack, out string strErrorMessage)
        {
            // Rack 좌표를 갱신한다.
            return m_webServiceManager.Save(rack, null, out strErrorMessage);
            //return m_dataManager.GetUpdate().Update<Rack>(rack, null, out strErrorMessage);
        }
    }

    interface IDBOwner
    {
        void ReadDataCenter(DataCenter dataCenter);
        void ReadRackCoord(string strCoord);
        void ReadRack(Rack rack, RackType rackType);
        void ReadRack(Rack rack);
        void ReadRackType(RackType rackType);
        void ReadRackUnit(RackUnit unit);
        void ReadItem(Item item, ItemType itemType, EquipmentType equipmentType);
    }
}
