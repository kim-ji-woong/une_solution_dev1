package egovframework.base.account.ibll.models;

import java.util.ArrayList;
import java.util.List;

public class UserOption {

    private String category = null;
    private String subCategory = null;
    private List<String> values = new ArrayList<>();

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }
}