import styled from "styled-components";
import wonik_edit_top_save from "../images/wonik_edit_top_save.png";
import wonik_edit_top_close from "../images/wonik_edit_top_close.png";
import header_background from "../images/header_background.png";

import wonik_quickButton_poi_on from "../images/wonik_quickButton_poi_on.png";
import wonik_quickButton_poi_off from "../images/wonik_quickButton_poi_off.png";
import wonik_quickButton_fakeWall_on from "../images/wonik_quickButton_fakeWall_on.png";
import wonik_quickButton_fakeWall_off from "../images/wonik_quickButton_fakeWall_off.png";
import wonik_quickButton_equipZoneName_on from "../images/wonik_quickButton_equipZoneName_on.png";
import wonik_quickButton_equipZoneName_off from "../images/wonik_quickButton_equipZoneName_off.png";
import wonik_quickButton_cctvGroup_on from "../images/wonik_quickButton_cctvGroup_on.png";
import wonik_quickButton_cctvGroup_off from "../images/wonik_quickButton_cctvGroup_off.png";
import wonik_quickButton_editcctv_on from "../images/wonik_quickButton_editcctv_on.png";
import wonik_quickButton_editcctv_off from "../images/wonik_quickButton_editcctv_off.png";


/**********************************************************************/
// SDMS 편집모드

export const EditMenusComponent = styled.div`
    width: 0;
    height: 0;

    #edTitle {
        width: 301px;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 50px;
        background: url(${header_background}) no-repeat;
        height: 50px;
        padding: 9px 0 10px 20px;
    }

    #edTitle:after {
        content: "";
        display: table;
        clear: both;
    }

    #edTitle h2 {
        float: left;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        letter-spacing: -0.075em;
        font-weight: 600;
    }

    #edTitle a {
        display: block;
        float: right;
        width: 30px;
        height: 30px;
        text-indent: -9999px;
    }

    #edTitle a.edtSave {
        background: url(${wonik_edit_top_save}) no-repeat center center;
        cursor: pointer;
    }

    #edTitle a.edtClose {
        background: url(${wonik_edit_top_close}) no-repeat center center;
        cursor: pointer;
        margin-right: 30px;
    }

    #dsMap {
        width: 100%;
        height: 100%;
    }

    .dsmTitle {
        position: fixed;
        z-index: 98;
        right: 40px;
        bottom: 40px;
        color: #fff;
        font-size: 38px;
        line-height: 1em;
        font-weight: 600;
    }

    #dsBot {
	position: fixed;
	z-index: 99; /* 0518 */
	left: 50%;
	bottom: 20px;
	width: 500px;
	margin-left: -250px;
}

    #dsBot button {
        display: block;
        background: #25343d;
        width: 100%;
        height: 20px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    #dsBot button.edit {
        width: 70%;
        position:absolute;
        left:50%;
        top:-20px;
        transform: translateX(-50%);
    }

    #dsBot ul {
        position: absolute;
        left: 34px;
        right: 34px;
        bottom: 0;
        margin-bottom: 10px;
    }

    #dsBot ul.edit {
        left: 114px;
    }

    #dsBot ul:after {
        content: '';
        display: table;
        clear: both;
    }

    #dsBot ul li {
        float: left;
        padding: 0 2px;
        position: relative;
    }

    #dsBot ul li a {
        display: table;
        width: 50px;
        height: 50px;
        border: solid 1px #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    #dsBot ul li a span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 1.1em;
    }

    #dsBot ul li a span em {
        display: none;
    }

    #dsBot ul li a:hover {
        background: rgba(39, 46, 66, 1)!important;
    }

    #dsBot ul li a:hover em {
        display: block;
    }

    .poi.on {
        background: url(${wonik_quickButton_poi_on}) no-repeat center center !important;
    }

    .poi.off {
        background: url(${wonik_quickButton_poi_off}) no-repeat center center !important;
    }

    .fakeWall.on {
        background: url(${wonik_quickButton_fakeWall_on}) no-repeat center center !important;
    }

    .fakeWall.off {
        background: url(${wonik_quickButton_fakeWall_off}) no-repeat center center !important;
    }

    .equipZoneName.on {
        background: url(${wonik_quickButton_equipZoneName_on}) no-repeat center center !important;
    }

    .equipZoneName.off {
        background: url(${wonik_quickButton_equipZoneName_off}) no-repeat center center !important;
    }

    .cctvGroup.on {
        background: url(${wonik_quickButton_cctvGroup_on}) no-repeat center center !important;
    }

    .cctvGroup.off {
        background: url(${wonik_quickButton_cctvGroup_off}) no-repeat center center !important;
    }

    .cctv.on {
        background: url(${wonik_quickButton_editcctv_on}) no-repeat center center !important;
    }

    .cctv.off {
        background: url(${wonik_quickButton_editcctv_off}) no-repeat center center !important;
    }
`;
