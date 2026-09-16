export default class JsonManager {
    static makeUpdateTemporaryTeam(temporary) {
        const json = {
            "temporaryTeam":
            {
                "tmpr_sn": temporary.No,
                "parnts_sn": temporary.ParentTeamNo,
                "team_name": temporary.TeamName,
                "nor_yn": temporary.IsNormal,
                "site_sn": temporary.site_sn
            }
        };

        return JSON.stringify(json);
    }

    static makeUpdateTemporaryMember(member) {
        const json = {
            "temporaryMemberInfo":
            {
                "memberNo": member.memberNo,
                "displaySOPName": JsonManager.getDisplaySOPName(member),
                "role": member.role,
                "regular": JsonManager.getRegular(member.regular),
                "regularMember": JsonManager.getRegularMember(member.regularMember),
                "temporary": JsonManager.getTemporary(member.temporary)
            }
        };

        return JSON.stringify(json);
    }

    static getDisplaySOPName(member) {
        if (member.displaySOPName) {
            return member.displaySOPName;
        }
        else if (member.regularMember) {
            return member.regularMember?.memberName;
        }

        return member.regular?.teamName;
    }

    static getTemporary(temporary) {
        if (!temporary) {
            return null;
        }

        const json = {
            "tmpr_sn": temporary.tmpr_sn,
            "parnts_sn": temporary.parnts_sn,
            "team_name": temporary.team_name,
            "nor_yn": temporary.nor_yn
        };

        return json;
    }

    static getRegular(regular) {
        if (!regular) {
            return null;
        }

        const json = {
            "rgl_sn": regular.rgl_sn,
            "team_name": regular.team_name,
            "parnts_sn": regular.parnts_sn
        };

        return json;
    }

    static getRegularMember(regularMember) {
        if (!regularMember) {
            return null;
        }

        const json = {
            "rgl_memb_sn": regularMember.rgl_memb_sn,
            "rgl_sn": regularMember.rgl_sn,
            "memb_name": regularMember.memb_name,
            "offm_telno": regularMember.offm_telno,
            "telno": regularMember.telno,
            "email": regularMember.email,
            "clsf_no": regularMember.clsf_no,
            "ofcps_no": regularMember.ofcps_no
        };

        return json;
    }

    static makeRemoveTemporaryMembers(members) {
        const datas = [];

        for (const member of members) {
            const data = JsonManager.getTemporaryMember(member);
            datas.push(data);
        }

        const json = {
            "members": datas
        };

        return JSON.stringify(json);
    }

    static getTemporaryMember(member) {
        const json = {
            "disp_name": member.displaySOPName,
            "rgl_memb_sn": member.regularMember?.rgl_memb_sn,
            "rgl_sn": member.regular ? member.regular.rgl_sn : member.regularMember?.rgl_sn,
            "role_no": member.role,
            "role_optn_no": null,
            "tmpr_memb_sn": member.memberNo,
            "tmpr_sn": member.temporary?.tmpr_sn
        };

        return json;
    }

    static makeRequestDownloadRegularTeam(siteNo) {
        const json = {
            "siteNo": siteNo
        };

        return JSON.stringify(json);
    }

    static makeDisplayRegularMember(siteNo, searchText, searchTeamName, searchJobLevel, searchJobPosition, searchUniqueKey, searchPhoneNumber, searchOfficePhoneNumber, searchEmail, searchJobStatus, searchMemo) {
        const json = {
            "site_sn": siteNo,
            "searchText": searchText,
            "searchTeamName": searchTeamName,
            "searchJobLevel": searchJobLevel,
            "searchJobPosition": searchJobPosition,
            "searchUniqueKey": searchUniqueKey,
            "searchPhoneNumber": searchPhoneNumber,
            "searchOfficePhoneNumber": searchOfficePhoneNumber,
            "searchEmail": searchEmail,
            "searchJobStatus": searchJobStatus,
            "searchMemo": searchMemo
        };

        return JSON.stringify(json);
    }

    static makeDisplayTemporaryMember(temporaryNo, isNormal, searchText, searchRegularTeamName, searchTemporaryTeamName, searchRegularMemberName, searchSopName, searchJobLevel, searchJobPosition, searchRole, searchTemporaryMemo) {
        const json = {
            "tmpr_sn": temporaryNo,
            "isNormal": isNormal,
            "searchText": searchText,
            "searchRegularTeamName": searchRegularTeamName,
            "searchTemporaryTeamName": searchTemporaryTeamName,
            "searchRegularMemberName": searchRegularMemberName,
            "searchSopName": searchSopName,
            "searchJobLevel": searchJobLevel,
            "searchJobPosition": searchJobPosition,
            "searchRole": searchRole,
            "searchTemporaryMemo": searchTemporaryMemo
        };

        return JSON.stringify(json);
    }
}
