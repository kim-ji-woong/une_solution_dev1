import React, { useState } from "react";
import styled from "styled-components";
import SdmsResource from "../../resource/id";
import SDMSMainMenu from "../sdmsMainMenu";
import Icon from '../../../Common/components/Icon/Icon';

const MENU_TYPE = {
    SDMS: "sdms",
    POI: "poi",
    SIMULATION: "simulation",
};

const QUICK_MENU_STATE = {
    ON: "on",
    OFF: "off",
    DISABLE: "disable",
};

const QuickMenuBar = (props) => {
    const [menuType, setMenuType] = useState(MENU_TYPE.SDMS);
    const poiMenuTypeMap = {
        atmosphere: SDMSMainMenu.Atmosphere_Sensor,
        weather: SDMSMainMenu.Weather_Sensor,
        water: SDMSMainMenu.Water_Sensor,
        waterDisaster: SDMSMainMenu.WaterDisaster_Sensor,
        naturalCCTV: SDMSMainMenu.NaturalCCTV_Sensor,
        trafficCCTV: SDMSMainMenu.TrafficCCTV_Sensor,
        zoneName: SDMSMainMenu.ZoneName_Sensor,
    };

    const getQuickMenuState = (menuKey) => {
        if (props.disabledMenus?.includes(menuKey)) {
            return QUICK_MENU_STATE.DISABLE;
        }

        const poiType = poiMenuTypeMap[menuKey];

        if (poiType) {
            return props.visibleSensorTypes?.[poiType]
                ? QUICK_MENU_STATE.ON
                : QUICK_MENU_STATE.OFF;
        }

        if (props.visiblePopups?.[menuKey]) {
            return QUICK_MENU_STATE.ON;
        }

        return QUICK_MENU_STATE.OFF;
    };

    const handleMenuClick = (menuKey, state) => {
        if (state === QUICK_MENU_STATE.DISABLE) return;

        if (menuKey === SdmsResource.ID.menu.poiViewer) {
            props.disappearPopups?.(true);
            setMenuType(MENU_TYPE.POI);
            return;
        }

        if (menuKey === SdmsResource.ID.menu.simulation) {
            props.disappearPopups?.(true);
            setMenuType(MENU_TYPE.SIMULATION);
            return;
        }

        if (menuKey === "return") {
            props.disappearPopups?.(false);
            setMenuType(MENU_TYPE.SDMS);
            return;
        }

        const poiType = poiMenuTypeMap[menuKey];

        if (poiType) {
            props.setVisiblePoi?.(poiType, state !== QUICK_MENU_STATE.ON);
            return;
        }

        props.setVisiblePopups(menuKey);
    };

    // 관제 메뉴
    const sdmsMenus = [
        {
            key: SdmsResource.ID.menu.statusInfo,
            label: SdmsResource.ID.menu.statusInfo,
            icon: <Icon.IconInspection />,
        },
        {
            key: SdmsResource.ID.menu.event,
            label: SdmsResource.ID.menu.event,
            icon: <Icon.IconBell />,
        },
        {
            key: SdmsResource.ID.menu.publicData,
            label: SdmsResource.ID.menu.publicData,
            icon: <Icon.IconData2 />,
        },
        {
            key: SdmsResource.ID.menu.miniMap,
            label: SdmsResource.ID.menu.miniMap,
            icon: <Icon.IconMinimap />,
        },
        {
            key: SdmsResource.ID.menu.poiViewer,
            label: SdmsResource.ID.menu.poiViewer,
            icon: <Icon.IconLocationMarker />,
            hasLeftBorder: true,
        },
        {
            key: SdmsResource.ID.menu.simulation,
            label: SdmsResource.ID.menu.simulation,
            icon: <Icon.IconMonitoringStats />,
        },
    ];

    const poiMenus = [
        {
            key: "atmosphere",
            label: "대기유해물질",
            icon: <Icon.IconAtmosphere />,
            hasLeftBorder: true,
        },
        {
            key: "weather",
            label: "통합기상",
            icon: <Icon.IconSun />,
        },
        {
            key: "water",
            label: "수질오염",
            icon: <Icon.IconWater />,
        },
        {
            key: "waterDisaster",
            label: "수해방지",
            icon: <Icon.IconWaterDisaster />,
        },
        {
            key: "naturalCCTV",
            label: "환경감시",
            icon: <Icon.IconNaturalCCTV />,
        },
        {
            key: "trafficCCTV",
            label: "교통안전",
            icon: <Icon.IconTrafficCCTV />,
        },
        {
            key: "zoneName",
            label: "건물명",
            icon: <Icon.IconBuilding />,
        }
    ];

    const simulationMenus = [
        {
            key: SdmsResource.ID.menu.atmosphereSimulation,
            label: SdmsResource.ID.menu.atmosphereSimulation,
            icon: <Icon.IconAtmosphere />,
            // hasLeftBorder: true,
        },
        // {
        //     key: SdmsResource.ID.menu.floodSimulation,
        //     label: SdmsResource.ID.menu.floodSimulation,
        //     icon: <Icon.IconFlood />,
        // },
    ];

    const returnMenu = {
        key: "return",
        label: "돌아가기",
        icon: <Icon.IconReturn />,
    }

    const getMenusByType = () => {
        switch (menuType) {
            case MENU_TYPE.POI:
                return [returnMenu, ...poiMenus];
            case MENU_TYPE.SIMULATION:
                return [returnMenu, ...simulationMenus];
            case MENU_TYPE.SDMS:
            default:
                return sdmsMenus;
        }
    };

    return (
        <QuickMenuBarComponent className={'UI_Section'}>
            {getMenusByType().map((menu) => {
                const state =
                    menu.key === "return"
                        ? QUICK_MENU_STATE.OFF
                        : getQuickMenuState(menu.key);

                return (
                    <MenuButton
                        key={menu.key}
                        className={state}
                        $hasLeftBorder={menu.hasLeftBorder}
                        onClick={() => handleMenuClick(menu.key, state)}
                    >
                        {menu.icon}
                        <span>{menu.label}</span>
                    </MenuButton>
                );
            })}
        </QuickMenuBarComponent>
    );
};

const QuickMenuBarComponent = styled.div`
    border-radius: 10px;
    background: rgba(20, 27, 39, 0.93);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.06),
        0 10px 17px 0 rgba(0, 0, 0, 0.18),
        0 0 2px 0 rgba(220, 232, 244, 0.35) inset;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);
    ${({ theme }) => theme.mixins.flex("center", "center")};
    z-index: 2;
    overflow: hidden;

    > div {
        animation: menuSwitch 0.25s ease;
    }

    @keyframes menuSwitch {
        from {
            opacity: 0;
            transform: translateY(6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const MenuButton = styled.div`
    position: relative;
    width: 78px;
    height: 68px;
    background: ${({ theme }) => theme.colors.background.base};
    ${({ theme }) => theme.mixins.flex("center", "center", "column", "4px")};
    color: ${({ theme }) => theme.colors.primary.p100};
    cursor: pointer;

    ${({ $hasLeftBorder, theme }) =>
        $hasLeftBorder && 
            `
                &::before {
                    content: '';
                    display: block;
                    width: 1px;
                    height: 44px;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: ${theme.colors.grayscale.g700};
                }
            `
    }

    > span {
        font-size: 12px;
        font-style: normal;
        line-height: 170%;
        letter-spacing: -0.36px;
        color: ${({ theme }) => theme.colors.primary.p100};
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: ${({ theme }) => theme.colors.primary.p200};
    }

    &.on {
        color: ${({ theme }) => theme.colors.primary.p500};

        > span {
            color: ${({ theme }) => theme.colors.primary.p500};
        }
    }

    &.off {
        color: ${({ theme }) => theme.colors.primary.p100};
    }

    &.disable {
        cursor: not-allowed;
        pointer-events: none;
        color: ${({ theme }) => theme.colors.grayscale.g600};

        > span {
            color: ${({ theme }) => theme.colors.grayscale.g600};
        }
    }
`;

export default QuickMenuBar;
