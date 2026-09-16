import Commands from "./commands";
import SessionString from '../../Common/js/sessionString';

export default class CommandStyle {
    // 조직 추가
    // data : 모든 팀 정보
    static async MakeCommandAddRegularTeam(id, name, parent, children, data) {        
        var cmd = {
            Key: 'AddRegularTeam',
            ID: id,
            Name: name,
            Parent: parent,
            Data: data
        };

        //if (children !== null && children.length > 0) {
        //    cmd.Children = [];
        //    cmd.Children = children;
        //}

        const returnData = await Commands.DoAddRegularTeam(cmd);
        await Commands.AddCommands(cmd);        
        return returnData;
    }

    // 조직 삭제
    // data : 모든 팀 정보
    static async MakeCommandRemoveRegularTeam(selectedTeam, data) {
        // 하위 팀
        const deleteTeams = [];
        deleteTeams.push({ ID: selectedTeam.ID, TeamName: selectedTeam.Name, ParentTeamID: selectedTeam.ParentTeamID });
        if (selectedTeam.Children) {
            this.findChild(selectedTeam.ID, selectedTeam.Children, deleteTeams);
        }

        // 속한 직원
        var members = JSON.parse(window.sessionStorage.getItem(SessionString.Key.regularMember));
        const deleteMembers = [];

        for (var i = 0; i < members.length; i++) {

            for (var j = 0; j < deleteTeams.length; j++) {
                if (deleteTeams[j].ID === members[i].RegularID) {
                    deleteMembers.push(members[i]);
                    break;
                }
            }
        }

        var cmd = {
            Key: 'RemoveRegularTeam',
            ID: selectedTeam.ID,
            Name: selectedTeam.Name,
            Parent: selectedTeam.ParentTeamID,
            Children: selectedTeam.Children,
            DeleteTeams: deleteTeams,
            DeleteMembers: deleteMembers,
            Data: data
        };

        const returnData = await Commands.DoRemoveRegularTeam(cmd);
        await Commands.AddCommands(cmd);
        return returnData;
    }

    static async findChild(targetID, src, arr) {
        if (src.length === 0)
            return;

        for (var i = 0; i < src.length; i++) {
            if (targetID === src[i].ParentTeamID) {
                arr.push({ ID: src[i].ID, TeamName: src[i].Name, ParentTeamID: src[i].ParentTeamID });
            }
            if (src[i].Children)
                this.findChild(src[i].ID, src[i].Children, arr);
        }
    }

    // 조직 이름 변경
    static async MakeCommandChangeRegularTeamInfo(selectedTeam, newData, data) {
        var cmd = {
            Key: 'ChangeRegularTeamInfo',
            ID: selectedTeam.ID,
            OrgData: selectedTeam.Name,
            NewData: newData,
            Data: data
        };

        const returnData = await Commands.DoChangeRegularTeamInfo(cmd);
        await Commands.AddCommands(cmd);
        return returnData;
    }

    // 조직 멤버 정보 추가,수정
    // data : 지금 변경된 직원이 속한 팀의 모든 직원 정보
    static async MakeCommandChangeRegularMemberInfo(infoType, member, chgData, data) {
        // 어떤 정보가 변경됐는지
        var orgData = '';
        if (infoType === 'MemberName')
            orgData = member.MemberName;
        else if (infoType === 'MemberID')
            orgData = member.MemberID;
        else if (infoType === 'OfficePhoneNumber')
            orgData = member.OfficePhoneNumber;
        else if (infoType === 'PhoneNumber')
            orgData = member.PhoneNumber;
        else if (infoType === 'JobLevelID')
            orgData = member.JobLevelID;
        else if (infoType === 'JobPositionID')
            orgData = member.JobPositionID;
        else if (infoType === 'New') {
            orgData = member.ID; // 새로 추가된 직원 OrgData에 -ID를 입력한다. 추후 ChgData에는 DB 저장된 +ID를 입력한다.
            //data.push(member);
        }

        var cmd = {
            Key: 'ChangeRegularMemberInfo',
            InfoType: infoType,
            OrgData: orgData,
            ChgData: chgData,
            ID: member.ID,
            RegularID: member.RegularID,
            MemberName: member.MemberName,
            MemberID: member.MemberID,
            OfficePhoneNumber: member.OfficePhoneNumber,
            PhoneNumber: member.PhoneNumber,
            JobLevelID: member.JobLevelID,
            JobPositionID: member.JobPositionID,
            Data: data
        };
                
        const returnData = await Commands.DoChangeRegularMemberInfo(cmd);
        await Commands.AddCommands(cmd);

        return returnData;
    }

    static async MakeCommandRemoveRegularMember(member, data) {        
        var cmd = {
            Key: 'RemoveRegularMember',
            ID: member.ID,
            Member: member,
            Data: data
        };

        const returnData = await Commands.DoRemoveRegularMember(cmd);
        await Commands.AddCommands(cmd);

        return returnData;
    }
}