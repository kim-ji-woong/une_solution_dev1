package egovframework.base.account.ibll.response;

import java.util.ArrayList;
import java.util.List;
import egovframework.base.model.account.Grade;
import egovframework.base.response.MessageResult;

public class ResponseGradeList extends MessageResult {

    private List<Grade> grades = new ArrayList<>();

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }

    public ResponseGradeList() {
        super();
    }

    public ResponseGradeList(boolean success, String message) {
        super(success, message);
    }
}