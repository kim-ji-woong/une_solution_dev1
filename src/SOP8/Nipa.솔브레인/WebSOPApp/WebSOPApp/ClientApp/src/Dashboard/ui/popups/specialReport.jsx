import React, { Component } from 'react';
import queryString from 'query-string'
import $ from 'jquery';


class SpecialReport extends Component {
    static pathSpecialReport = '/specialReport';

    constructor(props) {
        super(props);

        this.state = {
            pathImg: null,
        }

        this.props = props;

        const { search } = this.props.location;	// 문자열 형식으로 결과값이 반환된다.
        const queryObj = queryString.parse(search);	// 문자열의 쿼리스트링을 Object로 변환
        const { path } = queryObj;

        this.state.pathImg = path;
    }

    getImage = () => {
        let path = this.state.pathImg;

        if (path !== null || path !== undefined) {
            path = window.location.origin + "/resource/" + path;

            return <img src={path} style={{ width: "100%", maxWidth: "none"}}/>;
        } else {
            return <></>;
        }

        return path;
    }

    render() {
        const img = this.getImage();

        return (
            <>
                {img}
            </>
        );
    }
}
export default SpecialReport;