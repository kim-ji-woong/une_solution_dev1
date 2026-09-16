package egovframework.base.data.common.code;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import egovframework.base.data.common.code.CodeType;

public abstract class CodeTypeData {
	protected List<Integer> collections = new ArrayList();

	public List<Integer> getCollection() {
        return collections;
    }

    public abstract CodeType getCodeType();
}
