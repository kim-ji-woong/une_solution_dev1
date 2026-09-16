using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.Model;
using DCOP.DAL;
using DCOP.Model.Code;

namespace DCOP.BLL
{
    using Models.Request.RackEditor;
    using Models.Response.RackEditor;
    using Models;
    using Models.Response;

    public class RackEditorManager
    {
        private IDataManager m_dataManager = null;

        public RackEditorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDataCenterInfo GetDataCenterInfo(string strBarcode)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", DataCenter.Fields.Barcode, strBarcode);
            DataCenter dataCenter = m_dataManager.GetSelect().SelectFirst<DataCenter>(strCondition, out strErrorMessage);

            if (dataCenter == null)
            {
                if (strErrorMessage != null)
                    return new ResponseDataCenterInfo(false, strErrorMessage);
                else
                    return new ResponseDataCenterInfo(false, "유효하지 않은 barcode입니다.");
            }

            ResponseDataCenterInfo response = new ResponseDataCenterInfo(true, "");
            response.DataCenter = dataCenter;
            response.TileWidth = dataCenter.TileWidth;
            response.TileHeight = dataCenter.TileLength;
            return response;
        }

        public ResponseItem GetItem(string strBarcode)
        {
            string strErrorMessage;
            string strCondition = string.Format("a.{0} = '{1}'", Item.Fields.Barcode, strBarcode);
            ArrayList arrDatas = JoinManager.JoinItemItemTypeEquipmentType(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            if (arrDatas.Count >= 3 && arrDatas[0] is Item && arrDatas[1] is ItemType && arrDatas[2] is EquipmentType)
            {
                ResponseItem response = new ResponseItem(true, "");

                response.Item = (Item)arrDatas[0];
                response.ItemType = (ItemType)arrDatas[1];
                response.EquipmentType = (EquipmentType)arrDatas[2];

                return response;
            }

            return new ResponseItem(false, "사용중인 Barcode 타입이 아닙니다.");
        }

        public ResponseCodeType GetCodeType(RequestCodeType data)
        {
            string strErrorMessage;
            string strCondition = "";

            if (data.CodeType != null)
                strCondition = string.Format("{0} = {1}", CodeType.Fields.CodeTypeNo, data.CodeType);
            else if (data.CodeTypeEngName != null)
                strCondition = string.Format("{0} = '{1}'", CodeType.Fields.CodeTypeEngName, data.CodeTypeEngName);
            else
                return new ResponseCodeType(false, "잘못된 parameter입니다.");

            CodeType codeType = m_dataManager.GetSelect().SelectFirst<CodeType>(strCondition, out strErrorMessage);

            if (codeType == null)
            {
                if (strErrorMessage == null)
                    return new ResponseCodeType(false, "잘못된 parameter입니다.");

                return null;
            }

            ResponseCodeType response = new ResponseCodeType(true, "");
            response.CodeType = codeType;
            return response;
        }

        public ResponseRackType GetRackType(RequestRackType data)
        {
            string strErrorMessage;
            string strCondition = "";

            if (data.RackTypeNo != null)
                strCondition = string.Format("{0} = {1}", RackType.Fields.RackTypeNo, (int)data.RackTypeNo);
            else
                strCondition = string.Format("{0} = '{1}'", RackType.Fields.Barcode, data.Barcode);

            RackType rackType = m_dataManager.GetSelect().SelectFirst<RackType>(strCondition, out strErrorMessage);

            if (rackType == null)
            {
                if (strErrorMessage == null)
                    return new ResponseRackType(false, "사용중인 Barcode 타입이 아닙니다.");
                else
                    return new ResponseRackType(false, strErrorMessage);
            }

            ResponseRackType response = new ResponseRackType(true, "");
            response.RackType = rackType;
            return response;
        }

        public ResponseRackUnit GetRackUnit(RequestRackUnit data)
        {
            string strCondition = "";

            if (data.RackUnitNo != null)
            {
                strCondition = string.Format("{0} = {1}", RackUnit.Fields.RackUnitNo, (int)data.RackUnitNo);
            }
            else
            {
                int needLength = data.CodeLength * data.CodeCount;

                if (data.Barcode.Length <= needLength)
                {
                    return new ResponseRackUnit(false, "사용중인 Barcode 타입이 아닙니다.");
                }

                string strCode = data.Barcode.Substring(1, needLength);
                strCondition = string.Format("{0} = '{1}' and {2} = {3}",
                    RackUnit.Fields.Barcode, strCode,
                    RackUnit.Fields.CodeTypeNo, data.CodeTypeNo);
            }

            string strErrorMessage;
            RackUnit unit = m_dataManager.GetSelect().SelectFirst<RackUnit>(strCondition, out strErrorMessage);

            if (unit == null)
            {
                if (strErrorMessage != null)
                    return new ResponseRackUnit(false, strErrorMessage);
                else
                    return new ResponseRackUnit(false, "사용중인 Barcode 타입이 아닙니다.");
            }

            ResponseRackUnit response = new ResponseRackUnit(true, "");
            response.RackUnit = unit;
            return response;
        }

        public ResponseRack GetRack(RequestRack data)
        {
            string strErrorMessage;
            ResponseRack response = null;

            if (data.RackNo != null)
            {
                string strCondition = string.Format("{0} = {1}", Rack.Fields.RackNo, (int)data.RackNo);
                Rack rack = m_dataManager.GetSelect().SelectFirst<Rack>(strCondition, out strErrorMessage);

                if (rack == null)
                {
                    if (strErrorMessage != null)
                        return new ResponseRack(false, strErrorMessage);
                    else
                        return new ResponseRack(false, "");
                }

                response = new ResponseRack(true, "");
                response.Rack = rack;
            }
            else
            {
                string strCondition = string.Format("a.{0} = '{1}'", Rack.Fields.Barcode, data.Barcode);
                ArrayList arrDatas = JoinManager.JoinRackRackType(m_dataManager, strCondition, out strErrorMessage);

                if (arrDatas == null)
                    return new ResponseRack(false, strErrorMessage);

                response = new ResponseRack(true, "");

                if (arrDatas.Count >= 2 && arrDatas[0] is Rack && arrDatas[1] is RackType)
                {
                    response.Rack = (Rack)arrDatas[0];
                    response.RackType = (RackType)arrDatas[1];
                }
                else
                {
                    Rack rack = MakeNewRack(data.Barcode, data.DataCenterNo);
                    response.Rack = rack;
                }
            }

            return response;
        }

        private static int TempRackCount = 0;

        private Rack MakeNewRack(string strBarcode, int dataCenterNo)
        {
            string strRackName = "Rack_Temp_" + (++TempRackCount).ToString();

            Rack rack = new Rack();

            rack.Barcode = strBarcode;
            rack.DataCenterNo = dataCenterNo;
            rack.RackGroupNo = 1;
            rack.RackName = strRackName;
            rack.RackNo = -1;
            rack.RackTypeNo = -1;
            rack.RegTime = DateTime.Now;
            rack.Rotation = 180;

            return rack;
        }

        public ResponseRackCoord GetRackCoord(RequestRackCoord data)
        {
            int needLength = data.CodeLength * data.CodeCount;

            if (data.Barcode.Length <= needLength)
            {
                return new ResponseRackCoord(false, "사용중인 Barcode 타입이 아닙니다.");
            }

            string strLevel1 = data.Barcode.Substring(1, data.CodeLength);
            string strLevel2 = data.Barcode.Substring(1 + data.CodeLength, data.CodeLength);

            string strCondition = string.Format("{0} = {1} and (({2} = '{4}' and {3} = 1) or ({2} = '{5}' and {3} = 2))",
                TileCoord.Fields.CodeTypeNo, data.CodeTypeNo,
                TileCoord.Fields.Barcode, TileCoord.Fields.CodeLevel,
                strLevel1, strLevel2);

            string strErrorMessage;
            IEnumerable<TileCoord> tileCoords = m_dataManager.GetSelect().Select<TileCoord>(strCondition, out strErrorMessage);

            if (tileCoords == null)
                return new ResponseRackCoord(false, strErrorMessage);

            string str1 = null, str2 = null;

            foreach (var tileCoord in tileCoords)
            {
                if (tileCoord.CodeLevel == 1)
                    str1 = tileCoord.CodeName;
                else if (tileCoord.CodeLevel == 2)
                    str2 = tileCoord.CodeName;
            }

            ResponseRackCoord response = new ResponseRackCoord(true, "");
            response.Coord = str1 + str2;
            return response;
        }

        public ResponseRackItems GetRackItems(RequestRackItems data)
        {
            if (data.RackTypeNo <= 0 || data.RackNo <= 0)
                return new ResponseRackItems(true, "");

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", RackType.Fields.RackTypeNo, data.RackTypeNo);
            RackType rackType = m_dataManager.GetSelect().SelectFirst<RackType>(strCondition, out strErrorMessage);

            if (rackType == null)
                return new ResponseRackItems(true, "");

            List<RackItem> rackItems = GetRackItems(data.RackNo, rackType, out strErrorMessage);

            if (rackItems == null)
                return new ResponseRackItems(false, strErrorMessage);

            ResponseRackItems response = new ResponseRackItems(true, "");
            response.Items.AddRange(rackItems);
            return response;
        }

        public MessageResult Save(RequestSave data)
        {
            string strErrorMessage;
            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            // Rack 좌표를 갱신한다.
            if (dataManager.GetUpdate().Update<Rack>(data.Rack, null, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            string strCondition = string.Format("{0} = {1}", Item_RU.Fields.RackNo, data.Rack.RackNo);

            // Rack에 배치되었던 Item들을 모두 삭제한다.
            if (dataManager.GetDelete().Delete<Item_RU>(strCondition, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (data.RackItems != null)
            {
                List<Item_RU> items = new List<Item_RU>();
                Item_RU prevItemRU = null;
                string strItemNos = "";

                foreach (RackItem rackItem in data.RackItems)
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
                        itemRU.RackNo = data.Rack.RackNo;

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
                        return new MessageResult(false, strErrorMessage);
                    }
                }

                if (dataManager.GetCreate().Insert<Item_RU>(items, out strErrorMessage) == false)
                {
                    string strTemp;
                    dataManager.BatchRollback(out strTemp);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        private List<RackItem> GetRackItems(int rackNo, RackType rackType, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", Item_RU.Fields.RackNo, rackNo);
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
                for (int i = 0; i < rackType.Unit; i++)
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

            for (int i = 0; i < nDataCount - 2; i += 3)
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

            for (int i = 1; i <= rackType.Unit; i++)
            {
                RackItem rackItem = GetRackItem(rackItems, ref beginIndex, i);

                if (rackItem == null)
                {
                    rackItems.Add(new RackItem(i, null, null, null));
                }
            }

            rackItems.Sort();
            return rackItems;
        }

        private RackItem GetRackItem(List<RackItem> rackItems, ref int beginIndex, int uPos)
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
        }
    }
}
