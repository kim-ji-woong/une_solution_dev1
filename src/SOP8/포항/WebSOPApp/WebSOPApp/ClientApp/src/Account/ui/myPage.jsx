import React, { useState, useEffect } from 'react';
import { MyPageComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import AccountResource from '../resource/id';

function MyPage(props) {
    const [regularMembers, setRegularMembers] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
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

		if (jobPositions && jobPositions.length > 0) {
			for (let i = 0; i < jobPositions.length; i++) {
				const item = { value: jobPositions[i].team_optn_no, name: jobPositions[i].team_optn_name }
				arrJobPositions.push(item);
			}
		}

		setJobPositions(arrJobPositions);
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
        let jopPosition = '-';
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
                    email = member.email ? member.email : '-';
    
                    if (member.ofcps_no && jobPositions && jobPositions.length > 0) {
                        const value = jobPositions.find((item) => item.value === member.ofcps_no);
    
                        if (value) {
                            jopPosition = value.name;
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

        return [memberName, memberID, memberLevel, teamName, jopPosition, phoneNumber, officePhoneNumber, email];
    }

    const [memberName, memberID, memberLevel, teamName, jopPosition, phoneNumber, officePhoneNumber, email] = getMemberInfo(); 

    return (
        <ModalBackground className='UI_Section'>
        <MyPageComponent>
            <header>
                <div>
                    <h2>마이페이지</h2>
                    <div>
                        <span>{memberName}</span>
                        <span>님 안녕하세요 :-&#41;</span>
                    </div>
                </div>
                <button onClick={() => props.handlePopup('myPage', false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <ul>
                    <li>
                        <span>소속 조직</span>
                        <span>{teamName}</span>
                    </li>
                    <li>
                        <span>이름</span>
                        <span>{memberName}</span>
                    </li>
                    <li>
                        <span>직위</span>
                        <span>{jopPosition}</span>
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
                        <span>E-mail</span>
                        <span>{email}</span> 
                    </li>
                    <li>
                        <span>사용자ID</span>
                        <span>{memberID}</span>
                    </li>
                    <li>
                        <span>권한</span>
                        <span>{memberLevel}</span>
                    </li>
                </ul>
                <button onClick={() => props.handlePopup('changePwd', true)}>
                    비밀번호 변경하러 가기
                </button>
            </section>
        </MyPageComponent>
        </ModalBackground>
    );
}

export default MyPage;