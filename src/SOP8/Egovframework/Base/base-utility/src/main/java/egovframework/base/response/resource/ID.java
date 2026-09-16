package egovframework.base.response.resource;

import egovframework.base.response.resource.MessageMap;

public class ID {

    public enum LanguageTypes {
        ko, en
    }

    private static LanguageTypes targetLanguage = LanguageTypes.ko;

    public static LanguageTypes getTargetLanguage() {
        return targetLanguage;
    }

    public static void setTargetLanguage(LanguageTypes value) {
        targetLanguage = value;
    }

    public static <T extends MessageMap> MessageMap get(Class<T> clazz, String strTag) {
        try {
            T t = clazz.getDeclaredConstructor().newInstance();
            return t.get(targetLanguage).get(strTag);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create instance of " + clazz.getName(), e);
        }
    }
}