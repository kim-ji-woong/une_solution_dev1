// default - closed
import d_c_n from '../../../../images/door/door-closed_point.png';
import d_c_i from '../../../../images/door/door-closed_important.png';
import d_c_hp from '../../../../images/door/door-closed_hover_point.png';
import d_c_hi from '../../../../images/door/door-closed_hover_important.png';
import d_c_sp from '../../../../images/door/door-closed_selected_point.png';
import d_c_si from '../../../../images/door/door-closed_selected_important.png';

// default - opened
import d_o_n from '../../../../images/door/door-opened_point.png';
import d_o_i from '../../../../images/door/door-opened_important.png';
import d_o_hp from '../../../../images/door/door-opened_hover_point.png';
import d_o_hi from '../../../../images/door/door-opened_hover_important.png';
import d_o_sp from '../../../../images/door/door-opened_selected_point.png';
import d_o_si from '../../../../images/door/door-opened_selected_important.png';

// alarm - closed
import a_c_n from '../../../../images/door/door-closed_alarm_point.png';
import a_c_i from '../../../../images/door/door-closed_alarm_important.png';
import a_c_hp from '../../../../images/door/door-closed_alarm_hover_point.png';
import a_c_hi from '../../../../images/door/door-closed_alarm_hover_important.png';
import a_c_sp from '../../../../images/door/door-closed_alarm_selected_point.png';
import a_c_si from '../../../../images/door/door-closed_alarm_selected_important.png';

// alarm - opened
import a_o_n from '../../../../images/door/door-opened_alarm_point.png';
import a_o_i from '../../../../images/door/door-opened_alarm_important.png';
import a_o_hp from '../../../../images/door/door-opened_alarm_hover_point.png';
import a_o_hi from '../../../../images/door/door-opened_alarm_hover_important.png';
import a_o_sp from '../../../../images/door/door-opened_alarm_selected_point.png';
import a_o_si from '../../../../images/door/door-opened_alarm_selected_important.png';

// disabled - closed
import dis_c_n from '../../../../images/door/door-closed_disabled_point.png';
import dis_c_i from '../../../../images/door/door-closed_disabled_important.png';
import dis_c_hp from '../../../../images/door/door-closed_disabled_hover_point.png';
import dis_c_hi from '../../../../images/door/door-closed_disabled_hover_important.png';
import dis_c_sp from '../../../../images/door/door-closed_disabled_selected_point.png';
import dis_c_si from '../../../../images/door/door-closed_disabled_selected_important.png';

export const DOOR_IMAGE_MAP = {
    default: {
        closed: {
            point: d_c_n,
            important: d_c_i,
            hover_point: d_c_hp,
            hover_important: d_c_hi,
            selected_point: d_c_sp,
            selected_important: d_c_si,
        },
        opened: {
            point: d_o_n,
            important: d_o_i,
            hover_point: d_o_hp,
            hover_important: d_o_hi,
            selected_point: d_o_sp,
            selected_important: d_o_si,
        },
    },

    alarm: {
        closed: {
            point: a_c_n,
            important: a_c_i,
            hover_point: a_c_hp,
            hover_important: a_c_hi,
            selected_point: a_c_sp,
            selected_important: a_c_si,
        },
        opened: {
            point: a_o_n,
            important: a_o_i,
            hover_point: a_o_hp,
            hover_important: a_o_hi,
            selected_point: a_o_sp,
            selected_important: a_o_si,
        },
    },

    disabled: {
        closed: {
            point: dis_c_n,
            important: dis_c_i,
            hover_point: dis_c_hp,
            hover_important: dis_c_hi,
            selected_point: dis_c_sp,
            selected_important: dis_c_si,
        },
    },
};