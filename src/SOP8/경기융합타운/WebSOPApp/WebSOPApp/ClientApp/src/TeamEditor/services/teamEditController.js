import Commands from "./commands";

export class TeamEditController {

    static async requestTemporaryMembers() {
        try {
            const res = await fetch('TeamEditor/TeamEdit/RequestTemporaryMembers', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.temporaryMemberInfos, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestTemporaryMembers 실패"];
    }

    static async DisplayRegular() {
        try {
            const response = await fetch('TeamEditor/TeamEdit/DisplayRegular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ SiteNo: null })
            });
            const datas = await response.json();
            const jsonData = this.convertToTree(datas);

            return jsonData;
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplayBasicRegular() {
        try {
            const response = await fetch('TeamEditor/TeamEdit/DisplayRegular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ SiteNo: null })
            });
            const datas = await response.json();

            return datas;
        } catch (e) {
            console.log(e);
        }
    }
	
	static async DisplayTemporary(isNormal) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/DisplayTemporary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({IsNormal: isNormal })
            });
            const datas = await response.json();
            const jsonData = this.convertToTree(datas);

            return jsonData;
        } catch (e) {
            console.log(e);
        }
    }

    static convertToTree(datas) {
        // 데이터가 부모부터 자식 순으로 순서대로 구성되어 있지 않을 경우가 있어 로직 수정     2021.12.01 dr.kim

        const tree = this.getRootNodeList(datas);

        if (tree?.length > 0) {
            for (let rootNode of tree) {
                rootNode.Children = this.getChildNode(rootNode, datas);
            }
        }

        return tree;
    }

    static getChildNode(parentNode, datas) {
        if (parentNode === null || parentNode === undefined ||
            datas === null || datas === undefined)
            return [];

        let children = [];

        for (const data of datas) {
            // 확인된 노드는 건너띔
            if (data.chk === true)
                continue;

            if (parentNode.ID === data.parentTeamID) {
                // 확인한 노드 체크
                data.chk = true;

                const nodeData = {
                    ID: data.id, TeamName: data.teamName, ParentTeam: parentNode, ParentTeamID: data.parentTeamID
                };

                children.push(nodeData);

                nodeData.Children = this.getChildNode(nodeData, datas);
            }
        }

        return children;
    }

    static getChildTeams(team, childTeams) {
        if (!team) {
            return null;
        }

        if (team.visible === undefined || team.visible) {
            childTeams.push(team);

            const teamCount = team.Children.length;
            for (let i = 0; i < teamCount; i++) {
                const childTeam = team.Children[i];
                if (childTeam.visible === undefined || childTeam.visible) {
                    childTeams.push(childTeam);

                    if (childTeam.Children) {
                        const childTeamCount = childTeam.Children.length;
                        for (let j = 0; j < childTeamCount; j++) {
                            TeamEditController.getChildTeams(childTeam.Children[j], childTeams);
                        }
                    }
                }
            }
        }
    }

    static getRootNode(datas) {
        let rootNode = null;

        for (const data of datas) {

            if (data.parentTeamID === null) {
                const nodeData = {
                    ID: data.id, TeamName: data.teamName, ParentTeam: null, ParentTeamID: data.parentTeamID
                };
                rootNode = nodeData;

                // 확인한 노드 체크
                data.chk = true;
                break;
            }
        }

        return rootNode;
    }

    static getRootNodeList(datas) {
        let rootNodeList = [];

        for (const data of datas) {

            if (data.parentTeamID === null) {
                const nodeData = {
                    ID: data.id, TeamName: data.teamName, ParentTeam: null, ParentTeamID: data.parentTeamID
                };

                rootNodeList.push(nodeData);

                // 확인한 노드 체크
                data.chk = true;
            }
        }

        return rootNodeList;
    }
    

    static findParent(current, nodes) {
        for (const node of nodes) {
            if (current === node.ID) {
                return node;
            }
            if (node.Children) { // 자식노드들에서도 검색
                const parent = this.findParent(current, node.Children);
                if (parent) {
                    return parent;
                }
            }

        }
        return null;
    }

    /*
    static findNode(srcNode, targetID) {

        if (srcNode.ID === targetID) {
            return srcNode;
        }

        if (srcNode.Children) { // 자식노드들에서도 검색
            for (var i = 0; i < srcNode.Children.length; i++) {
                const childNode = this.findNode(srcNode.Children[i], targetID);
                if (childNode) {
                    return childNode;
                }
            }
        }

        return null;
    }
    */
    static findNode(srcNodeList, targetID) {

        for (let srcNode of srcNodeList) {
            if (srcNode.ID === targetID) {
                return srcNode;
            }

            if (srcNode.Children) { // 자식노드들에서도 검색
                /*
                for (var i = 0; i < srcNode.Children.length; i++) {
                    const childNode = this.findNode(srcNode.Children, targetID);
                    if (childNode) {
                        return childNode;
                    }
                }
                */
                const childNode = this.findNode(srcNode.Children, targetID);
                if (childNode) {
                    return childNode;
                }
            }
        }

        return null;
    }

    static async findChild(targetID, src, arr) {
        if (src.length === 0)
            return;

        for (var i = 0; i < src.length; i++) {
            if (targetID === src[i].ParentTeamID) {
                arr.push({ ID: src[i].ID, TeamName: src[i].TeamName, ParentTeamID: src[i].ParentTeamID });
            }
            if (src[i].Children)
                this.findChild(src[i].ID, src[i].Children, arr);
        }
    }

    static async DisplayRegularMember() {
        const response = await fetch('TeamEditor/TeamEdit/DisplayRegularMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ SiteNo: null })
        }); 

        if (response.ok) {
            const arrMembers = await response.text();
            return JSON.parse(arrMembers);
        }

        return null;
    }


    static async GetJobLevels() {
        const response = await fetch('TeamEditor/TeamEdit/GetJobLevels');
        if (response.ok) {
            const arrJobLevels = await response.text();
            return JSON.parse(arrJobLevels);
        }

        return null;
    }

    static async GetJobPositions() {
        const response = await fetch('TeamEditor/TeamEdit/GetJobPositions');
        if (response.ok) {
            const arrJobPositions = await response.text();
            return JSON.parse(arrJobPositions);
        }

        return null;
    }

    static async displayTemporaryMember(TemporaryID, isNormal) {
        if (TemporaryID == null || isNormal == null)
            return null;

        const response = await fetch('TeamEditor/TeamEdit/DisplayTemporaryMember', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ ID: TemporaryID, IsNormal: isNormal })
        });

        if (response.ok) {
            const arrMembers = await response.text();
            return JSON.parse(arrMembers);
        }

        return null;
    }

    static async saveAddRegularTeam(isRedo, cmd) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/SaveAddRegularTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    IsRedo: isRedo,
                    Key: cmd.Key,
                    ID: cmd.ID,
                    Name: cmd.Name,
                    ParentTeamID: cmd.Parent.ID
                })
            });

            if (response.ok) {                
                if (isRedo) {
                    const res = await response.json();
                    Commands.SetHistroyTeamID(cmd.ID, res.nNewID);
                    // Command에 기록된 ID를 DB에 저장된 ID로 업데이트한다
                    const findNode = await this.findParent(cmd.Parent.ID, cmd.Data);
                    for (var i = 0; i < findNode.Children.length; i++) {
                        if (findNode.Children[i].ID === cmd.ID) {
                            findNode.Children[i].ID = res.nNewID;
                            cmd.ID = res.nNewID;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async saveRemoveRegularTeam(isRedo, cmd) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/SaveRemoveRegularTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    IsRedo: isRedo,
                    Key: cmd.Key,
                    ID: cmd.ID,
                    DeleteTeams: cmd.DeleteTeams,
                    DeleteMembers: cmd.DeleteMembers
                })
            });

            if (response.ok) {
                
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async saveChangeRegularTeamInfo(isRedo, cmd) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/SaveChangeRegularTeamInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    IsRedo: isRedo,
                    Key: cmd.Key,
                    ID: cmd.ID,
                    NewData: cmd.NewData,
                    OrgData: cmd.OrgData
                })
            });

            if (response.ok) {
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async saveChangeRegularMemeberInfo(isRedo, cmd) {
        try {                                                                        
            const response = await fetch('TeamEditor/TeamEdit/SaveChangeRegularMemeberInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    IsRedo: isRedo,
                    Key: cmd.Key,
                    InfoType: cmd.InfoType,
                    OrgData: cmd.OrgData,
                    ChgData: cmd.ChgData,
                    ID: cmd.ID,
                    RegularID: cmd.RegularID,
                    MemberName: cmd.MemberName,
                    MemberID: cmd.MemberID,
                    OfficePhoneNumber: cmd.OfficePhoneNumber,
                    PhoneNumber: cmd.PhoneNumber,
                    JobLevelID: cmd.JobLevelID,
                    JobPositionID: cmd.JobPositionID
                })
            });

            if (response.ok) {
                const res = await response.json();
                
                if (cmd.InfoType === 'New') {
                    // 새로 추가된 직원의 DB ID를 넣는다.
                    // Command에 기록된 ID를 DB에 저장된 ID로 업데이트한다
                    for (var i = 0; i < cmd.Data.length; i++) {
                        if (cmd.Data[i].ID === cmd.ID) {
                            cmd.Data[i].ID = res.nNewID;
                            cmd.ChgData = res.nNewID;
                            cmd.ID = res.nNewID;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async saveRemoveRegularMemeber(isRedo, cmd) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/SaveRemoveRegularMemeber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    IsRedo: isRedo,
                    Key: cmd.Key,                    
                    ID: cmd.ID,
                    Member: cmd.Member
                })
            });

            if (response.ok) {
                
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 조직원 추가, 수정
    static async UpdateRegularMember(member) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/UpdateRegularMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    Member: member
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, result.newID, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }

            return [false, null, 'UpdateRegularMemeber 실패'];
        } catch (e) {
            return [false, null, e.message];
        }
    }

    // 조직원(들) 삭제
    static async RemoveRegularMembers(members) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/RemoveRegularMembers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    Members: members
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }

            return [false, 'RemoveRegularMembers 실패'];
        } catch (e) {
            return [false, e.message];
        }
    }

    // 비상조직원 추가, 수정
    static async UpdateTemporaryMember(member) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/UpdateTemporaryMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    TemporaryMemberInfo: member
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, result.newID, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }

            return [false, null, 'UpdateTemporaryMember 실패'];
        } catch (e) {
            return [false, null, e.message];
        }
    }

    // 비상조직원(들) 삭제
    static async RemoveTemporaryMembers(members) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/RemoveTemporaryMembers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    Members: members
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }

            return [false, 'RemoveTemporaryMembers 실패'];
        } catch (e) {
            return [false, e.message];
        }
    }

    // 정규조직 추가, 수정
    static async UpdateRegularTeam(regular) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/UpdateRegularTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    RegularTeam: regular
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, result.newID, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }

            return [false, null, 'UpdateRegular 실패'];
        } catch (e) {
            return [false, null, e.message];
        }
    }

    static async RemoveRegularTeams(teamIDs) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/RemoveRegularTeams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    TeamIDs: teamIDs
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }

            return [false, 'RemoveRegularTeams 실패'];
        } catch (e) {
            return [false, e.message];
        }
    }

    // 비상조직 추가, 수정
    static async UpdateTemporaryTeam(temporary) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/UpdateTemporaryTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    TemporaryTeam: temporary
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, result.newID, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }

            return [false, null, 'UpdateRegular 실패'];
        } catch (e) {
            return [false, null, e.message];
        }
    }

    static async RemoveTemporaryTeams(teamIDs) {
        try {
            const response = await fetch('TeamEditor/TeamEdit/RemoveTemporaryTeams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    TeamIDs: teamIDs
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }

            return [false, 'RemoveTemporaryTeams 실패'];
        } catch (e) {
            return [false, e.message];
        }
    }

    static async saveUpdateData(updateData) {

        if (updateData === null ||
            updateData.addRegular === null || updateData.addRegular === undefined ||
            updateData.updateRegular === null || updateData.updateRegular === undefined ||
            updateData.removeRegular === null || updateData.removeRegular === undefined ||
            updateData.addRegularMembers === null || updateData.addRegularMembers === undefined ||
            updateData.updateRegularMembers === null || updateData.updateRegularMembers === undefined ||
            updateData.removeRegularMembers === null || updateData.removeRegularMembers === undefined ||
            updateData.addTemporary === null || updateData.addTemporary === undefined ||
            updateData.updateTemporary === null || updateData.updateTemporary === undefined ||
            updateData.removeTemporary === null || updateData.removeTemporary === undefined ||
            updateData.addTemporaryEmergency === null || updateData.addTemporaryEmergency === undefined ||
            updateData.updateTemporaryEmergency === null || updateData.updateTemporaryEmergency === undefined ||
            updateData.removeTemporaryEmergency === null || updateData.removeTemporaryEmergency === undefined ||
            updateData.addTemporaryMembers === null || updateData.addTemporaryMembers === undefined ||
            updateData.updateTemporaryMembers === null || updateData.updateTemporaryMembers === undefined ||
            updateData.removeTemporaryMembers === null || updateData.removeTemporaryMembers === undefined)
            return [false, "제대로 된 데이터가 아닙니다."];

        try {
            const response = await fetch('TeamEditor/TeamEdit/SaveUpdateData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
            return [false, e];
        }

        return [false, "saveUpdateData 실패."];
    }
}