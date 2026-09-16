import JsonManager from "./jsonManager";
import Commands from "./commands";
import HistoryController from "../../History/services/historyController";

export class TeamEditController {

    static async requestTemporaryMembers() {
        try {
            const res = await fetch('api/TeamEditor/RequestTemporaryMembers', {
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

    static async displayRegular() {
        try {
            const res = await fetch('api/TeamEditor/DisplayRegular', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ site_sn: null })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    const treeDatas = this.convertToTree(result.regulars);
                    return [treeDatas/*result.regulars*/, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "displayRegular 실패"];
    }

    static async displayBasicRegular() {
        try {
            const res = await fetch('api/TeamEditor/DisplayRegular', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ site_sn: null })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.regulars, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "displayBasicRegular 실패"];
    }
	
	static async displayTemporary(isNormal) {
        try {
            const res = await fetch('api/TeamEditor/DisplayTemporary', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({isNormal: isNormal })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    const treeDatas = this.convertToTree(result.temporaries);
                    return [treeDatas/*result.temporaries*/, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "displayTemporary 실패"];
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

            if (parentNode.No === data.parnts_sn) {
                // 확인한 노드 체크
                data.chk = true;

                let nodeData = {};

                if (data.rgl_sn) {
                    nodeData = {
                        No: data.rgl_sn, TeamName: data.team_name, ParentTeam: parentNode, ParentTeamNo: data.parnts_sn
                    };

                    children.push(nodeData);
                }
                else if (data.tmpr_sn) {
                    nodeData = {
                        No: data.tmpr_sn, TeamName: data.team_name, ParentTeam: parentNode, ParentTeamNo: data.parnts_sn
                    };

                    children.push(nodeData);
                }

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

            if (data.parnts_sn === null) {
                if (data.rgl_sn) {
                    const nodeData = {
                        No: data.rgl_sn, TeamName: data.team_name, ParentTeam: null, ParentTeamNo: data.parnts_sn
                    };
                    rootNode = nodeData;

                    // 확인한 노드 체크
                    data.chk = true;
                }
                else if (data.tmpr_sn) {
                    const nodeData = {
                        No: data.tmpr_sn, TeamName: data.team_name, ParentTeam: null, ParentTeamNo: data.parnts_sn
                    };
                    rootNode = nodeData;

                    // 확인한 노드 체크
                    data.chk = true;
                }

                break;
            }
        }

        return rootNode;
    }

    static getRootNodeList(datas) {
        let rootNodeList = [];

        for (const data of datas) {

            if (data.parnts_sn === null) {
                if (data.rgl_sn || data.rgl_sn === 0) {
                    const nodeData = {
                        No: data.rgl_sn, TeamName: data.team_name, ParentTeam: null, ParentTeamNo: data.parnts_sn
                    };

                    rootNodeList.push(nodeData);
                }
                else if (data.tmpr_sn) {
                    const nodeData = {
                        No: data.tmpr_sn, TeamName: data.team_name, ParentTeam: null, ParentTeamNo: data.parnts_sn
                    };

                    rootNodeList.push(nodeData);
                }

                // 확인한 노드 체크
                data.chk = true;
            }
        }

        return rootNodeList;
    }
    

    static findParent(current, nodes) {
        for (const node of nodes) {
            if (current === node.No) {
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
    static findNode(srcNodeList, targetNo) {

        for (let srcNode of srcNodeList) {
            if (srcNode.No === targetNo) {
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
                const childNode = this.findNode(srcNode.Children, targetNo);
                if (childNode) {
                    return childNode;
                }
            }
        }

        return null;
    }

    static async findChild(targetNo, src, arr) {
        if (src.length === 0)
            return;

        for (var i = 0; i < src.length; i++) {
            if (targetNo === src[i].ParentTeamNo) {
                arr.push({ No: src[i].No, TeamName: src[i].TeamName, ParentTeamNo: src[i].ParentTeamNo });
            }
            if (src[i].Children)
                this.findChild(src[i].ID, src[i].Children, arr);
        }
    }

    // searchJobLevel : 직급 검색 여부
    // searchJobPosition : 직위 검색 여부
    // searchJobStatus : 직무상태 검색 여부
    static async displayRegularMember(siteNo = null, searchText = null, searchTeamName = true, searchJobLevel = true, searchJobPosition = true, searchUniqueKey = true, searchPhoneNumber = true, searchOfficePhoneNumber = true, searchEmail = true, searchJobStatus = true, searchMemo = false) {
        try {
            const res = await fetch('api/TeamEditor/DisplayRegularMember', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeDisplayRegularMember(siteNo, searchText, searchTeamName, searchJobLevel, searchJobPosition, searchUniqueKey, searchPhoneNumber, searchOfficePhoneNumber, searchEmail, searchJobStatus, searchMemo)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.regularMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "displayRegularMember 실패"];
    }


    static async getJobLevels() {
        try {
            const res = await fetch('api/TeamEditor/GetJobLevels', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.options, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "getJobLevels 실패"];
    }

    static async getJobPositions() {
        try {
            const res = await fetch('api/TeamEditor/GetJobPositions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.options, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "getJobPositions 실패"];
    }

    static async displayTemporaryMember(temporaryNo, isNormal, searchText = null, searchRegularTeamName = true, searchTemporaryTeamName = true, searchRegularMemberName = true, searchSopName = true, searchJobLevel = true, searchJobPosition = true, searchRole = true, searchTemporaryMemo = false) {
        if (temporaryNo == null || isNormal == null)
            return null;

        try {
            const res = await fetch('api/TeamEditor/DisplayTemporaryMember', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JsonManager.makeDisplayTemporaryMember(temporaryNo, isNormal, searchText, searchRegularTeamName, searchTemporaryTeamName, searchRegularMemberName, searchSopName, searchJobLevel, searchJobPosition, searchRole, searchTemporaryMemo)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.temporaryMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "displayTemporaryMember 실패"];
    }

    // 조직원 추가, 수정
    static async updateRegularMember(member) {
        try {
            const res = await fetch('api/TeamEditor/UpdateRegularMember', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    member: member
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, result.newNo, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }

            return [false, null, 'updateRegularMemeber 실패'];
        } catch (e) {
            return [false, null, e.message];
        }

        return [null, "updateRegularMember 실패"];
    }

    // 조직원(들) 삭제
    static async removeRegularMembers(members) {
        try {
            const res = await fetch('api/TeamEditor/RemoveRegularMembers', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    members: members
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            return [false, e.message];
        }

        return [null, "removeRegularMembers 실패"];
    }

    // 비상조직원 추가, 수정
    static async updateTemporaryMember(member) {
        try {
            const jsonData = JsonManager.makeUpdateTemporaryMember(member);

            const res = await fetch('api/TeamEditor/UpdateTemporaryMember', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, result.newNo, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }
        } catch (e) {
            return [false, null, e.message];
        }

        return [false, null, 'updateTemporaryMember 실패'];
    }

    // 비상조직원(들) 삭제
    static async removeTemporaryMembers(members) {
        const jsonData = JsonManager.makeRemoveTemporaryMembers(members);

        try {
            const res = await fetch('api/TeamEditor/RemoveTemporaryMembers', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            return [false, e.message];
        }

        return [false, 'removeTemporaryMembers 실패'];
    }

    // 정규조직 추가, 수정
    static async updateRegularTeam(regular) {
        const regularTeam = { ...regular };
        regularTeam.rgl_sn = regularTeam.No;
        regularTeam.team_name = regularTeam.TeamName;
        regularTeam.parnts_sn = regularTeam.ParentTeamNo;

        try {
            const res = await fetch('api/TeamEditor/UpdateRegularTeam', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    regularTeam: regularTeam
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, result.newNo, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }
        } catch (e) {
            return [false, null, e.message];
        }

        return [false, null, 'updateRegularTeam 실패'];
    }

    static async removeRegularTeams(teamNos) {
        try {
            const res = await fetch('api/TeamEditor/RemoveRegularTeams', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamNos: teamNos
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            return [false, e.message];
        }

        return [false, 'removeRegularTeams 실패'];
    }

    // 비상조직 추가, 수정
    static async updateTemporaryTeam(temporary) {
        try {
            const jsonData = JsonManager.makeUpdateTemporaryTeam(temporary);

            const res = await fetch('api/TeamEditor/UpdateTemporaryTeam', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, result.newNo, ''];
                }
                else {
                    return [false, null, result.message];
                }
            }
        } catch (e) {
            return [false, null, e.message];
        }

        return [false, null, 'updateTemporaryTeam 실패'];
    }

    static async removeTemporaryTeams(teamNos) {
        try {
            const res = await fetch('api/TeamEditor/RemoveTemporaryTeams', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamNos: teamNos
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    return [true, ''];
                }
                else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            return [false, e.message];
        }

        return [false, 'removeTemporaryTeams 실패'];
    }

    static async saveUpdateData(updateData, site_sn) {

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
            updateData.addTemporaryMembers === null || updateData.addTemporaryMembers === undefined ||
            updateData.updateTemporaryMembers === null || updateData.updateTemporaryMembers === undefined ||
            updateData.removeTemporaryMembers === null || updateData.removeTemporaryMembers === undefined)
            return [false, "제대로 된 데이터가 아닙니다."];

        updateData.siteNo = site_sn;

        try {
            const res = await fetch('api/TeamEditor/SaveUpdateData', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                const result = await res.json();

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

    static async getTemporaryRoleList() {
        try {
            const res = await fetch('api/TeamEditor/GetTemporaryRoleList', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.roleDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e.message);
        }

        return [null, "getTemporaryRoleList 실패"];
    }

    // siteNo : null이면 전체
    static async downloadRegularTeam(siteNo = null) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeam(siteNo);

            const res = await fetch('api/TeamEditor/DownloadRegularTeam', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await HistoryController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "downloadRegularTeam 호출에 실패하였습니다."];
    }

    static async uploadRegularTeam(file, siteNo) {
        try {
            const formData = new FormData();

            const fileData = new File([], siteNo.toString());

            formData.append('file', file);
            formData.append('fileData', fileData);

            const res = await fetch('api/TeamEditor/UploadRegularTeam', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "uploadRegularTeam 호출에 실패하였습니다."];
    }
}