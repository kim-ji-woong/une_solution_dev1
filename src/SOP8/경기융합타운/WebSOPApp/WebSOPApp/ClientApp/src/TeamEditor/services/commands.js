import SessionString from '../../Common/js/sessionString';
import { TeamEditController } from './teamEditController';



export default class Commands {

    

    static async GetCommands() {
        const allCommands = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commands));
        return allCommands;
    }

    static async AddCommands(command) {
        let commandIndex = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandIndex));
        if (commandIndex === null) {
            commandIndex = -1;
            window.sessionStorage.setItem(SessionString.Key.commandIndex, JSON.stringify(commandIndex));
        }

        // 쌓아놓은 모든 Command 가져와서 배열로 만들기
        const allCommands = [];
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commands));
        if (history !== null) {
            for (let i = 0; i < history.length; i++) {
                allCommands.push(history[i]);
            }
        }
        
        let commandIndexTemp = commandIndex + 1;
        if (commandIndexTemp >= 0 && commandIndexTemp < allCommands.length) {
            // 덮어쓰기
            allCommands.splice(commandIndexTemp, allCommands.length - commandIndexTemp);
        }

        allCommands.push(command);
        commandIndex = allCommands.length - 1;

        window.sessionStorage.setItem(SessionString.Key.commands, JSON.stringify(allCommands));
        window.sessionStorage.setItem(SessionString.Key.commandIndex, JSON.stringify(commandIndex));
        return allCommands;
    }

    static async DoAddRegularTeam(cmd) {
        const nodeData = { ID: cmd.ID, Name: cmd.Name, ParentTeamID: cmd.Parent.ID };

        // 하위 팀 넣기
        if (cmd.Children) {
            if (!nodeData.Children)
                nodeData.Children = cmd.Children;
        }

        const findNode = await TeamEditController.findParent(nodeData.ParentTeamID, cmd.Data);
        if (!findNode.Children)
            findNode.Children = [];
        findNode.Children.push(nodeData);

        // 추가된 노드가 포함된 조직 정보 세션에 저장
        window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));

        // 삭제된 멤버 추가된 정보 세션에 저장
        if (cmd.DeleteMembers) {
            let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
            for (let i = 0; i < cmd.DeleteMembers.length; i++) {
                sessionmembers.push(cmd.DeleteMembers[i]);  
            }

            window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));
        }

        return cmd.Data;
    }

    static async DoChangeRegularMemberInfo(cmd) {
        let members = cmd.Data;
        if (cmd.InfoType === 'New') {
            cmd.Data.push({
                ID: cmd.ID,
                RegularID: cmd.RegularID,
                MemberName: cmd.MemberName,
                MemberID: cmd.MemberID,
                OfficePhoneNumber: cmd.OfficePhoneNumber,
                PhoneNumber: cmd.PhoneNumber,
                JobLevelID: cmd.JobLevelID,
                JobPositionID: cmd.JobPositionID
            });
        }

        let targetMember = null; 
        for (let i = 0; i < members.length; i++) {
            if (members[i].ID === cmd.ID) {

                targetMember = members[i];

                if (cmd.InfoType === 'MemberName') {
                    members[i].MemberName = cmd.ChgData;
                    cmd.MemberName = cmd.ChgData;
                }
                else if (cmd.InfoType === 'MemberID') {
                    members[i].MemberID = cmd.ChgData;
                    cmd.MemberID = cmd.ChgData;
                }
                else if (cmd.InfoType === 'OfficePhoneNumber') {
                    members[i].OfficePhoneNumber = cmd.ChgData;
                    cmd.OfficePhoneNumber = cmd.ChgData;
                }
                else if (cmd.InfoType === 'PhoneNumber') {
                    members[i].PhoneNumber = cmd.ChgData;
                    cmd.PhoneNumber = cmd.ChgData;
                }
                else if (cmd.InfoType === 'JobLevelID') {
                    members[i].JobLevelID = cmd.ChgData;
                    cmd.JobLevelID = cmd.ChgData;
                }
                else if (cmd.InfoType === 'JobPositionID') {
                    members[i].JobPositionID = cmd.ChgData;
                    cmd.JobPositionID = cmd.ChgData;
                } 
                break;
            }
        }

        let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
        if (cmd.InfoType === 'New') {
            sessionmembers.push(targetMember);
        }
        else {
            for (let i = 0; i < sessionmembers.length; i++) {
                if (sessionmembers[i].ID === cmd.ID) {
                    sessionmembers[i] = targetMember;
                    break;
                }
            }
        }
        window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));

        return members;
    }

    static async DoRemoveRegularMember(cmd) {     
        const members = cmd.Data;
        for (let i = 0; i < members.length; i++) {
            if (members[i].ID === cmd.ID) {
                members.splice(i, 1);
                break;
            }
        }

        let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
        
        for (let i = 0; i < sessionmembers.length; i++) {
            if (sessionmembers[i].ID === cmd.ID) {
                sessionmembers.splice(i, 1);
                break;
            }
        }
        window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));

        return members;
    }

    static async DoRemoveRegularTeam(cmd) {
        const nodeData = { ID: cmd.ID, Name: cmd.Name, ParentTeamID: cmd.Parent };

        const findNode = await TeamEditController.findParent(nodeData.ParentTeamID, cmd.Data);
        if (findNode.Children && findNode.Children !== null) {
            const idx = findNode.Children.findIndex(function (item) { return item.ID === nodeData.ID })
            if (idx > -1)
                findNode.Children.splice(idx, 1);
        }

        // 노드가 삭제된 조직 정보 세션에 저장
        window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));
        // 멤버 삭제된 정보 세션에 저장
        if (cmd.DeleteMembers) {
            let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
            for (let i = 0; i < cmd.DeleteMembers.length; i++) {

                const idx = sessionmembers.findIndex(function (item) { return item.ID === cmd.DeleteMembers[i].ID })
                if (idx > -1)
                    sessionmembers.splice(idx, 1);
            }
            
            window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));
        }

        return cmd.Data;
    }

    static async DoChangeRegularTeamInfo(cmd) {        
        const findNode = await TeamEditController.findNode(cmd.Data[0], cmd.ID);
        findNode.Name = cmd.NewData;
        
        window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));
        return cmd.Data
    }
    
    static async RollbackChangeRegularMemberInfo(cmd) {
        let members = cmd.Data;
        let targetMember = null;
        for (let i = 0; i < members.length; i++) {
            if (members[i].ID === cmd.ID) {

                targetMember = members[i];

                if (cmd.InfoType === 'MemberName') {
                    members[i].MemberName = cmd.OrgData;
                }
                else if (cmd.InfoType === 'MemberID') {
                    members[i].MemberID = cmd.OrgData;
                }
                else if (cmd.InfoType === 'OfficePhoneNumber') {
                    members[i].OfficePhoneNumber = cmd.OrgData;
                }
                else if (cmd.InfoType === 'PhoneNumber') {
                    members[i].PhoneNumber = cmd.OrgData;
                }
                else if (cmd.InfoType === 'JobLevelID') {
                    members[i].JobLevelID = cmd.OrgData;
                }
                else if (cmd.InfoType === 'JobPositionID') {
                    members[i].JobPositionID = cmd.OrgData;
                }
                else if (cmd.InfoType === 'New') {
                    members.splice(i, 1);
                }
                break;
            }
        }

        let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
        if (cmd.InfoType === 'New') {
            const idx = sessionmembers.findIndex(function (item) { return item.ID === targetMember.ID })
            if (idx > -1)
                sessionmembers.splice(idx, 1);
        }
        else {
            for (let i = 0; i < sessionmembers.length; i++) {
                if (sessionmembers[i].ID === cmd.ID) {
                    sessionmembers[i] = targetMember;
                    break;
                }
            }
        }
        window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));

        return members;
    }

    static async RollbackRemoveRegularMember(cmd) {
        let members = cmd.Data;
        members.push(cmd.Member);

        let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
        sessionmembers.push(cmd.Member);
        window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));

        return members;
    }

    static async RollbackChangeRegularTeamInfo(cmd) {
        const findNode = await TeamEditController.findNode(cmd.Data[0], cmd.ID);
        findNode.Name = cmd.OrgData;

        window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));
        return cmd.Data
    }

    static async Undo() {
        let commandIndex = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandIndex));
        
        const allCommands = [];
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commands));
        if (history !== null) {
            for (let i = 0; i < history.length; i++) {
                allCommands.push(history[i]);
            }
        }

        if (commandIndex < 0 || commandIndex >= allCommands.length)
            return null;

        const returnValue = [];
        
        const cmd = allCommands[commandIndex];
        returnValue.push(cmd.Key);

        commandIndex = commandIndex - 1;
        window.sessionStorage.setItem(SessionString.Key.commandIndex, JSON.stringify(commandIndex));

        if (cmd.Key === "AddRegularTeam") {
            await this.DoRemoveRegularTeam(cmd);
            returnValue.push(cmd.Data);
        }
        else if (cmd.Key === "RemoveRegularTeam") {
            const teamTreeData = await this.DoAddRegularTeam(cmd);
            returnValue.push(teamTreeData);
        }
        else if (cmd.Key === "ChangeRegularTeamInfo") {
            const teamTreeData = await this.RollbackChangeRegularTeamInfo(cmd);
            returnValue.push(teamTreeData);
        }
        else if (cmd.Key === "ChangeRegularMemberInfo") {
            await this.RollbackChangeRegularMemberInfo(cmd);
            returnValue.push(cmd.Data);
        }  
        else if (cmd.Key === "RemoveRegularMember") {
            await this.RollbackRemoveRegularMember(cmd);
            returnValue.push(cmd.Data);
        }  

        window.sessionStorage.setItem(SessionString.Key.commands, JSON.stringify(allCommands));
        return returnValue;
    }

    static async Redo() {
        let commandIndex = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandIndex));

        const allCommands = [];
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commands));
        if (history !== null) {
            for (let i = 0; i < history.length; i++) {
                allCommands.push(history[i]);
            }
        }

        let commandIndexTemp = commandIndex + 1;
        if (commandIndexTemp < 0 || commandIndexTemp >= allCommands.length)
            return null;

        const returnValue = [];

        const cmd = allCommands[commandIndexTemp];
        returnValue.push(cmd.Key);

        commandIndex = commandIndex + 1;
        window.sessionStorage.setItem(SessionString.Key.commandIndex, JSON.stringify(commandIndex));

        if (cmd.Key === "AddRegularTeam") {
            const teamTreeData = await this.DoAddRegularTeam(cmd);
            returnValue.push(teamTreeData);
        }
        else if (cmd.Key === "RemoveRegularTeam") {
            await this.DoRemoveRegularTeam(cmd);
            returnValue.push(cmd.Data);
        }
        else if (cmd.Key === "ChangeRegularTeamInfo") {
            await this.DoChangeRegularTeamInfo(cmd);
            returnValue.push(cmd.Data);
        }
        else if (cmd.Key === "ChangeRegularMemberInfo") {
            const members = await this.DoChangeRegularMemberInfo(cmd);
            returnValue.push(members);
        }
        else if (cmd.Key === "RemoveRegularMember") {
            await this.DoRemoveRegularMember(cmd);
            returnValue.push(cmd.Data);
        } 

        window.sessionStorage.setItem(SessionString.Key.commands, JSON.stringify(allCommands));
        return returnValue;
    }

    static async Save() {
        let commandIndex = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandIndex));
        let commandSaveIndex = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandSaveIndex));
        if (commandSaveIndex === null) {
            commandSaveIndex = -1;
            window.sessionStorage.setItem(SessionString.Key.commandSaveIndex, JSON.stringify(commandSaveIndex));
        }

        const allCommands = [];
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commands));
        if (history !== null) {
            for (let i = 0; i < history.length; i++) {
                allCommands.push(history[i]);
            }
        }

        const returnValue = [];

        if (commandSaveIndex < commandIndex) {
            // Redo
            for (let i = commandSaveIndex + 1; i <= commandIndex; i++) {
                const cmd = allCommands[i];
                if (cmd.Key === "AddRegularTeam") {
                    const orgRegularID = cmd.ID;
                    await TeamEditController.saveAddRegularTeam(true, cmd);
                    const newRegularID = cmd.ID;
                    
                    // DB에 저장된 정보로 업데이트한다
                    window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));

                    returnValue.push({ needSelectedTeamRefresh: true, OrgRegularID: orgRegularID, NewRegularID: newRegularID });

                    // 팀 추가 Command인데 이 후 Command에 이 팀에 속한 멤버의 정보 수정 Command가 있다면 DB에 업데이트된 TeamID로 변경해준다
                    // 안하면 -ID로 남아있어서 업데이트 되지 않음
                    for (let k = i + 1; k <= commandIndex; k++) {
                        const cmd2 = allCommands[k];
                        let regularID = -1;
                        if (cmd2.Key === 'ChangeRegularMemberInfo') {
                            regularID = cmd2.RegularID;
                        }
                        else if (cmd2.Key === 'ChangeRegularTeamInfo' || cmd2.Key === 'RemoveRegularTeam') {
                            regularID = cmd2.ID;
                        }
                        else {
                            break;
                        }

                        if (regularID !== orgRegularID)
                            continue;

                        if (cmd2.Key === 'ChangeRegularTeamInfo') {                            
                            const findNode = TeamEditController.findNode(cmd2.Data[0], cmd2.ID);
                            if (findNode !== null) {
                                findNode.ID = newRegularID;
                            }
                            cmd2.ID = newRegularID;
                        }
                        else if (cmd2.Key === 'ChangeRegularMemberInfo') { // 정보 수정한 Command 인가?                                                        
                            for (let kk = 0; kk < cmd2.Data.length; kk++) {
                                if (cmd2.Data[kk].RegularID === orgRegularID) {
                                    cmd2.Data[kk].RegularID = newRegularID;                                        
                                    break;
                                }
                            }
                            cmd2.RegularID = newRegularID;
                        }
                        else if (cmd2.Key === 'RemoveRegularTeam') {                            
                            for (let kk = 0; kk < cmd2.DeleteTeams.length; kk++) {
                                if (cmd2.DeleteTeams[kk].ID === orgRegularID) {
                                    cmd2.DeleteTeams[kk].ID = newRegularID;
                                    break;
                                }
                            }
                            cmd2.ID = newRegularID;
                        }
                    }
                    
                }
                else if (cmd.Key === "RemoveRegularTeam") {
                    await TeamEditController.saveRemoveRegularTeam(true, cmd);
                }
                else if (cmd.Key === "ChangeRegularTeamInfo") {
                    await TeamEditController.saveChangeRegularTeamInfo(true, cmd);

                    // DB에 저장된 정보로 업데이트한다
                    window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));
                }
                else if (cmd.Key === "ChangeRegularMemberInfo") {
                    await TeamEditController.saveChangeRegularMemeberInfo(true, cmd);
                    
                    if (cmd.InfoType === 'New') {
                        // DB에 저장된 ID로 업데이트한다                        
                        let sessionmembers = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
                        for (let j = 0; j < sessionmembers.length; j++) {
                            if (sessionmembers[j].ID === cmd.OrgData) {
                                sessionmembers[j].ID = cmd.ChgData; // DB에 저장된 ID가 입력되어 있음
                                sessionmembers[j].RegularID = cmd.RegularID; // 새로 추가된 팀이면 -ID로 저장되어 있는거 업데이트
                                break;
                            }
                        }

                        // 멤버 추가 Command인데 이 후 Command에 이 멤버의 정보 수정 Command가 있다면 DB에 업데이트된 ID로 변경해준다
                        // 안하면 -ID로 남아있어서 업데이트 되지 않음
                        for (let k = i + 1; k <= commandIndex; k++) {
                            const cmd2 = allCommands[k];
                            if (cmd2.InfoType !== 'New' && cmd2.Key === 'ChangeRegularMemberInfo') { // 정보 수정한 Command 인가?
                                if (cmd2.ID === cmd.OrgData) {
                                    for (let kk = 0; kk < cmd2.Data.length; kk++) {
                                        if (cmd2.Data[kk].ID === cmd.OrgData) {
                                            cmd2.Data[kk].ID = cmd.ChgData;
                                            cmd2.ID = cmd.ChgData;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        window.sessionStorage.setItem(SessionString.Key.regularMember, JSON.stringify(sessionmembers));
                    }                    
                }
                else if (cmd.Key === "RemoveRegularMember") {
                    await TeamEditController.saveRemoveRegularMemeber(true, cmd);
                }
            }
        }
        else {
            // Undo
            for (let i = commandSaveIndex; i > commandIndex; i--) {
                const cmd = allCommands[i];
                if (cmd.Key === "AddRegularTeam") {
                    await TeamEditController.saveAddRegularTeam(false, cmd);
                    window.sessionStorage.setItem(SessionString.Key.regularTeam, JSON.stringify(cmd.Data));
                }
                else if (cmd.Key === "RemoveRegularTeam") {
                    await TeamEditController.saveRemoveRegularTeam(false, cmd);
                }
                else if (cmd.Key === "ChangeRegularTeamInfo") {
                    await TeamEditController.saveChangeRegularTeamInfo(false, cmd);
                }
                else if (cmd.Key === "ChangeRegularMemberInfo") {
                    await TeamEditController.saveChangeRegularMemeberInfo(false, cmd);
                }
                else if (cmd.Key === "RemoveRegularMember") {
                    await TeamEditController.saveRemoveRegularMemeber(false, cmd);
                }
            }
        }

        commandSaveIndex = commandIndex;
        window.sessionStorage.setItem(SessionString.Key.commandSaveIndex, JSON.stringify(commandSaveIndex));
        window.sessionStorage.setItem(SessionString.Key.commands, JSON.stringify(allCommands));

        return returnValue;
    }

    // (Team) 새로 DB에 추가된 ID 가져오기
    static async GetHistoryTeamID(orgID) {
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandHistoryChangeTeamID));
        if (history === null)
            return null;

        for (let i = 0; i < history.length; i++) {
            if (orgID === history[i].orgID) {
                return history[i].chgID;
            }
        }

        return null;
    }

    // (Team) DB에 추가된 ID 입력하기
    static async SetHistroyTeamID(orgID, chgID) {
        const allHistories = [];
        const sessionHistories = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandHistoryChangeTeamID));
        if (sessionHistories !== null) {            
            for (let i = 0; i < sessionHistories.length; i++) {
                allHistories.push(sessionHistories[i]);
            }
        }

        allHistories.push({ orgID: orgID, chgID: chgID });

        window.sessionStorage.setItem(SessionString.Key.commandHistoryChangeTeamID, JSON.stringify(allHistories));
    }

    // (Member) 새로 DB에 추가된 ID 가져오기
    static async GetHistoryMemberID(orgID) {
        const history = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandHistoryChangeMemberID));
        if (history === null)
            return null;

        for (let i = 0; i < history.length; i++) {
            if (orgID === history[i].orgID) {
                return history[i].chgID;
            }
        }

        return null;
    }

    // (Member) DB에 추가된 ID 입력하기
    static async SetHistroyMemberID(orgID, chgID) {
        const allHistories = [];
        const sessionHistories = JSON.parse(window.sessionStorage.getItem(SessionString.Key.commandHistoryChangeMemberID));
        if (sessionHistories !== null) {
            for (let i = 0; i < sessionHistories.length; i++) {
                allHistories.push(sessionHistories[i]);
            }
        }

        allHistories.push({ orgID: orgID, chgID: chgID });

        window.sessionStorage.setItem(SessionString.Key.commandHistoryChangeMemberID, JSON.stringify(allHistories));
    }
}