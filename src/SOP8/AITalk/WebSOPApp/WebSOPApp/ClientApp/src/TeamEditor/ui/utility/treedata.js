import TreeNode from "./treenode";

class TreeData {
    static teamTreeDataToReceivers(teamTreeData, teamType) {
        if (!teamTreeData) {
            return [];
        }

        const receivers = [];

        for (const teamData of teamTreeData) {
            if (teamData.checked === TreeNode.CHECKED_ALL) {
                receivers.push(TreeData.makeReceiver(teamData.No, teamType));
            }

            const childReceivers = TreeData.teamTreeDataToReceivers(teamData.Children, teamType);

            for (const receiver of childReceivers) {
                receivers.push(receiver);
            }
        }

        return receivers;
    }

    static makeReceiver(teamID, teamType) {
        return {
            teamID, teamType
        };
    }

    // Checkbox_RelativeUse에서만 사용함
    static setRelativeDefaultCheck(teamTreeData) {
        if (teamTreeData) {
            TreeData.setRelativeCascadeCheck(teamTreeData);
            TreeData.setRelativeSomeCheck(teamTreeData);
        }
    }

    static setRelativeCascadeCheck(teamTreeData) {
        if (teamTreeData) {
            for (const teamData of teamTreeData) {
                if (teamData.checked === TreeNode.CHECKED_ALL) {
                    TreeNode.setCheckCascade(teamData);
                }

                TreeData.setRelativeCascadeCheck(teamData.Children);
            }
        }
    }

    static setRelativeSomeCheck(teamTreeData) {
        if (teamTreeData) {
            for (const teamData of teamTreeData) {
                if (teamData.checked !== TreeNode.CHECKED_ALL) {
                    if (TreeData.hasCheckedChild(teamData)) {
                        teamData.checked = TreeNode.CHECKED_SOME;
                    }
                }

                TreeData.setRelativeSomeCheck(teamData.Children);
            }
        }
    }

    static hasCheckedChild(teamData) {
        if (teamData.Children) {
            for (const child of teamData.Children) {
                if (child.checked === TreeNode.CHECKED_ALL) {
                    return true;
                }

                if (TreeData.hasCheckedChild(child)) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default TreeData;