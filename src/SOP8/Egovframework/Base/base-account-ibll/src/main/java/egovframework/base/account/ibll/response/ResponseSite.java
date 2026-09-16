package egovframework.base.account.ibll.response;

import java.util.ArrayList;
import java.util.List;
import egovframework.base.model.common.Site;
import egovframework.base.response.MessageResult;

public class ResponseSite extends MessageResult {

    private List<Site> sites = new ArrayList<>();
    private boolean useMultiSite = false;

    public List<Site> getSites() {
        return sites;
    }

    public void setSites(List<Site> sites) {
        this.sites = sites;
    }

    public boolean isUseMultiSite() {
        return useMultiSite;
    }

    public void setUseMultiSite(boolean useMultiSite) {
        this.useMultiSite = useMultiSite;
    }

    public ResponseSite() {
        super();
    }

    public ResponseSite(boolean success, String message) {
        super(success, message);
    }
}