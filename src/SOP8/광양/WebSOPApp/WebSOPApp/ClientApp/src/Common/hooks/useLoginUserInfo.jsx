import { useEffect, useState } from "react";
import ProjectResource from "../../Root/resource/id";

export default function useLoginUserInfo() {
    const [loginUserInfo, setLoginUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const userInfo = await ProjectResource.initUserInfo();

            if (userInfo) {
                setLoginUserInfo(userInfo);
            }

            setLoading(false);
        };

        init();
    }, []);

    return { loginUserInfo, loading };
}