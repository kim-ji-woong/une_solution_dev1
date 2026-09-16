package egovframework.base.response.request;
import egovframework.base.response.request.RequestPage;

public class RequestSearchTextPage extends RequestPage {

    private String searchText = null;

    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    @Override
    public Integer getBeginIndex() {
        if (this.searchText == null || this.searchText.trim().isEmpty()) {
            return super.getBeginIndex();
        }
        return null;
    }
}