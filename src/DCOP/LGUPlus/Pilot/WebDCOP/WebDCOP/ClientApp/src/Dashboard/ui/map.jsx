import React, { useEffect, useRef, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_koreaLow from "@amcharts/amcharts5-geodata/southKoreaLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import DashboardResource from '../resource/id';
import { MapComponent } from '../styled/dashboardStyled';
import markerImg from '../images/markerImg.svg';
import markerImg2 from '../images/markerImg2.svg';
import markerImg3 from '../images/markerImg3.png';
import markerImg4 from '../images/markerImg4.png';

const Map = (props) => {
    const [prevZoomLevel, setPrevZoomLevel] = useState(0);
    const mapRef = useRef(null);

    let zoomLevel = 0.9;
    let coordinates = DashboardResource.coordinates.southKorea;

    useEffect(() => {
        am5.addLicense("AM5M389009200");

        // Root와 인스턴스 생성
        let root = am5.Root.new("chartdiv");

        // Theme 적용
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Chart 인스턴스 생성
        let chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "rotateY",
            wheelY: "zoom",
            homeZoomLevel: zoomLevel,  // 초기 줌 레벨 설정
            homeGeoPoint: coordinates, // 초기 줌 좌표 설정
            minZoomLevel: 0.9,
            maxZoomLevel: 16,
            zoomStep: 2,
            projection: am5map.geoMercator(),
        }));

        // 데이터 로드
        chart.set("geodata", am5geodata_koreaLow);

        // 시리즈 추가
        let polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_koreaLow
            })
        );

        // map first load시 설정된 초기 줌 레벨/좌표로 이동
        polygonSeries.events.on("datavalidated", () => {
            chart.goHome();
        });

        // 지도 색상 지정
        polygonSeries.mapPolygons.template.setAll({
            fill: am5.color(0xD6D8DB),
            stroke: am5.color(0x1E3F5B),
            strokeWidth: 1,
            tooltipText: "{name}",
            // showTooltipOn: "always",
        });

        // 툴팁 설정
        let tooltip = am5.Tooltip.new(root, {
            getFillFromSprite: false,
            autoTextColor: false,
        });

        // 툴팁 lebelText Custom
        polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
            let dataItem = ev.target.dataItem;

            if (dataItem) {
                if (dataItem.dataContext.id === "KR-11") {
                    ev.target.set("tooltipText", "서울특별시 I 1개");
                }
                else if (dataItem.dataContext.id === "KR-41") {
                    ev.target.set("tooltipText", "경기도 I 1개");
                }
            }
        });
        
        tooltip.get("background").setAll({
            fill: am5.color(0x222B33),
            fillOpacity: 1,
            strokeOpacity: 0,
        });

        tooltip.label.setAll({
            fill: am5.color(0xFFFFFF)
        });

        polygonSeries.set("tooltip", tooltip);

        polygonSeries.mapPolygons.template.events.on("pointerover", function(event) {
            let dataItem = event.target.dataItem;
            let regionName = dataItem.dataContext.name; // 지역 이름 가져오기
        
            // 서울 및 경기 지역에만 hover 색상 적용
            if (regionName === "Seoul" || regionName === "Gyeonggi") {
                event.target.states.create("hover", {
                    fill: am5.color(0x4BE5DD) // hover 색상
                });
            }
        });
        
        // pointerout 이벤트로 hover 상태 해제
        polygonSeries.mapPolygons.template.events.on("pointerout", function(event) {
            event.target.states.applyAnimate("default"); // 기본 상태로 복귀
        });

        // 현재 서울/경기에만 국사가 존재하므로 나머지 지역은 tooltip 숨김
        polygonSeries.mapPolygons.template.adapters.add("tooltipText", function(text, target) {
            if (target.dataItem.dataContext.id === "KR-11" ||
                target.dataItem.dataContext.id === "KR-41"
            ) {
                return text;
            }
            return "";
        });

        // 클릭 이벤트
        polygonSeries.mapPolygons.template.events.on("click", function(ev) {
            const countryName = ev.target.dataItem.dataContext.name;
            // alert(`클릭한 나라는 ${countryName}입니다.`);
        });

        mapRef.current = { chart, polygonSeries };

        // 줌 컨트롤러 추가
        let zoomControl = am5map.ZoomControl.new(root, {
            sliderHeight: 300,
            x: am5.p100,
            centerX: 150,
            y: am5.p0,
            centerY: -10,
            stateAnimationDuration: 1000,
        });

        let buttonRadius = 18; // 버튼의 반지름

        // 홈 버튼
        zoomControl.homeButton.setAll({
            visible: true,
            icon: am5.Graphics.new(root, {
                svgPath: "M2.00016 13.6249H4.50016V8.62492H9.50016V13.6249H12.0002V6.12492L7.00016 2.37492L2.00016 6.12492V13.6249ZM2.00016 15.2916C1.54183 15.2916 1.14961 15.1285 0.823496 14.8024C0.496829 14.4758 0.333496 14.0833 0.333496 13.6249V6.12492C0.333496 5.86103 0.392663 5.61103 0.510996 5.37492C0.628774 5.13881 0.79183 4.94436 1.00016 4.79158L6.00016 1.04159C6.15294 0.930474 6.31266 0.847141 6.47933 0.791585C6.646 0.73603 6.81961 0.708252 7.00016 0.708252C7.18072 0.708252 7.35433 0.73603 7.521 0.791585C7.68766 0.847141 7.84738 0.930474 8.00016 1.04159L13.0002 4.79158C13.2085 4.94436 13.3718 5.13881 13.4902 5.37492C13.6079 5.61103 13.6668 5.86103 13.6668 6.12492V13.6249C13.6668 14.0833 13.5038 14.4758 13.1777 14.8024C12.851 15.1285 12.4585 15.2916 12.0002 15.2916H7.8335V10.2916H6.16683V15.2916H2.00016Z",
                fill: am5.color(0xFFFFFF)
            }),
            paddingTop: 10,
            paddingLeft: 11,
            width: buttonRadius * 2,
            height: buttonRadius * 2,
            x: 0,
            y: 0
        });

        // 플러스 버튼
        zoomControl.plusButton.setAll({
            icon: am5.Graphics.new(root, {
                svgPath: "M5.99984 11.8334C5.76373 11.8334 5.56595 11.7534 5.4065 11.5934C5.2465 11.434 5.1665 11.2362 5.1665 11.0001V6.83341H0.999837C0.763726 6.83341 0.565671 6.75341 0.405671 6.59341C0.246226 6.43397 0.166504 6.23619 0.166504 6.00008C0.166504 5.76397 0.246226 5.56591 0.405671 5.40591C0.565671 5.24647 0.763726 5.16675 0.999837 5.16675H5.1665V1.00008C5.1665 0.76397 5.2465 0.565915 5.4065 0.405915C5.56595 0.24647 5.76373 0.166748 5.99984 0.166748C6.23595 0.166748 6.434 0.24647 6.594 0.405915C6.75345 0.565915 6.83317 0.76397 6.83317 1.00008V5.16675H10.9998C11.2359 5.16675 11.4337 5.24647 11.5932 5.40591C11.7532 5.56591 11.8332 5.76397 11.8332 6.00008C11.8332 6.23619 11.7532 6.43397 11.5932 6.59341C11.4337 6.75341 11.2359 6.83341 10.9998 6.83341H6.83317V11.0001C6.83317 11.2362 6.75345 11.434 6.594 11.5934C6.434 11.7534 6.23595 11.8334 5.99984 11.8334Z",
                fill: am5.color(0xFFFFFF)
            }),
            paddingTop: 11,
            paddingLeft: 12,
            maxWidth: 36,
            maxHeight: 36,
            x: 50,
            y: 0
        });

        // 마이너스 버튼
        zoomControl.minusButton.setAll({
            icon: am5.Graphics.new(root, {
                svgPath: "M0.999837 1.83341C0.763726 1.83341 0.565671 1.75341 0.405671 1.59341C0.246226 1.43397 0.166504 1.23619 0.166504 1.00008C0.166504 0.76397 0.246226 0.565914 0.405671 0.405914C0.565671 0.24647 0.763726 0.166748 0.999837 0.166748H10.9998C11.2359 0.166748 11.4337 0.24647 11.5932 0.405914C11.7532 0.565914 11.8332 0.76397 11.8332 1.00008C11.8332 1.23619 11.7532 1.43397 11.5932 1.59341C11.4337 1.75341 11.2359 1.83341 10.9998 1.83341H0.999837Z",
                fill: am5.color(0xFFFFFF)
            }),
            paddingTop: 16,
            paddingLeft: 12,
            maxWidth: 36,
            maxHeight: 36,
            x: 100,
            y: 0
        });

        // 기본 background color 설정
        zoomControl.homeButton.get("background").setAll({
            strokeOpacity: 0,
            fill: am5.color(0x1A2228),
            cornerRadiusBL: buttonRadius,
            cornerRadiusBR: buttonRadius,
            cornerRadiusTL: buttonRadius,
            cornerRadiusTR: buttonRadius
        });

        zoomControl.plusButton.get("background").setAll({
            strokeOpacity: 0,
            fill: am5.color(0x1A2228),
            cornerRadiusBL: buttonRadius,
            cornerRadiusBR: buttonRadius,
            cornerRadiusTL: buttonRadius,
            cornerRadiusTR: buttonRadius
        });

        zoomControl.minusButton.get("background").setAll({
            strokeOpacity: 0,
            fill: am5.color(0x1A2228),
            cornerRadiusBL: buttonRadius,
            cornerRadiusBR: buttonRadius,
            cornerRadiusTL: buttonRadius,
            cornerRadiusTR: buttonRadius
        });

        // hover, press시 background color 설정
        zoomControl.homeButton.get("background").states.create("hover", {
            fill: am5.color(0x1A2228)
        });

        zoomControl.plusButton.get("background").states.create("hover", {
            fill: am5.color(0x1A2228)
        });

        zoomControl.minusButton.get("background").states.create("hover", {
            fill: am5.color(0x1A2228)
        });

        zoomControl.homeButton.get("background").states.create("down", {
            fill: am5.color(0x1A2228)
        });

        zoomControl.plusButton.get("background").states.create("down", {
            fill: am5.color(0x1A2228)
        });

        zoomControl.minusButton.get("background").states.create("down", {
            fill: am5.color(0x1A2228)
        });

        // 비활성화 상태에서 스타일 유지 설정
        zoomControl.plusButton.get("background").states.create("disabled", {
            fill: am5.color(0x1A2228)
        });
        zoomControl.minusButton.get("background").states.create("disabled", {
            // 비활성화 상태에서 색상 변경을 막기 위해 기본 스타일 유지
            fill: am5.color(0x1A2228)
        });

        // 커서 변경
        zoomControl.homeButton.set("cursorOverStyle", "pointer");
        zoomControl.plusButton.set("cursorOverStyle", "pointer");
        zoomControl.minusButton.set("cursorOverStyle", "pointer");
        chart.set("zoomControl", zoomControl);

        // 마곡(서울) 및 박달(경기도) 지역 좌표를 지정하여 cities 데이터 생성
        let cities = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [126.82802751624102, 37.56774603467406], // 마곡의 경도, 위도
                    },
                    properties: {
                        name: "마곡국사"
                    }
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [126.90809568263262, 37.40468100149512], // 박달의 경도, 위도
                    },
                    properties: {
                        name: "박달국사"
                    }
                }
            ]
        };

        // 마커 추가
        let pointSeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
                autoScale: false, // 확대시 동일한 크기 유지
                geoJSON: cities
            })
        );

        // 마커 스타일링 및 툴팁 스타일 설정
        pointSeries.bullets.push(function() {
            // 마커 생성
            let bullet = am5.Bullet.new(root, {
                sprite: am5.Picture.new(root, {
                    width: 30,  // 아이콘 크기
                    height: 40, // 아이콘 크기
                    tooltipText: "{name}",  // 툴팁에 표시될 텍스트
                    src: `${markerImg4}`,    // 마커 이미지
                    fill: am5.color(0x222B33),
                })

                // sprite: am5.Circle.new(root, {
                //     radius: 5,
                //     tooltipText: "{name}",
                //     fill: am5.color(0xff0000) // 마커 색상 (빨간색)
                // })
            });
            return bullet;
        });

        // pointSeries.bullets.push(function() {
        //     let marker = am5.Picture.new(root, {
        //         width: 40,
        //         height: 40,
        //         centerX: am5.p50,
        //         centerY: am5.p50,
        //         // src: `${markerImg}`,
        //         tooltipText: "{title}",
        //         tooltip: am5.Tooltip.new(root, {
        //             background: am5.PointedRectangle.new(root, {
        //                 fill: am5.color("#000")
        //             })
        //         })
        //     });

        //     return am5.Bullet.new(root, {
        //         sprite: marker,
        //     });
        // });

        // 언마운트 시 인스턴스 해제
        return () => {
            root.dispose();
        };
    }, [props.targetPolygons]);

    useEffect(() => {
        const coordinatesDatas = DashboardResource.coordinates;
        let coordinates = { longitude: 0, latitude: 0 };

        for (let data in coordinatesDatas) {
            if (coordinatesDatas[data].id === props.selectedRegionNo) {
                coordinates = {longitude: coordinatesDatas[data].longitude, latitude: coordinatesDatas[data].latitude};
                zoomLevel = coordinatesDatas[data].zoom;
            }
        }

        const { chart } = mapRef.current;

        if (chart) {
            if (props.selectedRegionNo > 0 && prevZoomLevel > 1) {
                chart.goHome();

                setTimeout(() => {
                    chart.zoomToGeoPoint(coordinates, zoomLevel);
                }, 1000);

                setPrevZoomLevel(zoomLevel);
            }
            else {
                chart.zoomToGeoPoint(coordinates, zoomLevel);
                setPrevZoomLevel(zoomLevel);
            }
        }
    }, [props.selectedRegionNo]);

    // useEffect(() => {
    //     const { polygonSeries } = mapRef.current;

    //     // 국사가 존재하는 지역의 fill color 변경
    //     if (polygonSeries) {
    //         polygonSeries.events.on("datavalidated", () => {
    //             const targetPolygons = props.targetPolygons;
    
    //             const filteredDataItems = polygonSeries.dataItems.filter(dataItem => 
    //                 targetPolygons.includes(dataItem.get("id"))
    //             );
    //             filteredDataItems.forEach(dataItem => {
    //                 dataItem.get("mapPolygon").set("fill", am5.color(0x4BE5DD));
    //             });
    //         });
    //     }
        
    // }, [props.targetPolygons]);

    return (
        <MapComponent>
            <div className='country'>
                <p>대한민국</p>
            </div>
            <div id='chartdiv' />
        </MapComponent>
    );
};

export default Map;
