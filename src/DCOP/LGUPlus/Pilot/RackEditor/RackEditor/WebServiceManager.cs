using System;
using System.Configuration;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using DCOP.Model;
using DCOP.Model.Code;
using System.Collections.Generic;

namespace RackEditor
{
    using Models.Business;

    class WebServiceManager
    {
        private string m_strBaseUrl = null;

        public WebServiceManager()
        {
            string strUrl = ConfigurationManager.AppSettings.Get("url");

            if (strUrl != null && strUrl.Length > 0)
            {
                m_strBaseUrl = strUrl;

                if (m_strBaseUrl.EndsWith("/"))
                    m_strBaseUrl += "api/RackEditor";
                else
                    m_strBaseUrl += "/api/RackEditor";
            }
        }

        public DataCenter GetDataCenterInfo(string strBarcode, out int nTileWidth, out int nTileHeight, out string strErrorMessage)
        {
            nTileHeight = nTileWidth = 0;
            
            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);

            JObject json = new JObject();
            json.Add("requestDataCenterInfo", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenTileWidth = jsonResult.GetValue("tileWidth");
            JToken tokenTileHeight = jsonResult.GetValue("tileHeight");
            JToken tokenDataCenter = jsonResult.GetValue("dataCenter");

            if (tokenTileHeight == null || tokenTileWidth == null || tokenDataCenter == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            int? tileWidth = tokenTileWidth.Value<int>();
            int? tileHeight = tokenTileHeight.Value<int>();

            if (tileWidth == null || tileHeight == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            nTileWidth = (int)tileWidth;
            nTileHeight = (int)tileHeight;

            DataCenter dataCenter = GetDataCenter(tokenDataCenter, out strErrorMessage);
            return dataCenter;
        }

        public bool GetItem(string strBarcode, CodeType codeType, out Item item, out ItemType itemType, out EquipmentType equipmentType, out string strErrorMessage)
        {
            item = null;
            itemType = null;
            equipmentType = null;

            int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return false;
            }

            strBarcode = strBarcode.Substring(0, needLength + 1);

            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);

            JObject json = new JObject();
            json.Add("requestItem", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return false;

            JToken tokenItem = jsonResult.GetValue("item");
            JToken tokenItemType = jsonResult.GetValue("itemType");
            JToken tokenEquipmentType = jsonResult.GetValue("equipmentType");

            if (tokenItem == null || tokenItemType == null || tokenEquipmentType == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return false;
            }

            item = GetItem(tokenItem, out strErrorMessage);

            if (item == null)
                return false;

            itemType = GetItemType(tokenItemType, out strErrorMessage);

            if (itemType == null)
                return false;

            equipmentType = GetEquipmentType(tokenEquipmentType, out strErrorMessage);

            if (equipmentType == null)
                return false;

            return true;
        }

        public CodeType GetCodeType(int? codeType, string strCodeTypeEngName, out string strErrorMessage)
        {
            JObject jsonData = new JObject();

            if (codeType != null)
                jsonData.Add("codeType", (int)codeType);
            else if (strCodeTypeEngName != null)
                jsonData.Add("codeTypeEngName", strCodeTypeEngName);
            else
            {
                strErrorMessage = "잘못된 parameter입니다.";
                return null;
            }

            JObject json = new JObject();
            json.Add("requestCodeType", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenCodeType = jsonResult.GetValue("codeType");

            if (tokenCodeType == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetCodeType(tokenCodeType, out strErrorMessage);
        }

        public RackType GetRackType(string strBarcode, out string strErrorMessage)
        {
            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);

            JObject json = new JObject();
            json.Add("requestRackType", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRackType = jsonResult.GetValue("rackType");

            if (tokenRackType == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetRackType(tokenRackType, out strErrorMessage);
        }

        public RackType GetRackType(int rackTypeNo, out string strErrorMessage)
        {
            JObject jsonData = new JObject();
            jsonData.Add("rackTypeNo", rackTypeNo);

            JObject json = new JObject();
            json.Add("requestRackType", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRackType = jsonResult.GetValue("rackType");

            if (tokenRackType == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetRackType(tokenRackType, out strErrorMessage);
        }

        public RackUnit GetRackUnit(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);
            jsonData.Add("codeTypeNo", codeType.CodeTypeNo);
            jsonData.Add("codeLength", codeType.CodeLength);
            jsonData.Add("codeCount", codeType.CodeCount);

            JObject json = new JObject();
            json.Add("requestRackUnit", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRackUnit = jsonResult.GetValue("rackUnit");

            if (tokenRackUnit == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetRackUnit(tokenRackUnit, out strErrorMessage);
        }

        public RackUnit GetRackUnit(int rackUnitNo, out string strErrorMessage)
        {
            JObject jsonData = new JObject();
            jsonData.Add("rackUnitNo", rackUnitNo);

            JObject json = new JObject();
            json.Add("requestRackUnit", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRackUnit = jsonResult.GetValue("rackUnit");

            if (tokenRackUnit == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetRackUnit(tokenRackUnit, out strErrorMessage);
        }

        public Rack GetRack(string strBarcode, CodeType codeType, DataCenter dataCenter, out RackType rackType, out string strErrorMessage)
        {
            rackType = null;
            strErrorMessage = null;

            int needLength = codeType.CodeLength * codeType.CodeCount;

            if (strBarcode.Length <= needLength)
            {
                strErrorMessage = "사용중인 Barcode 타입이 아닙니다.";
                return null;
            }

            strBarcode = strBarcode.Substring(0, needLength + 1);

            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);
            jsonData.Add("dataCenterNo", dataCenter.DataCenterNo);

            JObject json = new JObject();
            json.Add("requestRack", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRack = jsonResult.GetValue("rack");
            JToken tokenRackType = jsonResult.GetValue("rackType");

            if (tokenRack == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            Rack rack = GetRack(tokenRack, out strErrorMessage);

            if (tokenRackType != null)
                rackType = GetRackType(tokenRackType, out strErrorMessage);

            return rack;
        }

        public Rack GetRack(int rackNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject jsonData = new JObject();
            jsonData.Add("rackNo", rackNo);

            JObject json = new JObject();
            json.Add("requestRack", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRack = jsonResult.GetValue("rack");

            if (tokenRack == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return GetRack(tokenRack, out strErrorMessage);
        }

        public string GetRackCoord(string strBarcode, CodeType codeType, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject jsonData = new JObject();
            jsonData.Add("barcode", strBarcode);
            jsonData.Add("codeTypeNo", codeType.CodeTypeNo);
            jsonData.Add("codeLength", codeType.CodeLength);
            jsonData.Add("codeCount", codeType.CodeCount);

            JObject json = new JObject();
            json.Add("requestRackCoord", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JToken tokenRackCoord = jsonResult.GetValue("coord");

            if (tokenRackCoord == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            return tokenRackCoord.Value<string>();
        }

        public List<RackItem> GetRackItems(Rack rack, out string strErrorMessage)
        {
            return GetRackItems(rack.RackNo, rack.RackTypeNo, out strErrorMessage);
        }

        public List<RackItem> GetRackItems(int rackNo, int rackTypeNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject jsonData = new JObject();
            jsonData.Add("rackTypeNo", rackTypeNo);
            jsonData.Add("rackNo", rackNo);

            JObject json = new JObject();
            json.Add("requestRackItems", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return null;

            JArray arrRackItems = (JArray)jsonResult["items"];

            if (arrRackItems == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            List<RackItem> rackItems = new List<RackItem>();

            foreach (JObject obj in arrRackItems)
            {
                RackItem rackItem = GetRackItem(obj, out strErrorMessage);

                if (rackItem == null)
                    return null;
                else
                    rackItems.Add(rackItem);
            }

            return rackItems;
        }

        public bool Save(Rack rack, List<RackItem> rackItems, out string strErrorMessage)
        {
            strErrorMessage = null;

            JObject jsonData = new JObject();
            jsonData.Add("rack", ToJson(rack));

            if (rackItems != null)
                jsonData.Add("rackItems", ToJson(rackItems));

            JObject json = new JObject();
            json.Add("requestSave", jsonData);

            JObject jsonResult = SendRequest(json, out strErrorMessage);

            if (jsonResult == null || strErrorMessage != null)
                return false;

            return true;
        }

        private JArray ToJson(List<RackItem> rackItems)
        {
            JArray arr = new JArray();

            foreach (RackItem rackItem in rackItems)
            {
                JObject obj = ToJson(rackItem);
                arr.Add(obj);
            }

            return arr;
        }

        private JObject ToJson(RackItem rackItem)
        {
            if (rackItem == null)
                return null;

            JObject jsonData = new JObject();

            jsonData.Add("uPos", rackItem.UPos);
            jsonData.Add("item", ToJson(rackItem.Item));
            jsonData.Add("itemType", ToJson(rackItem.ItemType));
            jsonData.Add("equipmentType", ToJson(rackItem.EquipmentType));

            return jsonData;
        }

        private JObject ToJson(EquipmentType equipmentType)
        {
            if (equipmentType == null)
                return null;

            JObject jsonData = new JObject();

            jsonData.Add("equipmentTypeNo", equipmentType.EquipmentTypeNo);
            jsonData.Add("equipmentTypeName", equipmentType.EquipmentTypeName);
            jsonData.Add("equipmentCategoryNo", equipmentType.EquipmentCategoryNo);

            return jsonData;
        }

        private JObject ToJson(ItemType itemType)
        {
            if (itemType == null)
                return null;

            JObject jsonData = new JObject();

            jsonData.Add("itemTypeNo", itemType.ItemTypeNo);
            jsonData.Add("equipmentTypeNo", itemType.EquipmentTypeNo);
            jsonData.Add("companyNo", itemType.CompanyNo);
            jsonData.Add("modelName", itemType.ModelName);
            jsonData.Add("height", itemType.Height);
            jsonData.Add("width", itemType.Width);
            jsonData.Add("depth", itemType.Depth);
            jsonData.Add("unit", itemType.Unit);
            jsonData.Add("imageUrl", itemType.ImageUrl);
            jsonData.Add("glbUrl", itemType.GlbUrl);
            jsonData.Add("fbxUrl", itemType.FbxUrl);
            jsonData.Add("type", itemType.Type);
            jsonData.Add("regTime", itemType.RegTime);

            return jsonData;
        }

        private JObject ToJson(Item item)
        {
            if (item == null)
                return null;

            JObject jsonData = new JObject();

            jsonData.Add("itemNo", item.ItemNo);
            jsonData.Add("itemName", item.ItemName);
            jsonData.Add("dataCenterNo", item.DataCenterNo);
            jsonData.Add("itemTypeNo", item.ItemTypeNo);
            jsonData.Add("regTime", item.RegTime);
            jsonData.Add("barcode", item.Barcode);

            return jsonData;
        }

        private JObject ToJson(Rack rack)
        {
            if (rack == null)
                return null;

            JObject jsonData = new JObject();

            jsonData.Add("rackNo", rack.RackNo);
            jsonData.Add("rackName", rack.RackName);
            jsonData.Add("dataCenterNo", rack.DataCenterNo);
            jsonData.Add("rackGroupNo", rack.RackGroupNo);
            jsonData.Add("rackTypeNo", rack.RackTypeNo);
            jsonData.Add("rotation", rack.Rotation);
            jsonData.Add("x", rack.X);
            jsonData.Add("y", rack.Y);
            jsonData.Add("z", rack.Z);
            jsonData.Add("regTime", rack.RegTime);
            jsonData.Add("barcode", rack.Barcode);

            return jsonData;
        }

        private RackItem GetRackItem(JObject obj, out string strErrorMessage)
        {
            int? uPos = obj["uPos"].Value<int>();

            if (uPos == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            Item item = GetItem(obj["item"], out strErrorMessage);

            if (item == null && strErrorMessage != null)
                return null;

            ItemType itemType = GetItemType(obj["itemType"], out strErrorMessage);

            if (itemType == null && strErrorMessage != null)
                return null;

            EquipmentType equipmentType = GetEquipmentType(obj["equipmentType"], out strErrorMessage);

            if (equipmentType == null && strErrorMessage != null)
                return null;

            RackItem rackItem = new RackItem();

            rackItem.UPos = (int)uPos;
            rackItem.Item = item;
            rackItem.ItemType = itemType;
            rackItem.EquipmentType = equipmentType;

            return rackItem;
        }

        private Rack GetRack(JToken tokenRack, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenRack == null || tokenRack.Type == JTokenType.Null)
                return null;

            int? rackNo = GetValuei(tokenRack, "rackNo");
            string rackName = GetValues(tokenRack, "rackName");
            int? dataCenterNo = GetValuei(tokenRack, "dataCenterNo");
            int? rackGroupNo = GetValuei(tokenRack, "rackGroupNo");
            int? rackTypeNo = GetValuei(tokenRack, "rackTypeNo");
            double? rotation = GetValued(tokenRack, "rotation");
            int? x = GetValuei(tokenRack, "x");
            int? y = GetValuei(tokenRack, "y");
            int? z = GetValuei(tokenRack, "z");
            DateTime? regTime = GetValuet(tokenRack, "regTime");
            string barcode = GetValues(tokenRack, "barcode");

            if (rackNo == null || rackName == null || dataCenterNo == null ||
                rackTypeNo == null || rotation == null || x == null ||
                y == null || z == null || regTime == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            Rack rack = new Rack();

            rack.RackNo = (int)rackNo;
            rack.RackName = rackName;
            rack.DataCenterNo = (int)dataCenterNo;
            rack.RackGroupNo = rackGroupNo;
            rack.RackTypeNo = (int)rackTypeNo;
            rack.Rotation = (int)rotation;
            rack.X = (int)x;
            rack.Y = (int)y;
            rack.Z = (int)z;
            rack.RegTime = (DateTime)regTime;
            rack.Barcode = barcode;

            strErrorMessage = null;
            return rack;
        }

        private RackUnit GetRackUnit(JToken tokenRackUnit, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenRackUnit == null || tokenRackUnit.Type == JTokenType.Null)
                return null;

            int? rackUnitNo = GetValuei(tokenRackUnit, "rackUnitNo");
            string barcode = GetValues(tokenRackUnit, "barcode");
            int? codeTypeNo = GetValuei(tokenRackUnit, "codeTypeNo");

            if (rackUnitNo == null || barcode == null || codeTypeNo == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            RackUnit rackUnit = new RackUnit();

            rackUnit.RackUnitNo = (int)rackUnitNo;
            rackUnit.Barcode = barcode;
            rackUnit.CodeTypeNo = (int)codeTypeNo;
            strErrorMessage = null;

            return rackUnit;
        }

        private RackType GetRackType(JToken tokenRackType, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenRackType == null || tokenRackType.Type == JTokenType.Null)
                return null;

            int? rackTypeNo = GetValuei(tokenRackType, "rackTypeNo");
            int? companyNo = GetValuei(tokenRackType, "companyNo");
            string modelName = GetValues(tokenRackType, "modelName");
            int? height = GetValuei(tokenRackType, "height");
            int? width = GetValuei(tokenRackType, "width");
            int? depth = GetValuei(tokenRackType, "depth");
            int? unit = GetValuei(tokenRackType, "unit");
            string imageUrl = GetValues(tokenRackType, "imageUrl");
            string glbUrl = GetValues(tokenRackType, "glbUrl");
            string fbxUrl = GetValues(tokenRackType, "fbxUrl");
            string type = GetValues(tokenRackType, "type");
            DateTime? regTime = GetValuet(tokenRackType, "regTime");
            string barcode = GetValues(tokenRackType, "barcode");

            if (rackTypeNo == null || companyNo == null || modelName == null ||
                height == null || width == null || depth == null ||
                unit == null || type == null || regTime == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            RackType rackType = new RackType();

            rackType.RackTypeNo = (int)rackTypeNo;
            rackType.CompanyNo = (int)companyNo;
            rackType.ModelName = modelName;
            rackType.Height = (int)height;
            rackType.Width = (int)width;
            rackType.Depth = (int)depth;
            rackType.Unit = (int)unit;
            rackType.ImageUrl = imageUrl;
            rackType.GlbUrl = glbUrl;
            rackType.FbxUrl = fbxUrl;
            rackType.Type = type;
            rackType.RegTime = (DateTime)regTime;
            rackType.Barcode = barcode;

            return rackType;
        }

        private CodeType GetCodeType(JToken tokenCodeType, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenCodeType == null || tokenCodeType.Type == JTokenType.Null)
                return null;

            int? codeTypeNo = GetValuei(tokenCodeType, "codeTypeNo");
            string codeTypeName = GetValues(tokenCodeType, "codeTypeName");
            string codeTypeEngName = GetValues(tokenCodeType, "codeTypeEngName");
            int? codeLength = GetValuei(tokenCodeType, "codeLength");
            int? codeCount = GetValuei(tokenCodeType, "codeCount");

            if (codeTypeNo == null || codeTypeName == null || codeTypeEngName == null ||
                codeLength == null || codeCount == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            CodeType codeType = new CodeType();

            codeType.CodeTypeNo = (int)codeTypeNo;
            codeType.CodeTypeName = codeTypeName;
            codeType.CodeTypeEngName = codeTypeEngName;
            codeType.CodeLength = (int)codeLength;
            codeType.CodeCount = (int)codeCount;

            return codeType;
        }

        private EquipmentType GetEquipmentType(JToken tokenEquipmentType, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenEquipmentType == null || tokenEquipmentType.Type == JTokenType.Null)
                return null;

            int? equipmentTypeNo = GetValuei(tokenEquipmentType, "equipmentTypeNo");
            string equipmentTypeName = GetValues(tokenEquipmentType, "equipmentTypeName");
            int? equipmentCategoryNo = GetValuei(tokenEquipmentType, "equipmentCategoryNo");

            if (equipmentTypeNo == null || equipmentTypeName == null || equipmentCategoryNo == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            EquipmentType equipmentType = new EquipmentType();

            equipmentType.EquipmentTypeNo = (int)equipmentTypeNo;
            equipmentType.EquipmentTypeName = equipmentTypeName;
            equipmentType.EquipmentCategoryNo = (int)equipmentCategoryNo;

            return equipmentType;
        }

        private ItemType GetItemType(JToken tokenItemType, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenItemType == null || tokenItemType.Type == JTokenType.Null)
                return null;

            int? itemTypeNo = GetValuei(tokenItemType, "itemTypeNo");
            int? equipmentTypeNo = GetValuei(tokenItemType, "equipmentTypeNo");
            int? companyNo = GetValuei(tokenItemType, "companyNo");
            string modelName = GetValues(tokenItemType, "modelName");
            int? height = GetValuei(tokenItemType, "height");
            int? width = GetValuei(tokenItemType, "width");
            int? depth = GetValuei(tokenItemType, "depth");
            int? unit = GetValuei(tokenItemType, "unit");
            string imageUrl = GetValues(tokenItemType, "imageUrl");
            string glbUrl = GetValues(tokenItemType, "glbUrl");
            string fbxUrl = GetValues(tokenItemType, "fbxUrl");
            string type = GetValues(tokenItemType, "type");
            DateTime? regTime = GetValuet(tokenItemType, "regTime");

            if (itemTypeNo == null || equipmentTypeNo == null || companyNo == null ||
                modelName == null || unit == null || regTime == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            ItemType itemType = new ItemType();

            itemType.ItemTypeNo = (int)itemTypeNo;
            itemType.EquipmentTypeNo = (int)equipmentTypeNo;
            itemType.CompanyNo = (int)companyNo;
            itemType.ModelName = modelName;
            itemType.Height = height;
            itemType.Width = width;
            itemType.Depth = depth;
            itemType.Unit = (int)unit;
            itemType.ImageUrl = imageUrl;
            itemType.GlbUrl = glbUrl;
            itemType.FbxUrl = fbxUrl;
            itemType.Type = type;
            itemType.RegTime = (DateTime)regTime;

            return itemType;
        }

        private Item GetItem(JToken tokenItem, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenItem == null || tokenItem.Type == JTokenType.Null)
                return null;

            int? itemNo = GetValuei(tokenItem, "itemNo");
            string strItemName = GetValues(tokenItem, "itemName");
            int? dataCenterNo = GetValuei(tokenItem, "dataCenterNo");
            int? itemTypeNo = GetValuei(tokenItem, "itemTypeNo");
            DateTime? regTime = GetValuet(tokenItem, "regTime");
            string strBarcode = GetValues(tokenItem, "barcode");

            if (itemNo == null || strItemName == null || dataCenterNo == null ||
                itemTypeNo == null || regTime == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            Item item = new Item();

            item.ItemNo = (int)itemNo;
            item.ItemName = strItemName;
            item.DataCenterNo = (int)dataCenterNo;
            item.ItemTypeNo = (int)itemTypeNo;
            item.RegTime = (DateTime)regTime;
            item.Barcode = strBarcode;

            return item;
        }

        private DataCenter GetDataCenter(JToken tokenDataCenter, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (tokenDataCenter == null || tokenDataCenter.Type == JTokenType.Null)
                return null;

            int? dataCenterNo = GetValuei(tokenDataCenter, "dataCenterNo");
            string strDataCenterName = GetValues(tokenDataCenter, "dataCenterName");
            int? regionNo = GetValuei(tokenDataCenter, "regionNo");
            int? siteNo = GetValuei(tokenDataCenter, "siteNo");
            string strAddress = GetValues(tokenDataCenter, "address");
            DateTime? regTime = GetValuet(tokenDataCenter, "regTime");
            int? width = GetValuei(tokenDataCenter, "width");
            int? length = GetValuei(tokenDataCenter, "length");
            int? height = GetValuei(tokenDataCenter, "height");
            int? tileWidth = GetValuei(tokenDataCenter, "tileWidth");
            int? tileLength = GetValuei(tokenDataCenter, "tileLength");
            int? tileElevation = GetValuei(tokenDataCenter, "tileElevation");
            double? latitude = GetValued(tokenDataCenter, "latitude");
            double? longitude = GetValued(tokenDataCenter, "longitude");
            string barcode = GetValues(tokenDataCenter, "barcode");

            if (dataCenterNo == null || strDataCenterName == null || regionNo == null ||
                siteNo == null || strAddress == null || regTime == null ||
                width == null || length == null || height == null ||
                tileWidth == null || tileLength == null || tileElevation == null ||
                latitude == null || longitude == null)
            {
                strErrorMessage = "잘못된 데이터입니다.";
                return null;
            }

            DataCenter dataCenter = new DataCenter();

            dataCenter.DataCenterNo = (int)dataCenterNo;
            dataCenter.DataCenterName = strDataCenterName;
            dataCenter.RegionNo = (int)regionNo;
            dataCenter.SiteNo = (int)siteNo;
            dataCenter.Address = strAddress;
            dataCenter.RegTime = (DateTime)regTime;
            dataCenter.Width = (int)width;
            dataCenter.Length = (int)length;
            dataCenter.Height = (int)height;
            dataCenter.TileWidth = (int)tileWidth;
            dataCenter.TileLength = (int)tileLength;
            dataCenter.TileElevation = (int)tileElevation;
            dataCenter.Latitude = (double)latitude;
            dataCenter.Longitude = (double)longitude;
            dataCenter.Barcode = barcode;

            return dataCenter;
        }

        private JObject SendRequest(JObject json, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (m_strBaseUrl == null)
                return null;

            string strUrl = m_strBaseUrl + "/RequestData";
            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                JObject jsonResult = JObject.Parse(strResult);

                JToken tokenSuccess = jsonResult.GetValue("success");
                JToken tokenMessage = jsonResult.GetValue("message");

                if (tokenSuccess == null || tokenMessage == null)
                {
                    strErrorMessage = "잘못된 데이터입니다.";
                    return null;
                }

                bool success = tokenSuccess.Value<bool>();

                if (success == false)
                {
                    strErrorMessage = tokenMessage.Value<string>();
                    return null;
                }

                return jsonResult;
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }

        private int? GetValuei(JToken token, string strKey)
        {
            JToken obj = token[strKey];

            if (obj == null || obj.Type == JTokenType.Null)
                return null;

            return obj.Value<int>();
        }

        private DateTime? GetValuet(JToken token, string strKey)
        {
            JToken obj = token[strKey];

            if (obj == null || obj.Type == JTokenType.Null)
                return null;

            return obj.Value<DateTime>();
        }

        private double? GetValued(JToken token, string strKey)
        {
            JToken obj = token[strKey];

            if (obj == null || obj.Type == JTokenType.Null)
                return null;

            return obj.Value<double>();
        }

        private string GetValues(JToken token, string strKey)
        {
            JToken obj = token[strKey];

            if (obj == null || obj.Type == JTokenType.Null)
                return null;

            return obj.Value<string>();
        }
    }
}
