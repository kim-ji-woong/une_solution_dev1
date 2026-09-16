package egovframework.base.response.resource;

import java.util.*;
import egovframework.base.response.resource.ID;

public class MessageMap {
    protected Map<String, Object> maps = null;
    protected String target = "";

    protected MessageMap(Map<String, Object> messageMaps) {
        this.maps = messageMaps;
    }

    protected static void setMessage(Map<ID.LanguageTypes, Map<String, Object>> messageMaps, ID.LanguageTypes type, String strTag, String strMessage) {
        Map<String, Object> dicMessageMaps = messageMaps.get(type);

        if (dicMessageMaps == null) {
            dicMessageMaps = new HashMap<>();
            messageMaps.put(type, dicMessageMaps);
        }

        dicMessageMaps.put(strTag, strMessage);
    }

    protected static void setMessage(Map<ID.LanguageTypes, Map<String, Object>> messageMaps, ID.LanguageTypes type, String strTagLevel1, String strTagLevel2, String strMessage) {
        Map<String, Object> dicRoot = getRootMap(messageMaps, type, strTagLevel1);
        setMessage(dicRoot, strTagLevel2, strMessage);
    }

    // Generic method for multiple levels
    protected static void setMessage(Map<ID.LanguageTypes, Map<String, Object>> messageMaps, ID.LanguageTypes type, String strTagLevel1, String... tagsAndMessage) {
        Map<String, Object> dicParent = getRootMap(messageMaps, type, strTagLevel1);

        List<String> tags = new ArrayList<>(Arrays.asList(tagsAndMessage));
        String strMessage = tags.remove(tags.size() - 1); // Last element is message

        for (int i = 0; i < tags.size() - 1; i++) {
            String strTag = tags.get(i);
            dicParent = getMap(dicParent, strTag);
        }

        setMessage(dicParent, tags.get(tags.size() - 1), strMessage);
    }

    protected static void setMessage(Map<String, Object> messageMaps, String strTag, String strMessage) {
        messageMaps.put(strTag, strMessage);
    }

    protected static Map<String, Object> getRootMap(Map<ID.LanguageTypes, Map<String, Object>> messageMaps, ID.LanguageTypes type, String strTag) {
        Map<String, Object> dicMessageMaps = messageMaps.get(type);

        if (dicMessageMaps == null) {
            dicMessageMaps = new HashMap<>();
            messageMaps.put(type, dicMessageMaps);
        }

        Object dicSubMessageMaps = dicMessageMaps.get(strTag);

        if (dicSubMessageMaps == null) {
            dicSubMessageMaps = new HashMap<String, Object>();
            dicMessageMaps.put(strTag, dicSubMessageMaps);
        }

        return (Map<String, Object>) dicSubMessageMaps;
    }

    protected static Map<String, Object> getMap(Map<String, Object> parentMap, String strTag) {
        Object dicSubMessageMaps = parentMap.get(strTag);

        if (dicSubMessageMaps == null) {
            dicSubMessageMaps = new HashMap<String, Object>();
            parentMap.put(strTag, dicSubMessageMaps);
        }

        return (Map<String, Object>) dicSubMessageMaps;
    }

    public MessageMap get(String strTag) {
        if (maps == null)
            return this;

        Object dicMessageMaps = maps.get(strTag);

        if (dicMessageMaps != null) {
            if (dicMessageMaps instanceof String) {
                target = (String) dicMessageMaps;
                maps = null;
                return this;
            }

            maps = (Map<String, Object>) dicMessageMaps;
            return this;
        }

        maps = null;
        return this;
    }

    public String value(String strTag) {
        if (maps == null)
            return target;

        Object targetObj = maps.get(strTag);

        if (targetObj instanceof String) {
            maps = null;
            target = (String) targetObj;
            return target;
        }

        return "";
    }

    public String value() {
        return target;
    }

    public MessageMap get(ID.LanguageTypes type) {
        return null;
    }
}