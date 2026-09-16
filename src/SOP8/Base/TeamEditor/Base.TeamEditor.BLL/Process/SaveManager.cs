using System.Collections.Generic;
using Response;
using Base.TeamEditor.IBLL.Request;
using Base.Model.Common.Team;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil;

namespace Base.TeamEditor.BLL.Process
{
    class SaveManager
    {
        public static bool SaveUpdateData(IDataManager dataManager, RequestSaveUpdateData data, out string strErrorMessage)
        {
            Dictionary<int, int> dicChangeTeamNo = new Dictionary<int, int>();  // 새로 추가된 팀 ID 변경 정보 >> 새로 추가된 팀 멤버 추가 시에 사용 
            Dictionary<int, int> dicChangeTemporaryNo = new Dictionary<int, int>(); // 비상조직 팀 ID 변경 정보
            Dictionary<int, int> dicChangeRegularMemberNo = new Dictionary<int, int>();
            //Dictionary<int, int> dicChangeTemporaryMemberID = new Dictionary<int, int>();

            // 정규조직 팀 추가
            if (AddRegular(dataManager, data.AddRegular, dicChangeTeamNo, out strErrorMessage) == false)
                return false;

            // 비상조직 추가
            if (AddTemporary(dataManager, data.AddTemporary, data.SiteNo, dicChangeTemporaryNo, out strErrorMessage) == false)
                return false;

            // 정규조직 멤버 추가
            if (AddRegularMember(dataManager, data.AddRegularMembers, dicChangeTeamNo, dicChangeRegularMemberNo, out strErrorMessage) == false)
                return false;

            // 비상조직 멤버 추가
            if (AddTemporaryMember(dataManager, data.AddTemporaryMembers, dicChangeTeamNo, dicChangeTemporaryNo, dicChangeRegularMemberNo, out strErrorMessage) == false)
                return false;

            // 정규조직 수정
            if (dataManager.GetUpdate().Update<Regular>(data.UpdateRegular, out strErrorMessage) == false)
                return false;

            // 비상조직 수정
            foreach (Temporary temporary in data.UpdateTemporary)
            {
                temporary.site_sn = data.SiteNo;
            }

            if (dataManager.GetUpdate().Update<Temporary>(data.UpdateTemporary, out strErrorMessage) == false)
                return false;

            // 정규조직 멤버 수정
            foreach (RegularMember member in data.UpdateRegularMembers)
            {
                if (member.telno != null && member.telno.Length > 0)
                    member.telno = AES256Cipher.AES_encrypt(member.telno);
            }

            if (dataManager.GetUpdate().Update<RegularMember>(data.UpdateRegularMembers, out strErrorMessage) == false)
                return false;

            // 비상조직 멤버 수정
            if (UpdateTemporaryMember(dataManager, data.UpdateTemporaryMembers, dicChangeTeamNo, dicChangeTemporaryNo, dicChangeRegularMemberNo, out strErrorMessage) == false)
                return false;

            // 정규조직 멤버 삭제
            if (DeleteManager.RemoveRegularMember(dataManager, data.RemoveRegularMembers, out strErrorMessage) == false)
                return false;

            // 비상조직 멤버 삭제
            if (DeleteManager.RemoveTemporaryMembers(dataManager, data.RemoveTemporaryMembers, out strErrorMessage) == false)
                return false;

            // 정규조직 삭제
            List<int> removeRegularNos = new List<int>();

            foreach (Regular regular in data.RemoveRegular)
            {
                removeRegularNos.Add(regular.rgl_sn);
            }

            if (DeleteManager.RemoveRegular(dataManager, removeRegularNos, out strErrorMessage) == false)
                return false;

            // 비상조직 삭제
            List<int> removeTemporaryNos = new List<int>();

            foreach (Temporary temporary in data.RemoveTemporary)
            {
                removeTemporaryNos.Add(temporary.tmpr_sn);
            }

            if (DeleteManager.RemoveTemporaries(dataManager, removeTemporaryNos, out strErrorMessage) == false)
                return false;

            return true;
        }

        public static int UpdateRegularMember(IDataManager dataManager, RequestUpdateRegularMember data, out string strErrorMessage)
        {
            strErrorMessage = null;

            // 핸드폰 번호 암호화 처리
            if (data.Member.telno != null && data.Member.telno.Length > 0)
            {
                string strPhoneNumber = CheckValidPhoneNumber(data.Member.telno);
                data.Member.telno = AES256Cipher.AES_encrypt(strPhoneNumber);
            }

            if (data.Member.offm_telno != null && data.Member.offm_telno.Length > 0)
                data.Member.offm_telno = CheckValidPhoneNumber(data.Member.offm_telno);

            if (data.Member.rgl_memb_sn > 0)
            {
                // 조직원에 해당 계정 확인한 뒤
                string strCondition = string.Format("{0} = {1}", Model.Account.User.Fields.rgl_memb_sn, data.Member.rgl_memb_sn);
                Model.Account.User user = dataManager.GetSelect().SelectFirst<Model.Account.User>(strCondition, out strErrorMessage);

                if (user == null)
                {
                    if (strErrorMessage != null)
                        return -1;
                }
                else
                {
                    // 사번이 제거가 된다면 계정을 삭제
                    /*if (data.Member.unq_key == null || data.Member.unq_key == "")
                    {
                        if (DeleteManager.RemoveAccountUser(dataManager, data.Member.rgl_memb_sn, ref strErrorMessage) == false)
                            return -1;
                    }
                    else*/
                    {
                        bool update = false;

                        // 사번이 수정이 된다면 UserID가 수정
                        /*if (data.Member.unq_key != user.user_id)
                        {
                            update = true;
                            user.user_id = data.Member.unq_key;
                        }*/

                        // 이름이 수정된다면 NickName 수정
                        if (data.Member.memb_name != user.user_name)
                        {
                            update = true;
                            user.user_name = data.Member.memb_name;

                        }

                        if (update)
                        {
                            // 업데이트
                            if (dataManager.GetUpdate().Update<Model.Account.User>(user, null, out strErrorMessage) == false)
                                return -1;
                        }
                    }
                }

                if (dataManager.GetUpdate().Update<RegularMember>(data.Member, null, out strErrorMessage) == false)
                    return -1;
            }
            else
            {
                int addedID;

                if (dataManager.GetCreate().Insert<RegularMember>(data.Member, out addedID, out strErrorMessage) == false)
                    return -1;

                data.Member.rgl_memb_sn = addedID;
                return addedID;
            }

            return 0;
        }

        public static int UpdateRegular(IDataManager dataManager, RequestUpdateRegularTeam data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.RegularTeam.rgl_sn > 0)
            {
                if (dataManager.GetUpdate().Update<Regular>(data.RegularTeam, null, out strErrorMessage) == false)
                    return -1;
            }
            else
            {
                int addedID;

                if (dataManager.GetCreate().Insert<Regular>(data.RegularTeam, out addedID, out strErrorMessage) == false)
                    return -1;

                data.RegularTeam.rgl_sn = addedID;
                return addedID;
            }

            return 0;
        }

        public static int UpdateTemporaryMember(IDataManager dataManager, RequestUpdateTemporaryMember data, out string strErrorMessage)
        {
            strErrorMessage = null;

            TemporaryMember member = new TemporaryMember();
            member.tmpr_memb_sn = data.TemporaryMemberInfo.MemberNo;
            member.disp_name = data.TemporaryMemberInfo.DisplaySOPName;
            member.tmpr_sn = data.TemporaryMemberInfo.Temporary.tmpr_sn;
            member.rgl_sn = data.TemporaryMemberInfo.Regular?.rgl_sn;
            member.rgl_memb_sn = data.TemporaryMemberInfo.RegularMember?.rgl_memb_sn;
            member.role_no = data.TemporaryMemberInfo.Role;

            if (member.role_no != null)
                member.role_optn_no = TeamManager.RoleOptionNumber;

            if (data.TemporaryMemberInfo.MemberNo > 0)
            {
                if (dataManager.GetUpdate().Update<TemporaryMember>(member, null, out strErrorMessage) == false)
                    return -1;
            }
            else
            {
                int addedID;

                if (dataManager.GetCreate().Insert<TemporaryMember>(member, out addedID, out strErrorMessage) == false)
                    return -1;

                member.tmpr_memb_sn = addedID;
                return addedID;
            }

            return 0;
        }

        public static int UpdateTemporaryTeam(IDataManager dataManager, RequestUpdateTemporaryTeam data, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.TemporaryTeam.tmpr_sn > 0)
            {
                if (dataManager.GetUpdate().Update<Temporary>(data.TemporaryTeam, null, out strErrorMessage) == false)
                    return -1;
            }
            else
            {
                int addedID;

                if (dataManager.GetCreate().Insert<Temporary>(data.TemporaryTeam, out addedID, out strErrorMessage) == false)
                    return -1;

                data.TemporaryTeam.tmpr_sn = addedID;
                return addedID;
            }

            return 0;
        }

        // 전화번호에 '-'나 빈칸등이 있으면 없앤다.
        // 숫자만 남기고 모두 없앤다.
        private static string CheckValidPhoneNumber(string strPhoneNumber)
        {
            int len = strPhoneNumber.Length;
            string str = "";

            for (int i = 0; i < len; i++)
            {
                char ch = strPhoneNumber[i];

                if (ch >= '0' && ch <= '9')
                    str += ch.ToString();
            }

            return str;
        }

        private static bool UpdateTemporaryMember(IDataManager dataManager, List<TemporaryMember> temporaryMembers, Dictionary<int, int> dicChangeTeamNo, Dictionary<int, int> dicChangeTemporaryNo, Dictionary<int, int> dicChangeRegularMemberNo, out string strErrorMessage)
        {
            foreach (TemporaryMember member in temporaryMembers)
            {
                if (member.tmpr_sn < 0)
                {
                    if (dicChangeTemporaryNo.ContainsKey(member.tmpr_sn))
                        member.tmpr_sn = dicChangeTemporaryNo[member.tmpr_sn];
                    else
                    {
                        strErrorMessage = "비상조직 멤버 추가 실패, 비상조직 ID가 조회되지 않음.";
                        return false;
                    }
                }

                // 신규 정규조직일 경우
                if (member.rgl_sn != null && member.rgl_sn < 0)
                {
                    if (dicChangeTeamNo.ContainsKey((int)member.rgl_sn))
                        member.rgl_sn = dicChangeTeamNo[(int)member.rgl_sn];
                    else
                    {
                        strErrorMessage = "정규조직 멤버 추가 실패, 새로운 팀 ID가 조회되지 않음.";
                        return false;
                    }
                }

                // 신규 정규조직 멤버일 경우
                if (member.rgl_memb_sn != null && member.rgl_memb_sn < 0)
                {
                    if (dicChangeRegularMemberNo.ContainsKey((int)member.rgl_memb_sn))
                        member.rgl_memb_sn = dicChangeRegularMemberNo[(int)member.rgl_memb_sn];
                    else
                    {
                        strErrorMessage = "정규조직 멤버 추가 실패, 새로운 팀 ID가 조회되지 않음.";
                        return false;
                    }
                }
            }

            return dataManager.GetUpdate().Update<TemporaryMember>(temporaryMembers, out strErrorMessage);
        }

        private static bool AddTemporaryMember(IDataManager dataManager, List<TemporaryMember> temporaryMembers, Dictionary<int, int> dicChangeTeamNo, Dictionary<int, int> dicChangeTemporaryNo, Dictionary<int, int> dicChangeRegularMemberNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (TemporaryMember member in temporaryMembers)
            {
                if (member.tmpr_sn < 0)
                {
                    if (dicChangeTemporaryNo.ContainsKey(member.tmpr_sn))
                        member.tmpr_sn = dicChangeTemporaryNo[member.tmpr_sn];
                    else
                    {
                        strErrorMessage = "비상조직 멤버 추가 실패, 비상조직 ID가 조회되지 않음.";
                        return false;
                    }
                }

                // 신규 정규조직일 경우
                if (member.rgl_sn != null && member.rgl_sn < 0)
                {
                    if (dicChangeTeamNo.ContainsKey((int)member.rgl_sn))
                        member.rgl_sn = dicChangeTeamNo[(int)member.rgl_sn];
                    else
                    {
                        strErrorMessage = "정규조직 멤버 추가 실패, 새로운 팀 ID가 조회되지 않음.";
                        return false;
                    }
                }

                // 신규 정규조직 멤버일 경우
                if (member.rgl_memb_sn != null && member.rgl_memb_sn < 0)
                {
                    if (dicChangeRegularMemberNo.ContainsKey((int)member.rgl_memb_sn))
                        member.rgl_memb_sn = dicChangeRegularMemberNo[(int)member.rgl_memb_sn];
                    else
                    {
                        strErrorMessage = "정규조직 멤버 추가 실패, 새로운 팀 ID가 조회되지 않음.";
                        return false;
                    }
                }

                int addedID;

                if (dataManager.GetCreate().Insert<TemporaryMember>(member, out addedID, out strErrorMessage) == false)
                    return false;

                member.tmpr_memb_sn = addedID;
            }

            return true;
        }

        private static bool AddRegularMember(IDataManager dataManager, List<RegularMember> regularMembers, Dictionary<int, int> dicChangeTeamNo, Dictionary<int, int> dicChangeRegularMemberNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (RegularMember member in regularMembers)
            {
                if (member.telno != null)
                    member.telno = AES256Cipher.AES_encrypt(member.telno);

                if (member.rgl_sn < 0)
                {
                    if (dicChangeTeamNo.ContainsKey(member.rgl_sn))
                        member.rgl_sn = dicChangeTeamNo[member.rgl_sn];
                    else
                    {
                        strErrorMessage = "정규조직 멤버 추가 실패, 새로운 팀 ID가 조회되지 않음.";
                        return false;
                    }
                }

                int addedID;

                if (dataManager.GetCreate().Insert<RegularMember>(member, out addedID, out strErrorMessage) == false)
                    return false;

                dicChangeRegularMemberNo[member.rgl_memb_sn] = addedID;
                member.rgl_memb_sn = addedID;
            }

            return true;
        }

        private static bool AddTemporary(IDataManager dataManager, List<Temporary> temporaries, int siteNo, Dictionary<int, int> dicChangeTemporaryNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (Temporary temporary in temporaries)
            {
                int oldNo = temporary.tmpr_sn;

                if (temporary.parnts_sn != null && temporary.parnts_sn < 0 &&
                    dicChangeTemporaryNo.ContainsKey((int)temporary.parnts_sn))
                    temporary.parnts_sn = dicChangeTemporaryNo[(int)temporary.parnts_sn];

                temporary.nor_yn = true;
                temporary.site_sn = siteNo;

                int addedID;

                if (!dataManager.GetCreate().Insert<Temporary>(temporary, out addedID, out strErrorMessage))
                    return false;

                temporary.tmpr_sn = addedID;

                // 새로 추가된 팀 ID 변경 정보 저장
                dicChangeTemporaryNo[oldNo] = addedID;
            }

            return true;
        }

        private static bool AddRegular(IDataManager dataManager, List<Regular> regulars, Dictionary<int, int> dicChangeTeamNo, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (Regular regular in regulars)
            {
                int oldNo = regular.rgl_sn;

                if (regular.parnts_sn != null && regular.parnts_sn < 0 && dicChangeTeamNo.ContainsKey((int)regular.parnts_sn))
                    regular.parnts_sn = dicChangeTeamNo[(int)regular.parnts_sn];

                int addedID;

                if (dataManager.GetCreate().Insert<Regular>(regular, out addedID, out strErrorMessage) == false)
                    return false;

                regular.rgl_sn = addedID;
                dicChangeTeamNo[oldNo] = addedID;
            }

            return true;
        }
    }
}
