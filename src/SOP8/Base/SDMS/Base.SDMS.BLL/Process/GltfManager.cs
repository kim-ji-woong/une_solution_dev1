using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using System.Collections.Generic;
using Base.SDMS.IBLL.Models;
using Response;
using System.Collections;

namespace Base.SDMS.BLL.Process
{
    class GltfManager
    {
        private IDataManager m_dataManager = null;

        public GltfManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseGltfModelList GetGltfModelList(RequestGltfModelList data)
        {
            string strErrorMessage;
            string strCondition = null;

            if (data.SiteNos != null && data.SiteNos.Count > 0)
                strCondition = string.Format("{0} in ({1})", Model.Gltf.Model.Fields.site_sn, string.Join(",", data.SiteNos.ToArray()));

            IEnumerable<Model.Gltf.Model> models = m_dataManager.GetSelect().Select<Model.Gltf.Model>(strCondition, out strErrorMessage);

            if (models == null)
                return new ResponseGltfModelList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (data.SiteNos != null && data.SiteNos.Count > 0)
            {
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                    Model.Gltf.ModelData.Fields.gltf_model_sn,
                    Model.Gltf.Model.Fields.gltf_model_sn,
                    Model.Gltf.Model.TableName,
                    Model.Gltf.Model.Fields.site_sn,
                    string.Join(",", data.SiteNos.ToArray()));
            }

            IEnumerable<Model.Gltf.ModelData> modelDatas = m_dataManager.GetSelect().Select<Model.Gltf.ModelData>(strCondition, out strErrorMessage);

            if (modelDatas == null)
                return new ResponseGltfModelList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            if (data.SiteNos != null && data.SiteNos.Count > 0)
            {
                strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                    Model.Gltf.ModelOrthoData.Fields.gltf_model_sn,
                    Model.Gltf.Model.Fields.gltf_model_sn,
                    Model.Gltf.Model.TableName,
                    Model.Gltf.Model.Fields.site_sn,
                    string.Join(",", data.SiteNos.ToArray()));
            }

            IEnumerable<Model.Gltf.ModelOrthoData> modelOrthoDatas = m_dataManager.GetSelect().Select<Model.Gltf.ModelOrthoData>(strCondition, out strErrorMessage);

            if (modelOrthoDatas == null)
                return new ResponseGltfModelList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            // dicGltfModelNos.Value : 첫번째 요소(modelDataNo), 두번재 요소(modelOrthoDataNo)
            Dictionary<GltfModel, ArrayList> dicGltfModelNos = new Dictionary<GltfModel, ArrayList>();

            ResponseGltfModelList response = new ResponseGltfModelList(true, "");
            response.SiteModels = GetSiteModels(models, modelDatas, modelOrthoDatas, dicGltfModelNos);

            if (data.UserNo != null)
            {
                if (ConvertPrivateViewport(response.SiteModels, dicGltfModelNos, out strErrorMessage) == false)
                    return new ResponseGltfModelList(false, strErrorMessage);
            }

            if (ReadGltfOptions(response, out strErrorMessage) == false)
                return new ResponseGltfModelList(false, strErrorMessage, DBError.GetInsertErrorCode(strErrorMessage));

            return response;
        }

        public MessageResult SaveViewport(RequestSaveViewport data)
        {
            string strCondition = null;

            if (data.ZoneNo != null)
                strCondition = string.Format("{0} = {1}", Model.Gltf.ModelData.Fields.zone_sn, (int)data.ZoneNo);
            else if (data.ModelName != null)
                strCondition = string.Format("{0} = '{1}'", Model.Gltf.ModelData.Fields.model_file, data.ModelName);
            else
                return new MessageResult(false, "잘못된 parameter입니다.");

            string strErrorMessage;
            Model.Gltf.ModelData modelData = m_dataManager.GetSelect().SelectFirst<Model.Gltf.ModelData>(strCondition, out strErrorMessage);

            if (modelData == null)
            {
                if (strErrorMessage != null)
                    return new MessageResult(false, strErrorMessage);
                else
                    return new MessageResult(false, "해당 Zone에 대한 Viewport가 Database에 존재하지 않습니다.");
            }

            if (data.UserNo != null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    Model.Gltf.PrivateModelData.Fields.gltf_model_data_sn, modelData.gltf_model_data_sn,
                    Model.Gltf.PrivateModelData.Fields.user_sn, (int)data.UserNo);

                Model.Gltf.PrivateModelData privateModelData = m_dataManager.GetSelect().SelectFirst<Model.Gltf.PrivateModelData>(strCondition, out strErrorMessage);

                if (privateModelData == null)
                {
                    if (strErrorMessage != null)
                        return new MessageResult(false, strErrorMessage);
                    else
                    {
                        if (CreatePrivateModelData(data, (int)data.UserNo, modelData, out strErrorMessage) == false)
                            return new MessageResult(false, strErrorMessage);
                    }
                }
                else
                {
                    if (UpdatePrivateModelData(data, privateModelData, out strErrorMessage) == false)
                        return new MessageResult(false, strErrorMessage);
                }
            }
            else
            {
                if (UpdateModelData(data, modelData, out strErrorMessage) == false)
                    return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        public MessageResult SaveOrthoViewport(RequestSaveOrthoViewport data)
        {
            string strCondition = null;

            if (data.ZoneNo != null)
                strCondition = string.Format("{0} = {1}", Model.Gltf.ModelOrthoData.Fields.zone_sn, (int)data.ZoneNo);
            else if (data.ModelName != null)
                strCondition = string.Format("{0} = '{1}'", Model.Gltf.ModelOrthoData.Fields.model_file, data.ModelName);
            else
                return new MessageResult(false, "잘못된 parameter입니다.");

            string strErrorMessage;
            Model.Gltf.ModelOrthoData modelData = m_dataManager.GetSelect().SelectFirst<Model.Gltf.ModelOrthoData>(strCondition, out strErrorMessage);

            if (modelData == null)
            {
                if (strErrorMessage != null)
                    return new MessageResult(false, strErrorMessage);
                else
                    return new MessageResult(false, "해당 Zone에 대한 Viewport가 Database에 존재하지 않습니다.");
            }

            if (data.UserNo != null)
            {
                strCondition = string.Format("{0} = {1} and {2} = {3}",
                    Model.Gltf.PrivateModelOrthoData.Fields.gltf_model_ortho_data_sn, modelData.gltf_model_ortho_data_sn,
                    Model.Gltf.PrivateModelOrthoData.Fields.user_sn, (int)data.UserNo);

                Model.Gltf.PrivateModelOrthoData privateModelData = m_dataManager.GetSelect().SelectFirst<Model.Gltf.PrivateModelOrthoData>(strCondition, out strErrorMessage);

                if (privateModelData == null)
                {
                    if (strErrorMessage != null)
                        return new MessageResult(false, strErrorMessage);
                    else
                    {
                        if (CreatePrivateModelOrthoData(data, (int)data.UserNo, modelData, out strErrorMessage) == false)
                            return new MessageResult(false, strErrorMessage);
                    }
                }
                else
                {
                    if (UpdatePrivateModelOrthoData(data, privateModelData, out strErrorMessage) == false)
                        return new MessageResult(false, strErrorMessage);
                }
            }
            else
            {
                if (UpdateModelOrthoData(data, modelData, out strErrorMessage) == false)
                    return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(true, "");
        }

        // dicGltfModelNos.Value : 첫번째 요소(modelDataNo), 두번재 요소(modelOrthoDataNo)
        private bool ConvertPrivateViewport(Dictionary<string, GltfModels> dicSiteModels, Dictionary<GltfModel, ArrayList> dicGltfModelNos, out string strErrorMessage)
        {
            Dictionary<int, Model.Gltf.PrivateModelData> dicPrivateModelDatas = ReadPrivateModelDatas(out strErrorMessage);

            if (dicPrivateModelDatas == null)
                return false;

            Dictionary<int, Model.Gltf.PrivateModelOrthoData> dicPrivateModelOrthoDatas = ReadPrivateModelOrthoDatas(out strErrorMessage);

            if (dicPrivateModelOrthoDatas == null)
                return false;

            foreach (KeyValuePair<string, GltfModels> pair in dicSiteModels)
            {
                if (pair.Value.OutdoorModel != null)
                {
                    ConvertPrivateViewport(pair.Value.OutdoorModel, dicGltfModelNos, dicPrivateModelDatas, dicPrivateModelOrthoDatas);
                }

                if (pair.Value.IndoorModels != null)
                {
                    foreach (GltfModel model in pair.Value.IndoorModels)
                    {
                        ConvertPrivateViewport(model, dicGltfModelNos, dicPrivateModelDatas, dicPrivateModelOrthoDatas);
                    }
                }
            }

            return true;
        }

        private void ConvertPrivateViewport(GltfModel model, Dictionary<GltfModel, ArrayList> dicGltfModelNos, Dictionary<int, Model.Gltf.PrivateModelData> dicPrivateModelDatas, Dictionary<int, Model.Gltf.PrivateModelOrthoData> dicPrivateModelOrthoDatas)
        {
            ArrayList arrDatas;

            if (dicGltfModelNos.TryGetValue(model, out arrDatas) && arrDatas.Count == 2)
            {
                int modelDataNo = (int)arrDatas[0];
                int modelOrthoDataNo = (int)arrDatas[1];

                Model.Gltf.PrivateModelData privateModelData;
                Model.Gltf.PrivateModelOrthoData privateModelOrthoData;

                if (dicPrivateModelDatas.TryGetValue(modelDataNo, out privateModelData))
                    ConvertPrivateModelData(model, privateModelData);

                if (dicPrivateModelOrthoDatas.TryGetValue(modelOrthoDataNo, out privateModelOrthoData))
                    ConvertPrivateModelOrthoData(model, privateModelOrthoData);
            }

            foreach (GltfModel child in model.Children)
            {
                ConvertPrivateViewport(child, dicGltfModelNos, dicPrivateModelDatas, dicPrivateModelOrthoDatas);
            }
        }

        private void ConvertPrivateModelData(GltfModel model, Model.Gltf.PrivateModelData privateModelData)
        {
            model.Camera.Position[0] = privateModelData.camera_lc_x;
            model.Camera.Position[1] = privateModelData.camera_lc_y;
            model.Camera.Position[2] = privateModelData.camera_lc_z;

            model.Camera.Rotation[0] = privateModelData.camera_rtate_x;
            model.Camera.Rotation[1] = privateModelData.camera_rtate_y;
            model.Camera.Rotation[2] = privateModelData.camera_rtate_z;

            model.Camera.Orbit[0] = privateModelData.orbit_x;
            model.Camera.Orbit[1] = privateModelData.orbit_y;
            model.Camera.Orbit[2] = privateModelData.orbit_z;
        }

        private void ConvertPrivateModelOrthoData(GltfModel model, Model.Gltf.PrivateModelOrthoData privateModelOrthoData)
        {
            model.CameraOrtho.Position[0] = privateModelOrthoData.camera_lc_x;
            model.CameraOrtho.Position[1] = privateModelOrthoData.camera_lc_y;
            model.CameraOrtho.Position[2] = privateModelOrthoData.camera_lc_z;

            model.CameraOrtho.Rotation[0] = privateModelOrthoData.camera_rtate_x;
            model.CameraOrtho.Rotation[1] = privateModelOrthoData.camera_rtate_y;
            model.CameraOrtho.Rotation[2] = privateModelOrthoData.camera_rtate_z;

            model.CameraOrtho.TargetControl[0] = privateModelOrthoData.trgt_x;
            model.CameraOrtho.TargetControl[1] = privateModelOrthoData.trgt_y;
            model.CameraOrtho.TargetControl[2] = privateModelOrthoData.trgt_z;
            model.CameraOrtho.Zoom = privateModelOrthoData.zoom;
        }

        private Dictionary<int, Model.Gltf.PrivateModelData> ReadPrivateModelDatas(out string strErrorMessage)
        {
            IEnumerable<Model.Gltf.PrivateModelData> privateModelDatas = m_dataManager.GetSelect().Select<Model.Gltf.PrivateModelData>(null, out strErrorMessage);

            if (privateModelDatas == null)
                return null;

            Dictionary<int, Model.Gltf.PrivateModelData> dicModelDatas = new Dictionary<int, Model.Gltf.PrivateModelData>();

            foreach (var modelData in privateModelDatas)
            {
                dicModelDatas[modelData.gltf_model_data_sn] = modelData;
            }

            return dicModelDatas;
        }

        private Dictionary<int, Model.Gltf.PrivateModelOrthoData> ReadPrivateModelOrthoDatas(out string strErrorMessage)
        {
            IEnumerable<Model.Gltf.PrivateModelOrthoData> privateModelOrthoDatas = m_dataManager.GetSelect().Select<Model.Gltf.PrivateModelOrthoData>(null, out strErrorMessage);

            if (privateModelOrthoDatas == null)
                return null;

            Dictionary<int, Model.Gltf.PrivateModelOrthoData> dicModelDatas = new Dictionary<int, Model.Gltf.PrivateModelOrthoData>();

            foreach (var modelData in privateModelOrthoDatas)
            {
                dicModelDatas[modelData.gltf_model_ortho_data_sn] = modelData;
            }

            return dicModelDatas;
        }

        private bool UpdateModelData(RequestSaveViewport request, Model.Gltf.ModelData modelData, out string strErrorMessage)
        {
            modelData.camera_lc_x = request.CameraPositionX;
            modelData.camera_lc_y = request.CameraPositionY;
            modelData.camera_lc_z = request.CameraPositionZ;
            modelData.camera_rtate_x = request.CameraRotationX;
            modelData.camera_rtate_y = request.CameraRotationY;
            modelData.camera_rtate_z = request.CameraRotationZ;
            modelData.orbit_x = request.OrbitTargetX;
            modelData.orbit_y = request.OrbitTargetY;
            modelData.orbit_z = request.OrbitTargetZ;

            return m_dataManager.GetUpdate().Update<Model.Gltf.ModelData>(modelData, null, out strErrorMessage);
        }

        private bool UpdateModelOrthoData(RequestSaveOrthoViewport request, Model.Gltf.ModelOrthoData modelData, out string strErrorMessage)
        {
            modelData.camera_lc_x = request.CameraPositionX;
            modelData.camera_lc_y = request.CameraPositionY;
            modelData.camera_lc_z = request.CameraPositionZ;
            modelData.camera_rtate_x = request.CameraRotationX;
            modelData.camera_rtate_y = request.CameraRotationY;
            modelData.camera_rtate_z = request.CameraRotationZ;
            modelData.trgt_x = request.TargetX;
            modelData.trgt_y = request.TargetY;
            modelData.trgt_z = request.TargetZ;
            modelData.zoom = request.Zoom;

            return m_dataManager.GetUpdate().Update<Model.Gltf.ModelOrthoData>(modelData, null, out strErrorMessage);
        }

        private bool UpdatePrivateModelData(RequestSaveViewport request, Model.Gltf.PrivateModelData privateModelData, out string strErrorMessage)
        {
            privateModelData.camera_lc_x = request.CameraPositionX;
            privateModelData.camera_lc_y = request.CameraPositionY;
            privateModelData.camera_lc_z = request.CameraPositionZ;
            privateModelData.camera_rtate_x = request.CameraRotationX;
            privateModelData.camera_rtate_y = request.CameraRotationY;
            privateModelData.camera_rtate_z = request.CameraRotationZ;
            privateModelData.orbit_x = request.OrbitTargetX;
            privateModelData.orbit_y = request.OrbitTargetY;
            privateModelData.orbit_z = request.OrbitTargetZ;

            return m_dataManager.GetUpdate().Update<Model.Gltf.PrivateModelData>(privateModelData, null, out strErrorMessage);
        }

        private bool UpdatePrivateModelOrthoData(RequestSaveOrthoViewport request, Model.Gltf.PrivateModelOrthoData privateModelData, out string strErrorMessage)
        {
            privateModelData.camera_lc_x = request.CameraPositionX;
            privateModelData.camera_lc_y = request.CameraPositionY;
            privateModelData.camera_lc_z = request.CameraPositionZ;
            privateModelData.camera_rtate_x = request.CameraRotationX;
            privateModelData.camera_rtate_y = request.CameraRotationY;
            privateModelData.camera_rtate_z = request.CameraRotationZ;
            privateModelData.trgt_x = request.TargetX;
            privateModelData.trgt_y = request.TargetY;
            privateModelData.trgt_z = request.TargetZ;
            privateModelData.zoom = request.Zoom;

            return m_dataManager.GetUpdate().Update<Model.Gltf.PrivateModelOrthoData>(privateModelData, null, out strErrorMessage);
        }

        private bool CreatePrivateModelData(RequestSaveViewport request, int userNo, Model.Gltf.ModelData modelData, out string strErrorMessage)
        {
            Model.Gltf.PrivateModelData privateModelData = new Model.Gltf.PrivateModelData();

            privateModelData.gltf_model_data_sn = modelData.gltf_model_data_sn;
            privateModelData.user_sn = userNo;
            privateModelData.camera_lc_x = request.CameraPositionX;
            privateModelData.camera_lc_y = request.CameraPositionY;
            privateModelData.camera_lc_z = request.CameraPositionZ;
            privateModelData.camera_rtate_x = request.CameraRotationX;
            privateModelData.camera_rtate_y = request.CameraRotationY;
            privateModelData.camera_rtate_z = request.CameraRotationZ;
            privateModelData.near = 0.1;
            privateModelData.far = 5000;
            privateModelData.fov = 60;
            privateModelData.orbit_x = request.OrbitTargetX;
            privateModelData.orbit_y = request.OrbitTargetY;
            privateModelData.orbit_z = request.OrbitTargetZ;

            return m_dataManager.GetCreate().Insert<Model.Gltf.PrivateModelData>(privateModelData, out strErrorMessage);
        }

        private bool CreatePrivateModelOrthoData(RequestSaveOrthoViewport request, int userNo, Model.Gltf.ModelOrthoData modelData, out string strErrorMessage)
        {
            Model.Gltf.PrivateModelOrthoData privateModelData = new Model.Gltf.PrivateModelOrthoData();

            privateModelData.gltf_model_ortho_data_sn = modelData.gltf_model_ortho_data_sn;
            privateModelData.user_sn = userNo;
            privateModelData.camera_lc_x = request.CameraPositionX;
            privateModelData.camera_lc_y = request.CameraPositionY;
            privateModelData.camera_lc_z = request.CameraPositionZ;
            privateModelData.camera_rtate_x = request.CameraRotationX;
            privateModelData.camera_rtate_y = request.CameraRotationY;
            privateModelData.camera_rtate_z = request.CameraRotationZ;
            privateModelData.trgt_x = request.TargetX;
            privateModelData.trgt_y = request.TargetY;
            privateModelData.trgt_z = request.TargetZ;
            privateModelData.zoom = request.Zoom;

            return m_dataManager.GetCreate().Insert<Model.Gltf.PrivateModelOrthoData>(privateModelData, out strErrorMessage);
        }

        private bool ReadGltfOptions(ResponseGltfModelList response, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} like 'Gltf/%'", Model.Common.Option.Fields.prop_name);
            var options = m_dataManager.GetSelect().Select<Model.Common.Option>(strCondition, out strErrorMessage);

            if (options == null)
                return false;

            foreach (var option in options)
            {
                string strPropertyName = option.prop_name.ToLower();

                if (strPropertyName.EndsWith("3dmodelbaseurl"))
                    response.Options.ModelBaseUrl = option.prop_value;
                else if (strPropertyName.EndsWith("3dtexturebaseurl"))
                    response.Options.TextureBaseUrl = option.prop_value;
                else if (strPropertyName.EndsWith("3dbackgroundimage"))
                    response.Options.BackgroundImage = option.prop_value;
                else if (strPropertyName.EndsWith("indoormodelonmemory"))
                    response.Options.IndoorModelOnMemory = GetBooleanValue(option.prop_value);
                else if (strPropertyName.EndsWith("hdrurl"))
                    response.Options.HdrUrl = option.prop_value;
            }

            return true;
        }

        private bool GetBooleanValue(string strValue)
        {
            if (strValue == null)
                return false;

            strValue = strValue.ToLower();

            if (strValue == "1" || strValue == "true")
                return true;

            return false;
        }

        // dicGltfModelNos.Value : 첫번째 요소(modelDataNo), 두번재 요소(modelOrthoDataNo)
        private Dictionary<string, GltfModels> GetSiteModels(IEnumerable<Model.Gltf.Model> models, IEnumerable<Model.Gltf.ModelData> modelDatas, IEnumerable<Model.Gltf.ModelOrthoData> modelOrthoDatas, Dictionary<GltfModel, ArrayList> dicGltfModelNos)
        {
            // Key : SiteNo
            Dictionary<string, GltfModels> dicSiteModels = new Dictionary<string, GltfModels>();
            // Key : gltf_model_sn
            Dictionary<int, Model.Gltf.Model> dicModels = new Dictionary<int, Model.Gltf.Model>();
            // Key : gltf_model_sn
            //Dictionary<int, GltfModel> dicGltfModels = new Dictionary<int, GltfModel>();

            GltfModels gltfModels;

            foreach (var model in models)
            {
                dicModels[model.gltf_model_sn] = model;

                string strSiteNo = model.site_sn.ToString();

                if (dicSiteModels.TryGetValue(strSiteNo, out gltfModels) == false)
                {
                    int modelDataNo, modelOrthoDataNo;
                    gltfModels = new GltfModels();
                    gltfModels.OutdoorModel = GetOutdoorModel(model.gltf_model_sn, modelDatas, modelOrthoDatas, out modelDataNo, out modelOrthoDataNo);
                    dicSiteModels[strSiteNo] = gltfModels;

                    ArrayList arrDatas = new ArrayList();
                    arrDatas.Add(modelDataNo);
                    arrDatas.Add(modelOrthoDataNo);

                    dicGltfModelNos[gltfModels.OutdoorModel] = arrDatas;
                }
            }

            Dictionary<int, GltfModel> dicBuildingGroupModels = new Dictionary<int, GltfModel>();
            Dictionary<int, GltfModel> dicBuildingModels = new Dictionary<int, GltfModel>();
            Dictionary<int, List<GltfModel>> dicIndoorModels = GetIndoorModels(modelDatas, modelOrthoDatas, dicGltfModelNos);

            SetBuildingGroupModels(models, dicIndoorModels, dicSiteModels, dicBuildingGroupModels);
            SetBuildingModels(dicIndoorModels, dicModels, dicBuildingGroupModels, dicBuildingModels);
            SetZoneModels(dicIndoorModels, dicModels, dicBuildingModels);

            return dicSiteModels;
        }

        private long MakeKey(int modelDataNo, int modelOrthoDataNo)
        {
            long no = modelDataNo;
            long orthoNo = modelOrthoDataNo;
            return (no << 32) | orthoNo;
        }

        private void SetZoneModels(Dictionary<int, List<GltfModel>> dicIndoorModels, Dictionary<int, Model.Gltf.Model> dicModels, Dictionary<int, GltfModel> dicBuildingModels)
        {
            foreach (KeyValuePair<int, List<GltfModel>> pair in dicIndoorModels)
            {
                int gltfModelNo = pair.Key;

                foreach (GltfModel indoorModel in pair.Value)
                {
                    if (indoorModel.ZoneNo != null)
                    {
                        Model.Gltf.Model parentModel, model;

                        if (dicModels.TryGetValue(gltfModelNo, out model))
                        {
                            if (model.parnts_sn != null && dicModels.TryGetValue((int)model.parnts_sn, out parentModel))
                            {
                                GltfModel buildingModel;

                                if (dicBuildingModels.TryGetValue(parentModel.gltf_model_sn, out buildingModel))
                                {
                                    buildingModel.Children.Add(indoorModel);
                                }
                                else if (dicBuildingModels.TryGetValue(model.gltf_model_sn, out buildingModel))
                                {
                                    // Building과 Zone은 같은 GltfModel을 공유할 수 있다.
                                    buildingModel.Children.Add(indoorModel);
                                }
                            }
                        }
                    }
                }
            }
        }

        private void SetBuildingModels(Dictionary<int, List<GltfModel>> dicIndoorModels, Dictionary<int, Model.Gltf.Model> dicModels, Dictionary<int, GltfModel> dicBuildingGroupModels, Dictionary<int, GltfModel> dicBuildingModels)
        {
            foreach (KeyValuePair<int, List<GltfModel>> pair in dicIndoorModels)
            {
                int gltfModelNo = pair.Key;

                foreach (GltfModel indoorModel in pair.Value)
                {
                    if (indoorModel.BuildingNo != null)
                    {
                        Model.Gltf.Model parentModel, model;

                        if (dicModels.TryGetValue(gltfModelNo, out model))
                        {
                            if (model.parnts_sn != null && dicModels.TryGetValue((int)model.parnts_sn, out parentModel))
                            {
                                GltfModel buildingGroupModel;

                                if (dicBuildingGroupModels.TryGetValue(parentModel.gltf_model_sn, out buildingGroupModel))
                                {
                                    buildingGroupModel.Children.Add(indoorModel);
                                    dicBuildingModels[gltfModelNo] = indoorModel;
                                }
                            }
                        }
                    }
                }
            }
        }

        private void SetBuildingGroupModels(IEnumerable<Model.Gltf.Model> models, Dictionary<int, List<GltfModel>> dicIndoorModels, Dictionary<string, GltfModels> dicSiteModels, Dictionary<int, GltfModel> dicBuildingGroupModels)
        {
            foreach (var model in models)
            {
                if (model.parnts_sn != null)
                {
                    List<GltfModel> indoorModels;

                    if (dicIndoorModels.TryGetValue(model.gltf_model_sn, out indoorModels))
                    {
                        GltfModels gltfModels;
                        string strSiteNo = model.site_sn.ToString();

                        if (dicSiteModels.TryGetValue(strSiteNo, out gltfModels))
                        {
                            foreach (GltfModel indoorModel in indoorModels)
                            {
                                if (indoorModel.BuildingGroupNo != null)
                                {
                                    gltfModels.IndoorModels.Add(indoorModel);
                                    dicBuildingGroupModels[model.gltf_model_sn] = indoorModel;
                                }
                            }
                        }
                    }
                }
            }
        }

        // dicGltfModelNos.Value : 첫번째 요소(modelDataNo), 두번재 요소(modelOrthoDataNo)
        private Dictionary<int, List<GltfModel>> GetIndoorModels(IEnumerable<Model.Gltf.ModelData> modelDatas, IEnumerable<Model.Gltf.ModelOrthoData> modelOrthoDatas, Dictionary<GltfModel, ArrayList> dicGltfModelNos)
        {
            List<GltfModel> models = null;
            Dictionary<int, List<GltfModel>> dicModels = new Dictionary<int, List<GltfModel>>();

            foreach (var modelData in modelDatas)
            {
                if (modelData.buld_group_sn == null && modelData.buld_sn == null && modelData.zone_sn == null)
                    continue;

                if (dicModels.TryGetValue(modelData.gltf_model_sn, out models) == false)
                {
                    models = new List<GltfModel>();
                    dicModels[modelData.gltf_model_sn] = models;
                }

                GltfModel model = ToGltfModel(modelData);
                models.Add(model);

                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(modelData.gltf_model_data_sn);

                dicGltfModelNos[model] = arrDatas;
            }

            foreach (var modelOrthoData in modelOrthoDatas)
            {
                if (modelOrthoData.zone_sn != null)
                {
                    if (dicModels.TryGetValue(modelOrthoData.gltf_model_sn, out models))
                    {
                        GltfModel model = FindZoneModel(models, (int)modelOrthoData.zone_sn);

                        if (model != null)
                        {
                            if (model.File != null && model.File.Length > 0)
                                model.CameraOrtho = ToCameraOrthoData(modelOrthoData);

                            ArrayList arrDatas;

                            if (dicGltfModelNos.TryGetValue(model, out arrDatas))
                            {
                                arrDatas.Add(modelOrthoData.gltf_model_ortho_data_sn);
                            }
                        }
                    }
                }
            }

            foreach (KeyValuePair<int, List<GltfModel>> pair in dicModels)
            {
                pair.Value.Sort();
            }

            return dicModels;
        }

        private GltfModel FindZoneModel(List<GltfModel> models, int zoneNo)
        {
            foreach (GltfModel model in models)
            {
                if (model.ZoneNo == zoneNo)
                    return model;
            }

            return null;
        }

        private GltfModel GetOutdoorModel(int gltfModelNo, IEnumerable<Model.Gltf.ModelData> modelDatas, IEnumerable<Model.Gltf.ModelOrthoData> modelOrthoDatas, out int modelDataNo, out int modelOrthoDataNo)
        {
            modelDataNo = modelOrthoDataNo = -1;
            GltfModel gltfModel = new GltfModel();

            foreach (var modelData in modelDatas)
            {
                if (modelData.gltf_model_sn == gltfModelNo)
                {
                    gltfModel.File = modelData.model_file;

                    if (gltfModel.File != null && gltfModel.File.Length > 0)
                        gltfModel.Camera = ToCameraData(modelData);

                    modelDataNo = modelData.gltf_model_data_sn;
                    break;
                }
            }

            if (gltfModel.File == null || gltfModel.File.Length == 0)
                return gltfModel;

            foreach (var modelOrthoData in modelOrthoDatas)
            {
                if (modelOrthoData.gltf_model_sn == gltfModelNo)
                {
                    if (gltfModel.File != null && gltfModel.File.Length > 0)
                        gltfModel.CameraOrtho = ToCameraOrthoData(modelOrthoData);

                    modelOrthoDataNo = modelOrthoData.gltf_model_ortho_data_sn;
                    break;
                }
            }

            return gltfModel;
        }

        private GltfModel ToGltfModel(Model.Gltf.ModelData modelData)
        {
            GltfModel gltfModel = new GltfModel();

            gltfModel.File = modelData.model_file;
            gltfModel.BuildingGroupNo = modelData.buld_group_sn;
            gltfModel.BuildingNo = modelData.buld_sn;
            gltfModel.ZoneNo = modelData.zone_sn;
            gltfModel.FloorIndex = modelData.floor_indx;

            if (gltfModel.File != null && gltfModel.File.Length > 0)
                gltfModel.Camera = ToCameraData(modelData);

            return gltfModel;
        }

        private CameraOrthoData ToCameraOrthoData(Model.Gltf.ModelOrthoData modelData)
        {
            CameraOrthoData camera = new CameraOrthoData();

            camera.Zoom = modelData.zoom;

            camera.Position[0] = modelData.camera_lc_x;
            camera.Position[1] = modelData.camera_lc_y;
            camera.Position[2] = modelData.camera_lc_z;

            camera.Rotation[0] = modelData.camera_rtate_x;
            camera.Rotation[1] = modelData.camera_rtate_y;
            camera.Rotation[2] = modelData.camera_rtate_z;

            camera.TargetControl[0] = modelData.trgt_x;
            camera.TargetControl[1] = modelData.trgt_y;
            camera.TargetControl[2] = modelData.trgt_z;

            return camera;
        }

        private CameraData ToCameraData(Model.Gltf.ModelData modelData)
        {
            CameraData camera = new CameraData();

            camera.Far = modelData.far;
            camera.Fov = modelData.fov;
            camera.Near = modelData.near;

            camera.Position[0] = modelData.camera_lc_x;
            camera.Position[1] = modelData.camera_lc_y;
            camera.Position[2] = modelData.camera_lc_z;

            camera.Rotation[0] = modelData.camera_rtate_x;
            camera.Rotation[1] = modelData.camera_rtate_y;
            camera.Rotation[2] = modelData.camera_rtate_z;

            camera.Orbit[0] = modelData.orbit_x;
            camera.Orbit[1] = modelData.orbit_y;
            camera.Orbit[2] = modelData.orbit_z;

            return camera;
        }
    }
}
