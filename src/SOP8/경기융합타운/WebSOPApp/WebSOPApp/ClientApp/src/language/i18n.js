import i18n from "i18next";
import { initReactI18next, withTranslation } from "react-i18next";
import ProjectResource from "../Root/resource/id";

import langEn from './lang.en'
import langKo from './lang.ko'

const resource = {
    en: {
        translation: langEn
    },
    ko: {
        translation: langKo
    }
};

i18n
    .use(initReactI18next)  // passes i18n down to react-i18next
    
    .init({
        debug: true,
        resources: resource,
        lng: "ko",         // 기본 설정 언어
        fallbackLng: 'ko', // 번역 파일에서 찾을 수 없는 경우 기본 언어
        // ns: ['translation'], // 로드할 네임스페이스의 문자열 또는 배열
        // defaultNS: "translation", // 기본값 : translation, 번역기능에 전달되지 않은 경우 사용되는 기본 네임스페이스
        debug: true,       // 오류 발생시 출력 여부
        keySeparator: ".", // 'messages.welcome' 와 같은 키 형식의 form을 사용
        allowObjectInHTMLChildren: true, // html 요소가 객체를 받을수 있도록 한다. 객체를 html 요소로 전달해서 각각의 보간으로 대체할 수 있다. 값(대부분 Trans 성분 포함)        
        interpolation: {
            escapeValue: false // 기본적으로, XSS 공격을 완화하기 위해 이 값이 escape 된다. 번역을 요청할 때는 옵션을 false 로 설정할 수 있다. 
        }
    });

export default class i18nUtil {
    // Json 형식일 경우 현재 언어 설정 되어 있는 값을 가져온다
    // ex) 한글 {"ko":"한글 데이터","en":"영어 데이터"} -> return "한글 데이터"
    static convertText(jsonText) {
        try {
            if (!jsonText || jsonText === null) {
                return jsonText;
            }

            const obj = JSON.parse(jsonText);
            if (obj && typeof obj === 'object') {
                for (const [bKey, bValue] of Object.entries(obj)) {
                    if (bKey === i18n.language.toString()) {
                        return bValue;
                    }
                }
            }
            
        } catch (e) {
            // json 형식 아님
        }

        return jsonText;
    }

    static convertTextByLanguage(language, jsonText) {
        try {
            if (!jsonText || jsonText === null) {
                return jsonText;
            }

            const obj = JSON.parse(jsonText);
            if (obj && typeof obj === 'object') {
                for (const [bKey, bValue] of Object.entries(obj)) {
                    if (bKey === language) {
                        return bValue;
                    }
                }
            }

        } catch (e) {
            // json 형식 아님
        }

        return jsonText;
    }

    // 현재 언어 설정 Json 위치의 값을 바꾼다
    // ex) chgText = "한글 변경 데이터", 한글 설정일때
    // {"ko":"한글 데이터","en":"영어 데이터"} -> return {"ko":"한글 변경 데이터","en":"영어 데이터"}
    static convertJson(orgJson, chgText) {
        try {
            const obj = JSON.parse(orgJson);
            if (obj && typeof obj === 'object') {
                if (obj[i18n.language.toString()]) {
                    obj[i18n.language.toString()] = chgText;
                    return JSON.stringify(obj);
                }
            }

        } catch (e) {
            // json 형식 아님
        }

        return chgText;
    }

    static convertJsonByLanguage(language, orgJson, chgText) {        
        let obj = null;
        try {
            obj = JSON.parse(orgJson);
        } catch (e) {
            // json 형식 아님
            // 추후 다국어 사용 여부를 체크할지, 전체 적용할지 
            // 일단 수소충전소만 json 형식으로 db저장함
            if (ProjectResource.SiteNo === ProjectResource.Site.Hydrogen) {
                if (orgJson === null || orgJson.length === 0) {
                    // 1.
                    //const newObj = {
                    //    'ko': '',
                    //    'en': ''
                    //}
                    //if (newObj[language] !== null) {
                    //    newObj[language] = chgText;
                    //}
                    const newObj = {
                        'ko': chgText,
                        'en': chgText
                    }

                    return JSON.stringify(newObj);
                }
            }

            return chgText;
        }

        try {
            if (obj && typeof obj === 'object') {
                if (obj[language] !== null) {
                    obj[language] = chgText;
                    return JSON.stringify(obj);
                }
            } else {
                // 추후 다국어 사용 여부를 체크할지, 전체 적용할지 
                // 일단 수소충전소만 json 형식으로 db저장함
                if (ProjectResource.SiteNo === ProjectResource.Site.Hydrogen) {
                    // 2.
                    //const newObj = {
                    //    'ko': '',
                    //    'en': ''
                    //}
                    //if (newObj[language] !== null) {
                    //    newObj[language] = chgText;
                    //}

                    if (chgText !== null && chgText.length > 0) {
                        const newObj = {
                            'ko': chgText,
                            'en': chgText
                        }

                        return JSON.stringify(newObj);
                    }
                }
            }
        } catch (e) {
            
        }

        return chgText;
    }
}
export { i18n, withTranslation, i18nUtil };