import React, { useState, useEffect } from 'react';
import { MyPageComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import ProjectResource from '../../Root/resource/id';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import AccountResource from '../resource/id';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';

function MyPage(props) {
    const [regularMembers, setRegularMembers] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [jobLevels, setJobLevels] = useState([]);
    const [regularTeamData, setRegularTeamData] = useState([]);	

    useEffect(() => {
        initMemberDatas();
        initJobPositionDatas();
        initTeamDatas();
    }, []);

    const initMemberDatas = async () => {
        const [members] = await TeamEditController.displayRegularMember();

        if (members && members.length > 0) {
            setRegularMembers(members);
        }
    }

    const initJobPositionDatas = async () => {
        let arrJobPositions = new Array();
		let [jobPositions] = await TeamEditController.getJobPositions();
        let [jobLevels] = await TeamEditController.getJobLevels();

		if (jobPositions && jobPositions.length > 0) {
			for (let i = 0; i < jobPositions.length; i++) {
				const item = { value: jobPositions[i].team_optn_no, name: jobPositions[i].team_optn_name }
				arrJobPositions.push(item);
			}
		}

		setJobPositions(arrJobPositions);

        if (jobLevels && jobLevels.length > 0) {
            setJobLevels(jobLevels);
        }
    }

    const initTeamDatas = async () => {
        let [regularDatas] = await TeamEditController.displayRegular();

        if (regularDatas && regularDatas.length > 0) {
            setRegularTeamData(regularDatas);
        }
    }

    const findTeamName = (teamData, member) => {
        for (const team of teamData) {
            if (team.No === member.rgl_sn) {
                return team.TeamName;
            }
    
            if (team.Children && team.Children.length > 0) {
                const name = findTeamName(team.Children, member);
                if (name) {
                    return name;
                }
            }
        }
        
        return null;
    };

    const getMemberInfo = () => {
        const userInfo = ProjectResource.getUserInfo();

        let memberName = '-';
        let memberID = '-';
        let memberLevel = '-';

        let teamName = '-';
        let jobLevel = '-';
        let jobPosition = '-';
        let phoneNumber = '-';
        let officePhoneNumber = '-';
        let email = '-';

        if (userInfo !== null && userInfo !== undefined) {
            memberName = userInfo.user_name;
            memberID = userInfo.user_id;
            memberLevel = userInfo.grad_name;

            if (regularMembers && regularMembers.length > 0) {
                const member = regularMembers.find((value) => value.rgl_memb_sn === userInfo.regularMemberNo);

                if (member) {
                    phoneNumber = member.telno ? AccountResource.formatNumber(member.telno) : '-';
                    officePhoneNumber = member.offm_telno ? AccountResource.formatNumber(member.offm_telno) : '-';
                    email = member?.email ? member.email : '-';

                    if (member.ofcps_no && jobPositions && jobPositions.length > 0) {
                        const value = jobPositions.find((item) => item.value === member.ofcps_no);
    
                        if (value) {
                            jobPosition = value.name;
                        } 
                    }

                    if (member.clsf_no && jobLevels && jobLevels.length > 0) {
                        const value = jobLevels.find((item) => item.team_optn_no === member.clsf_no);

                        if (value) {
                            jobLevel = value.team_optn_name;
                        }
                    }
    
                    if (regularTeamData && regularTeamData.length > 0) {
                        const name = findTeamName(regularTeamData, member);
                        if (name) {
                            teamName = name;
                        }
                    }
                }
            }
        }

        return [memberName, memberID, memberLevel, teamName, jobLevel, jobPosition, phoneNumber, officePhoneNumber, email];
    }

    const [memberName, memberID, memberLevel, teamName, jobLevel, jobPosition, phoneNumber, officePhoneNumber, email] = getMemberInfo(); 

    return (
        <ModalBackground className='UI_Section'>
            <MyPageComponent>
                <div>
                    <div className='headerWrap'>
                        <IconButton
                            variant="unfill"
                            size="md"
                            icon={<Icon.Closer />}
                            onClick={() => props.handlePopup('myPage', false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                    <header>
                        <h2>
                            <Icon.IconAdmin size="xxs" />
                            마이페이지
                        </h2>
                        <p><span>{memberName}</span>님 안녕하세요 :-&#41;</p>
                    </header>
                    <section>
                        <ul>
                            <li>
                                <span>소속 조직</span>
                                <span>{teamName}</span>
                            </li>
                            <li>
                                {/* ofcps_no */}
                                <span>직위</span> 
                                <span>{jobPosition}</span>
                            </li>
                            <li>
                                {/* clsf_no */}
                                <span>직급</span>
                                <span>{jobLevel}</span>
                            </li>
                            <li>
                                <span>휴대전화번호</span>
                                <span>{phoneNumber}</span>
                            </li>
                            <li>
                                <span>근무처 전화번호</span>
                                <span>{officePhoneNumber}</span>
                            </li>
                            <li>
                                <span>Email</span>
                                <span>{email}</span> 
                            </li>
                            <li>
                                <span>아이디</span>
                                <span>{memberID}</span>
                            </li>
                            <li>
                                <span>권한</span>
                                <span>{memberLevel}</span>
                            </li>
                        </ul>
                        <BoxButton
                            variant="ghost"
                            size="xl"
                            fullWidth={true}
                            onClick={() => props.handlePopup('changePwd', true)}
                        >
                            비밀번호 변경
                        </BoxButton>
                    </section>
                </div>
            </MyPageComponent>
        </ModalBackground>
    );
}

export default MyPage;